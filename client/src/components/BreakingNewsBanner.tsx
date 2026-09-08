import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles, X, ChevronRight } from "lucide-react";
import { getNewsForCategory } from "../services/newsService";
import type { NewsArticle } from "../utils/types";

interface BreakingNewsBannerProps {
  onSummarize: (article: NewsArticle) => void;
}

const BreakingNewsBanner: React.FC<BreakingNewsBannerProps> = ({ onSummarize }) => {
  const [breakingArticle, setBreakingArticle] = useState<NewsArticle | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;

    const fetchBreaking = async () => {
      try {
        const articles = await getNewsForCategory("IN", "top", 5, { trending: true });
        if (articles && articles.length > 0 && isMounted) {
          setBreakingArticle(articles[0]);
        }
      } catch (err) {
        console.warn("Failed to fetch breaking alert:", err);
      }
    };

    // Defer initial breaking alert fetch by 1.2s
    const initialTimer = setTimeout(() => {
      fetchBreaking();
      interval = setInterval(fetchBreaking, 180000); // 3 min refresh
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (isDismissed || !breakingArticle) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="fixed bottom-24 xl:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-90 sm:w-96 max-w-md bg-white/95 dark:bg-[#0C0618]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-violet-500/35 rounded-3xl shadow-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-3.5 sm:p-4 text-slate-800 dark:text-slate-100 overflow-hidden"
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-500 via-rose-500 to-violet-500 animate-pulse" />

        {/* Card Header: Alert Badge & Dismiss */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-rose-500 text-rose-500 shrink-0" /> Breaking Alert
            </span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 -mr-1 -mt-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 cursor-pointer"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Headline */}
        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 my-2 leading-snug">
          {breakingArticle.title}
        </p>

        {/* Card Footer: Source & Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-violet-500/15">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-32.5 sm:max-w-45">
            {breakingArticle.source || "Live News Feed"}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onSummarize(breakingArticle)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] sm:text-xs font-bold shadow-md shadow-violet-500/25 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>AI Brief</span>
            </button>

            <a
              href={breakingArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Open story"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default BreakingNewsBanner;
