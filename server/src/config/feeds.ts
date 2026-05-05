import { Country, Category } from "../types/news.js";

// -----------------------------
// Controlled Country Feed Engine
// -----------------------------
export const FEEDS: Record<Country, Record<Category, string[]>> = {
  IN: {
    live: ["https://timesofindia.indiatimes.com/rssfeedstopstories.cms"],
    top: [
      "https://feeds.feedburner.com/ndtvnews-top-stories",
      "https://indianexpress.com/section/india/feed/",
    ],
    business: [
      "https://www.thehindu.com/business/feeder/default.rss",
      "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml",
    ],
    technology: [
      "https://feeds.feedburner.com/gadgets360-latest",
      "https://indianexpress.com/section/technology/feed/",
    ],
    world: ["https://www.thehindu.com/news/international/feeder/default.rss"],
    politics: [
      "https://indianexpress.com/section/political-pulse/feed/",
      "https://www.thehindu.com/news/national/feeder/default.rss",
    ],
    entertainment: [
      "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml",
    ],
    sports: [
      "https://indianexpress.com/section/sports/feed/",
      "https://feeds.feedburner.com/ndtvsports-latest",
    ],
    health: [
      "https://www.thehindu.com/sci-tech/health/feeder/default.rss",
      "https://feeds.feedburner.com/ndtvhealth-latest",
    ],
  },
  US: {
    live: ["https://moxie.foxnews.com/google-publisher/latest.xml"],
    top: [
      "https://www.cbsnews.com/latest/rss/main",
      "https://feeds.foxnews.com/foxnews/latest"
    ],
    business: [
      "https://feeds.foxnews.com/foxnews/bussiness"
    ],
    technology: [
      "https://www.theverge.com/rss/index.xml",
      "https://feeds.foxnews.com/foxnews/scitech"
    ],
    world: [
      "https://www.cbsnews.com/latest/rss/world"
    ],
    politics: [
      "https://www.cbsnews.com/latest/rss/politics",
      "https://feeds.foxnews.com/foxnews/politics"
    ],
    entertainment: [
      "https://www.hollywoodreporter.com/feed/"
    ],
    sports: [
      "https://feeds.foxnews.com/foxnews/sports"
    ],
    health: [
      "https://www.cbsnews.com/latest/rss/health",
      "https://feeds.foxnews.com/foxnews/health"
    ]
  },
  UK: {
    live: ["https://feeds.skynews.com/feeds/rss/home.xml"],
    top: ["https://feeds.skynews.com/feeds/rss/home.xml"],
    business: ["https://feeds.skynews.com/feeds/rss/business.xml"],
    technology: ["https://feeds.skynews.com/feeds/rss/technology.xml"],
    world: ["https://feeds.skynews.com/feeds/rss/world.xml"],
    politics: ["https://feeds.skynews.com/feeds/rss/politics.xml"],
    entertainment: ["https://feeds.skynews.com/feeds/rss/entertainment.xml"],
    sports: [
      "https://feeds.skynews.com/feeds/rss/sport.xml",
      "https://www.skysports.com/rss/12040",
    ],
    health: [
      "https://feeds.reuters.com/reuters/healthNews",
      "https://www.theguardian.com/society/health/rss",
    ],
  },
};

// Sub-category specific feeds to enrich the data when a subcategory keyword is used
export const SUBCATEGORY_FEEDS: Partial<Record<Country, Record<string, string[]>>> = {
  IN: {
    // Sports
    cricket: ["https://indianexpress.com/section/sports/cricket/feed/"],
    football: ["https://indianexpress.com/section/sports/football/feed/"],
    tennis: ["https://indianexpress.com/section/sports/tennis/feed/"],
    f1: ["https://www.skysports.com/rss/12433"], // Global
    // Business
    markets: ["https://www.thehindu.com/business/markets/feeder/default.rss"],
    economy: ["https://www.thehindu.com/business/Economy/feeder/default.rss"],
    startups: ["https://indianexpress.com/section/business/startups/feed/"],
    // Entertainment
    movies: ["https://indianexpress.com/section/entertainment/bollywood/feed/"],
    television: ["https://indianexpress.com/section/entertainment/television/feed/"],
    music: ["https://indianexpress.com/section/entertainment/music/feed/"],
    // Technology
    ai: ["https://indianexpress.com/section/technology/artificial-intelligence/feed/"],
    gadgets: ["https://feeds.feedburner.com/gadgets360-latest"],
    software: ["https://indianexpress.com/section/technology/tech-news-technology/feed/"],
    // Health
    fitness: ["https://indianexpress.com/section/lifestyle/fitness/feed/"],
    nutrition: ["https://indianexpress.com/section/lifestyle/food-wine/feed/"],
    "mental-health": ["https://indianexpress.com/section/lifestyle/health/feed/"]
  },
  UK: {
    football: ["https://www.skysports.com/rss/12040"],
    cricket: ["https://www.skysports.com/rss/12123"],
    f1: ["https://www.skysports.com/rss/12433"],
    tennis: ["https://www.skysports.com/rss/12110"]
  }
};
