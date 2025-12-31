import { AnalysisResult, ExplanationStyle } from "../types";

// NOTE: Schema is now enforced on the backend (Edge Function)
export const analyzeDocument = async (
  text: string,
  base64Image: string | null,
  mimeType: string | null,
  style: ExplanationStyle
): Promise<AnalysisResult> => {
  try {
    const response = await fetch(
      "https://xdmwfurksducxjggfgt.supabase.co/functions/v1/analyze-document",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          text,
          base64Image,
          mimeType,
          style,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI request failed: ${errText}`);
    }

    const data = await response.json();
    return data as AnalysisResult;

  } catch (error: any) {
    console.error("Secure Gemini Analysis Error:", error);
    throw new Error(
      error.message || "Failed to analyze document. Please try again."
    );
  }
};
