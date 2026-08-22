import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_")) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
};

export const summarizeArticleWithGemini = async (
  title: string,
  content: string,
  mode: string = "bullet",
  language: string = "en"
): Promise<string> => {
  try {
    if (!content || content.trim().length < 20) {
      return "Not enough content available to summarize.";
    }

    const ai = getGeminiClient();

    // ----------------------------------------------------
    // Option 1: Try AI Summarization via Google Gemini
    // ----------------------------------------------------
    if (ai) {
      try {
        const promptMode =
          mode === "simple"
            ? "Provide a concise 3-sentence summary paragraph."
            : "Provide 5 clear, high-impact bullet points starting each line with '* '.";

        const targetLang = language === "hi" ? "Hindi" : "English";

        const prompt = `Summarize the following news article in ${targetLang}.
Title: ${title}
Content: ${content}

Format: ${promptMode}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response && response.text) {
          return response.text.trim();
        }
      } catch (aiError) {
        console.warn("Gemini API call failed, falling back to algorithm:", aiError);
      }
    }

    // ----------------------------------------------------
    // Option 2: Fallback Sentence Extraction Algorithm
    // ----------------------------------------------------
    const sentences = content
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentences.length === 0) {
      return "Content could not be parsed for a summary.";
    }

    let summaryText = "";

    if (mode === "simple") {
      const paragraphSentences = sentences.slice(0, 3);
      summaryText = paragraphSentences.join(" ");
    } else {
      const bulletSentences = sentences.slice(0, 5);
      summaryText = bulletSentences.map(s => `* ${s}`).join("\n");
    }

    return summaryText;

  } catch (error) {
    console.error("Summary generation error:", error);
    return "Summary generation failed. Please try again later.";
  }
};
