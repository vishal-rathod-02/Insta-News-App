import { summarizeArticleWithGemini } from "./src/services/aiModal.js";

const title = "Tata Consumer reports Q4 net profit of ₹424 crore, a 22% YoY growth";
const content = "Tata Consumer Products Ltd reported a 22% year-on-year (YoY) increase in consolidated net profit for the fourth quarter ended March 31, 2024, at ₹424 crore. The FMCG major had posted a net profit of ₹346 crore in the same quarter of the previous fiscal year. Its revenue from operations grew 14% YoY to ₹3,618 crore in Q4FY24. The board has recommended a final dividend of ₹8.45 per equity share.";

async function run() {
  try {
    const summary = await summarizeArticleWithGemini(title, content);
    console.log("RESULT:");
    console.log(summary);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}

run();
