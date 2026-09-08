import express, { Request, Response } from "express";
import { summarizeArticleWithGemini, askAiAboutArticle, analyzeArticleBiasAndFacts } from "../services/aiModal.js";
import rateLimit from "express-rate-limit";
import Summary from "../models/Summary.js";

const router = express.Router();

const summaryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  message: { success: false, message: "Too many AI requests, please wait a minute." },
});

router.use(summaryLimiter);

/**
 * POST /api/summarize
 * Generate or retrieve cached AI summaries
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, mode = "bullet", language = "en" } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    if (typeof title !== "string" || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input format.",
      });
    }

    // Cache key
    const cacheKey = `${title.trim().toLowerCase()}-${mode}-${language}`;

    // Check persistent DB cache first
    try {
      const existingSummary = await Summary.findOne({ cacheKey });
      if (existingSummary && existingSummary.summaryText) {
        return res.status(200).json({
          success: true,
          data: existingSummary.summaryText,
          cached: true,
        });
      }
    } catch (cacheErr) {
      console.warn("Summary cache lookup skipped:", cacheErr);
    }

    // Generate new summary via AI
    const summary = await summarizeArticleWithGemini(title, content, mode, language);

    // Save to persistent DB cache
    if (
      !summary.includes("unavailable") &&
      !summary.includes("Not enough content") &&
      !summary.includes("failed")
    ) {
      try {
        await Summary.create({
          cacheKey,
          articleTitle: title,
          mode,
          language,
          summaryText: summary,
        });
      } catch (saveErr) {
        console.warn("Summary cache save skipped:", saveErr);
      }
    }

    return res.status(200).json({
      success: true,
      data: summary,
      cached: false,
    });
  } catch (error) {
    console.error("Summary route error:", error);
    return res.status(500).json({
      success: false,
      message: "Summary generation failed.",
    });
  }
});

/**
 * POST /api/summarize/ask
 * Ask Gemini contextual questions about the news article
 */
router.post("/ask", async (req: Request, res: Response) => {
  try {
    const { title, content, question } = req.body;

    if (!title || !content || !question) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and question are required.",
      });
    }

    const answer = await askAiAboutArticle(title, content, question);

    return res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    console.error("Ask AI route error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to answer question.",
    });
  }
});

/**
 * POST /api/summarize/analyze
 * Generates AI bias score, sentiment radar, and verified facts
 */
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const analysis = await analyzeArticleBiasAndFacts(title, content);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis route error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze article.",
    });
  }
});

export default router;
