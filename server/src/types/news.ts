export type Country = "IN" | "US" | "UK";

export type Category =
  | "top"
  | "live"
  | "business"
  | "technology"
  | "world"
  | "politics"
  | "entertainment"
  | "sports"
  | "health";

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  contentSnippet: string;
  source: string;
  imageUrl: string | null;
  isVideo: boolean;
  score?: number;
  category?: string;
}
