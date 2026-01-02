import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Validate Request Body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, fileBase64, fileType, style } = body;

    // 3. Check for Gemini API Key
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      console.error("Missing GEMINI_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API Key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Construct Gemini Prompt
    const promptText = text || "Analyze this document and provide key insights.";
    
    // Define the required JSON structure in the prompt
    let finalPrompt = `${promptText}

    You are an expert risk analyst. Analyze the provided content.
    Return ONLY a raw JSON object with no markdown formatting. The JSON must follow this schema:
    {
      "meaning": "Clear explanation of what the document says (string)",
      "actions": ["Actionable step 1", "Actionable step 2"] (array of strings),
      "riskLevel": "Low" | "Medium" | "High" (string enum),
      "riskReason": "Why this risk level was assigned (string)"
    }`;

    if (style) {
      finalPrompt += `\n\nStyle: ${style}`;
    }

    const parts: any[] = [];
    
    // Add file if present (Multimodal)
    if (fileBase64 && fileType) {
      parts.push({
        inlineData: {
          mimeType: fileType,
          data: fileBase64
        }
      });
    }
    
    // Add text prompt
    parts.push({ text: finalPrompt });

    // 5. Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
    
    console.log("Calling Gemini API with JSON instruction...");
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: {
            responseMimeType: "application/json"
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      return new Response(
        JSON.stringify({ error: "AI Service Error", details: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      console.error("Unexpected Gemini response structure:", JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ error: "Failed to generate response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse the JSON result from the AI
    let parsedResult;
    try {
        parsedResult = JSON.parse(resultText);
    } catch (e) {
        console.error("Failed to parse AI JSON response:", resultText);
         // Fallback or returned error
         parsedResult = {
             meaning: resultText,
             actions: [],
             riskLevel: "Unknown",
             riskReason: "Failed to parse structured output"
         }
    }

    // 6. Return Success Response
    return new Response(JSON.stringify({ result: parsedResult }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Edge Function Exception:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
