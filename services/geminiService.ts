import { supabase } from "./supabase";
import { AnalysisResult } from "../types";

export const analyzeDocument = async (
  text: string,
  fileBase64?: string | null,
  fileType?: string | null,
  style?: string
): Promise<AnalysisResult> => {
  const { data, error } = await supabase.functions.invoke(
    "analyze-document",
    {
      body: { 
        text,
        fileBase64,
        fileType,
        style
      },
    }
  );

  if (error) {
    console.error("Edge error:", error);
    throw new Error(error.message || "Failed to analyze document");
  }

  return data.result;
};
