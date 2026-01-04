import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../utils/db';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const analyzeSchema = z.object({
    text: z.string().optional(),
    fileContent: z.string().optional(), // Base64
    fileType: z.string().optional(),
});

export const analyzeDocument = async (req: FastifyRequest<{ Body: z.infer<typeof analyzeSchema> }>, reply: FastifyReply) => {
    const { text, fileContent, fileType } = req.body;
    const user = (req as any).user as { id: string };

    if (!GEMINI_API_KEY) {
        return reply.code(500).send({ error: 'Server configuration error' });
    }

    // Check Credits & Daily Refill
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return reply.code(401).send({ error: "User not found" });

    // Refill logic with Null Safety
    const now = new Date();
    const lastRefill = dbUser.lastRefill ? new Date(dbUser.lastRefill) : new Date(0);
    const isNewDay = now.toDateString() !== lastRefill.toDateString();
    let currentCredits = dbUser.credits ?? 0;

    // Self-Healing
    if (isNewDay || dbUser.credits === null || dbUser.credits === undefined) {
        try {
            console.log(`[REFILL] Resetting credits for user ${user.id}`);
            const updated = await prisma.user.update({
                where: { id: user.id },
                data: { credits: 5, lastRefill: now }
            });
            currentCredits = updated.credits;
        } catch (e) {
            console.error("Refill error:", e);
            currentCredits = 5; // Fallback
        }
    }

    if (currentCredits <= 0) {
        return reply.code(403).send({ error: "Daily limit reached.", code: 'LIMIT_REACHED' });
    }

    try {
        // Construct Gemini User Prompt - CORRECTED TO ASK FOR riskReason
        const prompt = `
            You are an expert legal aide. Simply explain this document.
            Return JSON: 
            { 
              "riskLevel": "High" | "Medium" | "Low", 
              "meaning": "String", 
              "actions": ["String"],
              "riskReason": "Short explanation of why this risk level was chosen"
            }
            No markdown.
        `;

        const parts: any[] = [{ text: prompt }];

        if (fileContent && fileType) {
            parts.push({
                inlineData: { mimeType: fileType, data: fileContent }
            });
        } else if (text) {
            parts.push({ text: `\n\nCONTENT:\n${text}` });
        } else {
            return reply.code(400).send({ error: 'No content provided' });
        }

        // Switching to gemini-2.0-flash-exp as per user request (Schema is now fixed, so this should work)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("AI API Error:", err);
            return reply.code(502).send({ error: 'AI Service Error', details: err });
        }

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        let analysis;
        try {
            // Clean markdown code blocks if present
            const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse", resultText);
            return reply.code(500).send({ error: 'Failed to parse AI response' });
        }

        // Save to DB - CORRECTED TO INCLUDE SAFE FALLBACKS
        const doc = await prisma.document.create({
            data: {
                userId: user.id,
                filename: "Uploaded Document",
                type: fileType || "text/plain",
                size: fileContent ? fileContent.length : (text?.length || 0),
                content: text || "File Content",
                analysis: {
                    create: {
                        meaning: analysis.meaning || "No summary available",
                        actions: analysis.actions || [],
                        riskLevel: analysis.riskLevel || "Low",
                        // CRITICAL FIX: Fallback for riskReason
                        riskReason: analysis.riskReason || "No specific risk factor identified"
                    }
                }
            },
            include: { analysis: true }
        });

        // Deduct Credit
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } }
        });

        return reply.send({ document: doc, credits: updatedUser.credits });

    } catch (error) {
        req.log.error(error);
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
};
