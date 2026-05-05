import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const summarizeArticleWithGemini = async (
  title: string,
  content: string,
  mode: string = "bullet",
  language: string = "en"
): Promise<string> => {
  try {
    if (!content || content.trim().length < 50) {
      return "Not enough content available to summarize.";
    }

    const languageInstruction = language === "hi" ? "Provide the summary in Hindi." : "Provide the summary in English.";
    const modeInstruction = mode === "simple" 
      ? "Summarize the article in a simple, easy-to-understand paragraph." 
      : "Summarize the following article into 5 clear bullet points.";

    const prompt = `
You are a professional news editor.

${modeInstruction}
${languageInstruction}
Keep it neutral, factual, and easy to read.
Do not add assumptions or extra information.

Article Title: "${title}"

Article Content:
---
${content.substring(0, 4000)}
---

Summary:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 300
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }

    return response.text.trim();

  } catch (error) {
    console.error("Gemini API error:", error);
    return "AI summary is currently unavailable. Please try again later.";
  }
};
