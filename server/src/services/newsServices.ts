import Parser from "rss-parser";
import { Country, Category, Article } from "../types/news.js";
import { FEEDS, SUBCATEGORY_FEEDS } from "../config/feeds.js";
import { extractImage, removeDuplicates } from "../utils/newsUtils.js";

const parser = new Parser({
  timeout: 5000,
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["content:encoded", "content:encoded"],
    ],
  },
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*"
  }
});

const fetchWithTimeout = async (url: string, timeoutMs: number = 3000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout fetching ${url}`)), timeoutMs);
    parser.parseURL(url)
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// -----------------------------
// In-Memory Cache
// -----------------------------
const cache = new Map<string, Article[]>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// -----------------------------
// Main Fetch Function
// -----------------------------
export const fetchNews = async (
  country: Country = "IN",
  category: Category | "all" = "top",
  limit: number = 20,
  keyword?: string,
  onlyVideo: boolean = false,
  trending: boolean = false,
  page: number = 1
): Promise<Article[]> => {
  const cacheKey = `${country}-${category}-${keyword ?? ""}-${onlyVideo}-${trending}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!.slice((page - 1) * limit, page * limit);
  }

  let feedUrls: string[] = [];
  let usingSpecificFeeds = false;

  if (category === "all") {
    const categories = Object.keys(FEEDS[country]) as Category[];
    feedUrls = categories.flatMap((cat) => FEEDS[country][cat]);
  } else {
    feedUrls = FEEDS[country]?.[category as Category] || [];
  }

  // Inject specific subcategory feeds if keyword matches a known subcategory
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    const specificFeeds = SUBCATEGORY_FEEDS[country]?.[lowerKeyword];
    if (specificFeeds) {
      // ONLY use the specific feeds to avoid unrelated news diluting the subcategory
      feedUrls = specificFeeds;
      usingSpecificFeeds = true;
    }
  }

  if (!feedUrls || feedUrls.length === 0) return [];

  const results = await Promise.allSettled(
    feedUrls.map((url) => fetchWithTimeout(url)),
  );

  let articles: Article[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const feed = result.value;

      feed.items.forEach((item: any) => {
        articles.push({
          id: item.guid || item.link || Math.random().toString(),
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.isoDate ?? item.pubDate ?? "",
          creator: item.creator ?? "Unknown",
          contentSnippet: item.contentSnippet ?? "",
          source: feed.title ?? "Unknown",
          imageUrl: extractImage(item),
          isVideo: !!item.enclosure?.type?.includes("video"),
        });
      });
    }
  });

  articles = removeDuplicates(articles);

  // Keyword Filter
  if (keyword && !usingSpecificFeeds) {
    const lowerKeyword = keyword.toLowerCase();
    articles = articles.filter((a) => {
      const matchTitle = a.title?.toLowerCase().includes(lowerKeyword) || false;
      const matchSnippet = a.contentSnippet?.toLowerCase().includes(lowerKeyword) || false;
      const matchCreator = a.creator?.toLowerCase().includes(lowerKeyword) || false;
      return matchTitle || matchSnippet || matchCreator;
    });
  }

  // Video Filter
  if (onlyVideo) {
    articles = articles.filter((a) => a.isVideo);
  }

  // Trending Score Logic
  if (trending) {
    articles.forEach((article) => {
      article.score =
        new Date(article.pubDate).getTime() / 1000000000 + Math.random() * 10;
    });

    articles.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  } else {
    articles.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );
  }

  cache.set(cacheKey, articles);
  setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

  return articles.slice((page - 1) * limit, page * limit);
};

export const fetchCarouselNews = async (
  country: Country,
  limit: number = 15,
): Promise<Article[]> => {
  const categories = Object.keys(FEEDS[country]) as Category[];
  const feedUrls = categories.flatMap((cat) => FEEDS[country][cat]);

  const results = await Promise.allSettled(
    feedUrls.map((url) => fetchWithTimeout(url)),
  );

  let articles: Article[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      const feed = result.value;

      feed.items.forEach((item: any) => {
        articles.push({
          id: item.guid || item.link || Math.random().toString(),
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.isoDate ?? item.pubDate ?? "",
          creator: item.creator ?? "Unknown",
          contentSnippet: item.contentSnippet ?? "",
          source: feed.title ?? "Unknown",
          imageUrl: extractImage(item),
          isVideo:
            item.enclosure?.type?.includes("video") ||
            item.link?.toLowerCase().includes("video") ||
            false,
        });
      });
    }
  });

  articles = removeDuplicates(articles);

  articles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  return articles.slice(0, limit);
};
