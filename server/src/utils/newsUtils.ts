import { Article } from "../types/news.js";

// ImageURL Extracter for every Feed.
export const extractImage = (item: any): string | null => {
  // enclosure
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  const mediaContent = item["media:content"];

  // Case 1: media:content is array
  if (Array.isArray(mediaContent)) {
    const first = mediaContent[0];
    if (first?.url) return first.url;
    if (first?.$?.url) return first.$.url;
  }

  // Case 2: media:content is single object
  if (mediaContent?.$?.url) {
    return mediaContent.$.url;
  }

  const mediaThumbnail = item["media:thumbnail"];

  if (Array.isArray(mediaThumbnail)) {
    const first = mediaThumbnail[0];
    if (first?.url) return first.url;
    if (first?.$?.url) return first.$.url;
  }

  if (mediaThumbnail?.$?.url) {
    return mediaThumbnail.$.url;
  }

  const html = item["content:encoded"] || item.content;

  if (html) {
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
    if (match?.[1]) return match[1];
  }

  return null;
};

export const removeDuplicates = (articles: Article[]): Article[] => {
  const seen = new Set<string>();

  return articles.filter((article) => {
    const key = `${article.title.trim().toLowerCase()}-${article.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
