import mongoose, { Schema, Document } from "mongoose";

export interface ISummary extends Document {
  cacheKey: string;
  articleTitle: string;
  mode: string;
  language: string;
  summaryText: string;
  createdAt: Date;
}

const SummarySchema: Schema = new Schema(
  {
    cacheKey: { type: String, required: true, unique: true, index: true },
    articleTitle: { type: String, required: true },
    mode: { type: String, required: true },
    language: { type: String, required: true },
    summaryText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }, // 7-day TTL auto-expire
  },
  { timestamps: true }
);

export default mongoose.model<ISummary>("Summary", SummarySchema);
