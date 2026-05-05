import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
// Catch unhandled errors to prevent process crash
process.on("uncaughtException", (err: NodeJS.ErrnoException) => {
  console.error("Uncaught Exception:", err);
  if (err.code !== "ECONNRESET" && err.code !== "EPIPE") {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 3004;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
