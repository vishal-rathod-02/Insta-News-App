import { Router, Request, Response } from "express";

const router = Router();

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  category: string;
  totalVotes: number;
  options: PollOption[];
  expiresAt: string;
}

// In-memory poll store with realistic defaults
let dailyPoll: Poll = {
  id: "poll-2026-tech-ai",
  question: "Will Generative AI agents become the primary way people consume news by 2027?",
  category: "Technology & AI",
  totalVotes: 1420,
  options: [
    { id: "opt-1", text: "Yes, personalized AI briefs are the future", votes: 894 },
    { id: "opt-2", text: "No, traditional human journalism will stay preferred", votes: 382 },
    { id: "opt-3", text: "Hybrid model (human verified + AI curated)", votes: 144 },
  ],
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

/**
 * GET /api/polls/today
 * Returns today's active headline poll
 */
router.get("/today", (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: dailyPoll,
  });
});

/**
 * POST /api/polls/vote
 * Body: { pollId: string, optionId: string }
 */
router.post("/vote", (req: Request, res: Response) => {
  try {
    const { pollId, optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({ success: false, message: "Option ID is required." });
    }

    const option = dailyPoll.options.find((opt) => opt.id === optionId);
    if (!option) {
      return res.status(404).json({ success: false, message: "Poll option not found." });
    }

    option.votes += 1;
    dailyPoll.totalVotes += 1;

    return res.json({
      success: true,
      data: dailyPoll,
      message: "Vote counted successfully!",
    });
  } catch (error) {
    console.error("Error voting on poll:", error);
    return res.status(500).json({ success: false, message: "Failed to record vote." });
  }
});

export default router;
