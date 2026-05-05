import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarize.js";
import newsRouter from './routes/news.js';
import sportsRouter from './routes/sports.js';
import preferencesRouter from './routes/preferences.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

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
