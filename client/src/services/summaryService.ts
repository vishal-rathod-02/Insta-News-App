import { getApiUrl } from "../utils/apiConfig";

export type SummaryMode = "bullet" | "simple" | "executive";
export type SummaryLanguage = "en" | "hi";

export interface SummaryOptions {
  mode?: SummaryMode;
  language?: SummaryLanguage;
}

/**
 * Fetch an AI-generated summary with mode & language options
 */
export const fetchArticleSummary = async (
  title: string,
  content: string,
  options?: SummaryOptions
): Promise<{ text: string; cached: boolean }> => {
  const response = await fetch(getApiUrl("/api/summarize"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      mode: options?.mode ?? "bullet",
      language: options?.language ?? "en",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch summary from server.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Summary generation failed.");
  }

  return { text: data.data, cached: !!data.cached };
};

/**
 * Ask AI a question about a specific news article
 */
export const askArticleQuestion = async (
  title: string,
  content: string,
  question: string
): Promise<string> => {
  const response = await fetch(getApiUrl("/api/summarize/ask"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      question,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from AI.");
  }

  const data = await response.json();

  return data.data;
};

export interface ArticleAnalysis {
  biasRating: string;
  objectivityScore: number;
  toneType: string;
  sentiment: string;
  sentimentScore: number;
  keyVerifiedFacts: string[];
  readTimeMinutes: number;
}

/**
 * Fetch AI Fact-Check, Bias & Sentiment Analysis
 */
export const fetchArticleAnalysis = async (
  title: string,
  content: string
): Promise<ArticleAnalysis> => {
  const response = await fetch(getApiUrl("/api/summarize/analyze"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article analysis.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to analyze article.");
  }

  return data.data;
};
