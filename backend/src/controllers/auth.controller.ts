import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../utils/db';
import { hashPassword, verifyPassword } from '../utils/hash';
import { signToken } from '../utils/jwt';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerUser = async (req: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>, reply: FastifyReply) => {
    const { email, password } = req.body;
    console.log("Registering user:", email);

    try {
        console.log("Checking if user exists...");
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log("User already exists");
            return reply.code(400).send({ error: 'User already exists' });
        }

        console.log("Hashing password...");
        const hashedPassword = await hashPassword(password);

        console.log("Creating user in DB...");
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                credits: 5,
                lastRefill: new Date()
            },
        });
        console.log("User created:", user.id);

        const token = signToken({ id: user.id, email: user.email });
        return reply.code(201).send({ user: { id: user.id, email: user.email, credits: user.credits }, token });
    } catch (error) {
        console.error("Register Error:", error);
        req.log.error(error);
        return reply.code(500).send({ error: 'Internal Server Error', details: (error as any).message });
    }
};

export const loginUser = async (req: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>, reply: FastifyReply) => {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Email: ${email}`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("[LOGIN FAIL] User not found");
            return reply.code(400).send({ error: 'Invalid email or password' });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            console.log("[LOGIN FAIL] Invalid password");
            return reply.code(400).send({ error: 'Invalid email or password' });
        }

        console.log(`[LOGIN SUCCESS] User: ${user.id}, Credits: ${user.credits}, Refill: ${user.lastRefill}`);

        // Daily Refill & Self-Healing Logic
        const now = new Date();
        const lastRefill = user.lastRefill ? new Date(user.lastRefill) : new Date(0);

        // Force reset if credits are missing (legacy data) or it's a new day
        const isNewDay = now.toDateString() !== lastRefill.toDateString();
        const needsHealing = user.credits === null || user.credits === undefined;

        let currentCredits = user.credits ?? 0;

        if (isNewDay || needsHealing) {
            console.log(`[REFILL] New Day: ${isNewDay}, Needs Healing: ${needsHealing}. Resetting to 5.`);
            try {
                const updated = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        credits: 5,
                        lastRefill: now
                    }
                });
                currentCredits = updated.credits;
                console.log(`[REFILL SUCCESS] New Credits: ${currentCredits}`);
            } catch (err) {
                console.error("[REFILL ERROR] DB Update failed:", err);
                // Return 5 anyway to allow access for this session, even if DB write failed
                currentCredits = 5;
            }
        }

        const token = signToken({ id: user.id, email: user.email });
        return reply.code(200).send({ user: { id: user.id, email: user.email, credits: currentCredits }, token });
    } catch (error) {
        console.error("[SYSTEM ERROR] Login handler crashed:", error);
        req.log.error(error);
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
};
