import { getApiUrl } from "../utils/apiConfig";

export const fetchArticleSummary = async (
  title: string,
  content: string,
  options?: {
    mode?: "bullet" | "simple";
    language?: "en" | "hi";
  }
): Promise<string> => {

  const response = await fetch(getApiUrl("/api/summarize"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      mode: options?.mode ?? "bullet",
      language: options?.language ?? "en"
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch summary");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Summary failed");
  }

  return data.data; 
};
