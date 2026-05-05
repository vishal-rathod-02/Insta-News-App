import express, { Request, Response } from "express";
import { fetchCarouselNews, fetchNews } from "../services/newsServices.js";

const router = express.Router();

const allowedCountries = ["IN", "US", "UK", "GLOBAL"];

const allowedCategories = [
  "all",
  "top",
  "live",
  "business",
  "technology",
  "world",
  "politics",
  "entertainment",
  "sports",
  "health"
];

const handleNewsRequest = async (
  req: Request,
  res: Response,
  country: string,
  category: string
) => {
  try {
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    const limit = Math.min(Number(req.query.limit) || 12, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const keyword = req.query.keyword as string | undefined;
    const onlyVideo = req.query.video === "true";
    const trending = req.query.trending === "true";

    const articles = await fetchNews(
      country as any,
      category as any,
      limit,
      keyword,
      onlyVideo,
      trending,
      page
    );

    return res.status(200).json({
      success: true,
      data: articles,
      meta: {
        country,
        category,
        count: articles.length,
        limit,
        page,
        keyword: keyword || null,
        videoOnly: onlyVideo,
        trending
      }
    });

  } catch (error) {
    console.error("News fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch news"
    });
  }
};

// =====================================================
//  Carousel Route (Clean REST Design)
// =====================================================
router.get("/carousel/:country", async (req: Request, res: Response) => {
  try {
    let { country } = req.params;

    country = country.toUpperCase();

    if (!allowedCountries.includes(country)) {
      country = "IN";
    }

    const limit = Math.min(Number(req.query.limit) || 15, 30);

    const articles = await fetchCarouselNews(
      country as any,
      limit
    );

    return res.status(200).json({
      success: true,
      data: articles,
      meta: {
        country,
        limit,
        type: "carousel"
      }
    });

  } catch (error) {
    console.error("Carousel fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch carousel news"
    });
  }
});

// =====================================================
// ountry + Category Route
// =====================================================
router.get("/:country/:category", async (req: Request, res: Response) => {
  let { country, category } = req.params;

  country = country.toUpperCase();

  if (!allowedCountries.includes(country)) {
    country = "IN";
  }

  return handleNewsRequest(req, res, country, category);
});

// =====================================================
//  Default India Category Route
// =====================================================
router.get("/:category", async (req: Request, res: Response) => {
  const { category } = req.params;
  return handleNewsRequest(req, res, "IN", category);
});

export default router;