import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Copy,
  Check,
  Send,
} from "lucide-react";
import type { NewsArticle } from "../utils/types";
import FallbackImage from "../assets/News_Placeholder.webp";

interface ShareSocialModalProps {
  article: NewsArticle;
  summaryText?: string;
  onClose: () => void;
}

export const ShareSocialModal: React.FC<ShareSocialModalProps> = ({
  article,
  summaryText,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Clean snippet that won't duplicate the headline
  const cleanSnippet = (() => {
    if (summaryText) {
      return summaryText.replace(/\*/g, "").replace(/#/g, "").slice(0, 150).trim();
    }
    if (
      article.contentSnippet &&
      article.contentSnippet.trim().toLowerCase() !== article.title.trim().toLowerCase()
    ) {
      return article.contentSnippet.slice(0, 150).trim();
    }
    return "Read the full verified breaking story and live in-depth coverage on InstaNews.";
  })();

  const articleImage = article.imageUrl || FallbackImage;
  const categoryName = article.category || "Breaking News";
  const shareUrl = article.link || window.location.href;

  // --- High-Quality 16:9 Post Canvas PNG Generator ---
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 1200;
      const height = 675; // Standard 16:9 Post format
      canvas.width = width;
      canvas.height = height;

      // 1. Background OLED Dark Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#080214");
      bgGrad.addColorStop(0.5, "#100624");
      bgGrad.addColorStop(1, "#030107");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top Neon Gradient Accent Bar
      const neonGrad = ctx.createLinearGradient(0, 0, width, 0);
      neonGrad.addColorStop(0, "#8B5CF6");
      neonGrad.addColorStop(0.5, "#D946EF");
      neonGrad.addColorStop(1, "#F59E0B");
      ctx.fillStyle = neonGrad;
      ctx.fillRect(0, 0, width, 10);

      // Ambient Glowing Circles
      ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.2, 250, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(217, 70, 239, 0.12)";
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.8, 220, 0, Math.PI * 2);
      ctx.fill();

      // 2. Header Brand
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 34px sans-serif";
      ctx.fillText("⚡ INSTANEWS", 60, 68);

      ctx.fillStyle = "#C084FC";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("AI POWERED NEWS", 330, 66);

      // 3. Category Badge
      const catBadgeY = 100;
      ctx.fillStyle = "rgba(139, 92, 246, 0.35)";
      ctx.beginPath();
      ctx.roundRect(60, catBadgeY, 210, 36, 18);
      ctx.fill();

      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#E9D5FF";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`• ${categoryName.toUpperCase()}`, 80, catBadgeY + 24);

      // 4. Try drawing the article image
      let imgLoaded = false;
      if (article.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = article.imageUrl!;
            setTimeout(() => reject(new Error("Timeout")), 2500);
          });

          // Draw rounded image banner
          const imgY = 150;
          const imgHeight = 220;
          const imgWidth = width - 120;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(60, imgY, imgWidth, imgHeight, 24);
          ctx.clip();
          ctx.drawImage(img, 60, imgY, imgWidth, imgHeight);

          // Dark vignette overlay on image
          const imgGrad = ctx.createLinearGradient(0, imgY, 0, imgY + imgHeight);
          imgGrad.addColorStop(0, "rgba(0,0,0,0)");
          imgGrad.addColorStop(1, "rgba(8, 2, 20, 0.88)");
          ctx.fillStyle = imgGrad;
          ctx.fillRect(60, imgY, imgWidth, imgHeight);
          ctx.restore();

          // Image border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(60, imgY, imgWidth, imgHeight, 24);
          ctx.stroke();

          imgLoaded = true;
        } catch {
          imgLoaded = false;
        }
      }

      // 5. Headline
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 38px sans-serif";

      const words = article.title.split(" ");
      let line = "";
      let y = imgLoaded ? 415 : 180;
      const maxLineWidth = width - 120;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && n > 0) {
          ctx.fillText(line, 60, y);
          line = words[n] + " ";
          y += 48;
          if (y > (imgLoaded ? 490 : 280)) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 60, y);

      // 6. Snippet Quote Box
      const boxY = y + 30;
      const boxHeight = 120;
      ctx.fillStyle = "rgba(23, 11, 41, 0.92)";
      ctx.beginPath();
      ctx.roundRect(60, boxY, width - 120, boxHeight, 22);
      ctx.fill();

      ctx.strokeStyle = "rgba(139, 92, 246, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#CBD5E1";
      ctx.font = "22px sans-serif";

      const snippetWords = cleanSnippet.split(" ");
      let sLine = "";
      let sY = boxY + 45;
      for (let m = 0; m < snippetWords.length; m++) {
        const testS = sLine + snippetWords[m] + " ";
        const sMetrics = ctx.measureText(testS);
        if (sMetrics.width > width - 200 && m > 0) {
          ctx.fillText(sLine, 95, sY);
          sLine = snippetWords[m] + " ";
          sY += 34;
          if (sY > boxY + 85) break;
        } else {
          sLine = testS;
        }
      }
      ctx.fillText(sLine + "...", 95, sY);

      // 7. Footer Attribution
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(
        `Source: ${article.source || "InstaNews"} • Verified on instanews.app`,
        60,
        height - 35
      );

      // Trigger Download cleanly
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `InstaNews-${(article.title || "post")
        .slice(0, 24)
        .replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.warn("Canvas export fallback:", err);
      await handleCopy();
    } finally {
      setIsDownloading(false);
    }
  };

  // --- Copy Link & Summary ---
  const handleCopy = async () => {
    const text = `🔥 ${article.title}\n\n${cleanSnippet}\n\nRead on InstaNews: ${shareUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // --- Native Share Sheet ---
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `🔥 ${article.title}\n\n${cleanSnippet}`,
          url: shareUrl,
        });
        return;
      } catch {
        return;
      }
    }
    handleCopy();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
        onClick={onClose}
      >
        {/* Direct Screen-Level Overlay Card */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-[#130628] text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200/90 dark:border-violet-500/35 shadow-2xl dark:shadow-[0_0_60px_rgba(139,92,246,0.35)] overflow-hidden flex flex-col my-auto max-h-[90vh]"
        >
          {/* Top Neon Accent Bar */}
          <div className="h-1 bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 shrink-0" />

          {/* Ambient Glows (Dark Mode Only) */}
          <div className="hidden dark:block absolute -top-12 -right-12 w-32 h-32 bg-fuchsia-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden dark:block absolute -bottom-12 -left-12 w-32 h-32 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header & Close Button */}
          <div className="px-5 pt-4 pb-2.5 flex items-center justify-between relative z-10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="text-amber-500">⚡</span> INSTANEWS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 uppercase tracking-wider">
                {categoryName}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Content Body */}
          <div className="px-5 py-2 overflow-y-auto custom-scrollbar space-y-3 relative z-10">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video shrink-0 shadow-md dark:shadow-lg bg-slate-100 dark:bg-black/40">
              <img
                src={articleImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 dark:from-[#090216] via-transparent to-transparent opacity-75" />
            </div>

            {/* Headline */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {article.title}
            </h3>

            {/* Quote / Summary Highlight Box */}
            <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-[#170B2E]/90 border border-slate-200 dark:border-violet-500/25 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
              <span className="text-violet-600 dark:text-fuchsia-400 font-bold mr-1">“</span>
              <span className="line-clamp-3">{cleanSnippet}</span>
              <span className="text-violet-600 dark:text-fuchsia-400 font-bold ml-1">”</span>
            </div>

            {/* Card Attribution Footer */}
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-violet-500/15">
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-45">
                {article.source || "InstaNews"}
              </span>
              <span className="font-bold text-violet-600 dark:text-violet-400">instanews.app</span>
            </div>
          </div>

          {/* Seamless Bottom Action Bar */}
          <div className="p-4 border-t border-slate-200 dark:border-violet-500/20 bg-slate-50/95 dark:bg-[#0C041C]/90 flex items-center justify-between gap-2 relative z-10 shrink-0">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Card Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloading ? "Generating HD..." : "Download Card"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNativeShare}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-violet-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Share</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-violet-500/20 active:scale-95 transition-all cursor-pointer"
              title="Copy link to clipboard"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ShareSocialModal;
