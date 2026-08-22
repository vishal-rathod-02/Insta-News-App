import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarize.js";
import newsRouter from './routes/news.js';
import sportsRouter from './routes/sports.js';
import preferencesRouter from './routes/preferences.js';

const app = express();

// Enable trust proxy for reverse proxy platforms like Render/AWS/Vercel
app.set("trust proxy", 1);

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
import rateLimit from "express-rate-limit";

app.use(express.json({ limit: "10mb" }));

// Rate Limiter to protect server against request flooding (100 requests per minute per IP)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." }
});

app.use("/api", apiLimiter);

// Health check endpoint for Render / Uptime monitors
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/summarize", summarizeRoutes);
app.use("/api/news", newsRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/preferences", preferencesRouter);

// Global Error Handler to prevent server crashes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Express Error:", err);
  if (!res.headersSent) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default app;
