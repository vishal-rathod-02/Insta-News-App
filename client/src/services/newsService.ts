import type { NewsArticle } from "../utils/types";
import { getApiUrl } from "../utils/apiConfig";

export const getNewsForCategory = async (
  country: string,
  category: string,
  limit: number = 9,
  options?: {
    keyword?: string;
    video?: boolean;
    trending?: boolean;
    page?: number;
  }
): Promise<NewsArticle[]> => {

  const params = new URLSearchParams();
  params.append("limit", limit.toString());

  if (options?.page) {
    params.append("page", options.page.toString());
  }

  if (options?.keyword) {
    params.append("keyword", options.keyword);
  }

  if (options?.video) {
    params.append("video", "true");
  }

  if (options?.trending) {
    params.append("trending", "true");
  }

  const response = await fetch(
    getApiUrl(`/api/news/${country}/${category}?${params.toString()}`)
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch news");
  }

  return data.data as NewsArticle[];
};
