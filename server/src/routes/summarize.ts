import express, { Request, Response } from "express";
import { summarizeArticleWithGemini } from "../services/aiModal.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const summaryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute per IP
});

router.use(summaryLimiter);

// In-memory summary cache
const summaryCache = new Map<string, string>();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, mode = "bullet", language = "en" } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required."
      });
    }

    if (typeof title !== "string" || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input format."
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Content too large to summarize."
      });
    }

    // Cache key
    const cacheKey = `${title.trim().toLowerCase()}-${mode}-${language}`;

    if (summaryCache.has(cacheKey)) {
      return res.status(200).json({
        success: true,
        data: summaryCache.get(cacheKey),
        cached: true
      });
    }

    const summary = await summarizeArticleWithGemini(title, content, mode, language);

    summaryCache.set(cacheKey, summary);

    res.status(200).json({
      success: true,
      data: summary,
      cached: false
    });

  } catch (error) {
    console.error("Summary route error:", error);

    res.status(500).json({
      success: false,
      message: "Summary generation failed"
    });
  }
});

export default router;
