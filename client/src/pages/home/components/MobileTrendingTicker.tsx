import React from "react";
import { Link } from "react-router-dom";
import type { NewsArticle } from "../../../utils/types";

interface MobileTrendingTickerProps {
  articles: NewsArticle[];
}

const tickerMaskStyle = {
  maskImage:
    "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
};

const MobileTrendingTicker: React.FC<MobileTrendingTickerProps> = ({ articles }) => {
  const visibleArticles = articles.slice(0, 5);

  return (
    <div className="lg:hidden flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-xs mb-4">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 shrink-0 border-r border-amber-200 dark:border-amber-500/30 pr-4">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </div>
        <span className="font-bold text-xs tracking-widest uppercase">Trending</span>
      </div>

      <div className="flex-1 overflow-hidden relative" style={tickerMaskStyle}>
        <div className="whitespace-nowrap overflow-x-auto scrollbar-hide text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-8 px-4">
          {visibleArticles.map((article, index) => (
            <React.Fragment key={article.id}>
              <Link
                to="/article"
                state={{ article }}
                className="cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {article.title}
              </Link>

              {index < visibleArticles.length - 1 && (
                <span className="text-amber-300 dark:text-amber-700/50">&middot;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTrendingTicker;
