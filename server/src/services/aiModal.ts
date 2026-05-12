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

    // Manual Algorithm: Split content into sentences
    // Using a basic regex to split by period, exclamation, or question mark followed by a space
    const sentences = content
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentences.length === 0) {
      return "Content could not be parsed for a summary.";
    }

    let summaryText = "";

    if (mode === "simple") {
      // Take the first 3 sentences for a simple paragraph
      const paragraphSentences = sentences.slice(0, 3);
      summaryText = paragraphSentences.join(" ");
    } else {
      // Default to bullet points: Take up to 5 sentences
      const bulletSentences = sentences.slice(0, 5);
      summaryText = bulletSentences.map(s => `* ${s}`).join("\n");
    }

    // Note for translation: Since we removed the AI, true translation requires a dedicated API.
    // For now, we return the algorithmic extraction. If language is Hindi, we add a brief prefix note.
    if (language === "hi") {
      return `(नोट: एआई कोटा समाप्त हो गया है। यहाँ मूल लेख का सीधा सारांश दिया गया है)\n\n${summaryText}`;
    }

    return summaryText;

  } catch (error) {
    console.error("Manual Summary error:", error);
    return "Summary generation failed. Please try again later.";
  }
};
