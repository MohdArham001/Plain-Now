
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ExplanationStyle, RiskLevel } from '../types';

// Define the expected output schema for the model
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    meaning: {
      type: Type.STRING,
      description: "A simple, non-technical explanation of what the document means.",
    },
    actions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of clear, actionable bullet points describing what the user should do next.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "The risk level associated with the document content.",
    },
    riskReason: {
      type: Type.STRING,
      description: "A short explanation of why this risk level was assigned.",
    },
  },
  required: ["meaning", "actions", "riskLevel", "riskReason"],
};

export const analyzeDocument = async (
  text: string,
  base64Image: string | null,
  mimeType: string | null,
  style: ExplanationStyle
): Promise<AnalysisResult> => {
  // Always create a new instance to pick up the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // Construct the prompt based on the selected style
  let styleInstruction = "";
  switch (style) {
    case ExplanationStyle.SIMPLE_30_SEC:
      styleInstruction = "Provide a concise 30-second summary. Be brief and professional.";
      break;
    case ExplanationStyle.ELI5:
      styleInstruction = "Explain it like I am 5 years old. Use very simple analogies and language.";
      break;
    case ExplanationStyle.ACTION_ONLY:
      styleInstruction = "Focus heavily on the 'What You Should Do Next' section. Keep the meaning very brief.";
      break;
  }

  const systemInstruction = `
    You are PlainNow's clarity engine. Your goal is to demystify confusing real-world documents (bank emails, college notices, insurance text, government letters).
    
    Rules:
    1. Translate complex jargon into simple human language.
    2. Be objective and calm.
    3. STRICTLY return JSON matching the provided schema.
    4. ${styleInstruction}
    5. This is NOT legal or medical advice.
  `;

  // Prepare contents
  const parts: any[] = [];
  
  if (text) {
    parts.push({ text: `Document Text:\n${text}` });
  }

  if (base64Image && mimeType) {
    parts.push({
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    });
  }
  
  parts.push({ text: "Please analyze the provided content and extract the meaning, action items, and risk assessment according to the system instructions." });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response generated from AI.");
    }

    try {
      return JSON.parse(jsonText.trim()) as AnalysisResult;
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError, "Response:", jsonText);
      // Fallback clean-up
      const cleaned = jsonText.replace(/```json\s?|```/g, '').trim();
      return JSON.parse(cleaned) as AnalysisResult;
    }

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze document. Please try again.");
  }
};
