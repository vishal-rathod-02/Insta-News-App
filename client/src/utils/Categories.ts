import type { NewsCategory } from "./types";

export const CATEGORIES: NewsCategory[] = [
  { id: "top", title: "Top Stories" },
  { 
    id: "business", 
    title: "Business",
    subcategories: [
      { id: "markets", title: "Markets" },
      { id: "economy", title: "Economy" },
      { id: "startups", title: "Startups" }
    ]
  },
  { 
    id: "technology", 
    title: "Technology",
    subcategories: [
      { id: "ai", title: "Artificial Intelligence" },
      { id: "gadgets", title: "Gadgets" },
      { id: "software", title: "Software" }
    ]
  },
  { id: "world", title: "World News" },
  { id: "politics", title: "Politics" },
  { 
    id: "entertainment", 
    title: "Entertainment",
    subcategories: [
      { id: "movies", title: "Movies" },
      { id: "music", title: "Music" },
      { id: "television", title: "Television" }
    ]
  },
  { 
    id: "sports", 
    title: "Sports",
    subcategories: [
      { id: "cricket", title: "Cricket" },
      { id: "football", title: "Football" },
      { id: "tennis", title: "Tennis" },
      { id: "f1", title: "Formula 1" }
    ]
  },
  { 
    id: "health", 
    title: "Health",
    subcategories: [
      { id: "fitness", title: "Fitness" },
      { id: "nutrition", title: "Nutrition" },
      { id: "mental-health", title: "Mental Health" }
    ]
  }
];


