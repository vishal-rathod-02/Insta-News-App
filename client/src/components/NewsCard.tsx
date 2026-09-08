import React, { useState, lazy, Suspense } from "react";
import type { NewsCardProps } from "../utils/types";
import FallbackImage from "../assets/News_Placeholder.webp";
import { ExternalLink, Sparkles, Bookmark, Share2 } from "lucide-react";
import { useUser as useLocalUser } from "../context/UserContext";
import { useUser as useClerkUser, useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// Lazy load ShareSocialModal to prevent canvas bundling in initial card render
const ShareSocialModal = lazy(() => import("./ShareSocialModal"));

const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSummarize,
  isFeatured = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { isSaved, saveArticle, removeSavedArticle, addToHistory } =
    useLocalUser();
  const { user } = useClerkUser();
  const clerk = useClerk();

  const saved = isSaved(article.id);

  const handleShareNews = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      clerk.openSignIn();
      return;
    }

    if (saved) {
      removeSavedArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  const handleRead = () => {
    if (user) {
      addToHistory(article);
    }
  };

  const defaultImage = FallbackImage;

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handleSummarize = async () => {
    if (loading) return;

    try {
      setLoading(true);
      onSummarize(article);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        group flex h-full overflow-hidden rounded-2xl
        glass-panel
        shadow-sm hover:shadow-2xl hover:shadow-violet-500/20 dark:hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]
        transition-all duration-500 hover:-translate-y-1
        ${isFeatured ? "flex-col sm:flex-row" : "flex-col"}
      `}
      title={article.title}
    >
      {/* IMAGE */}
      <Link
        to="/article"
        state={{ article }}
        onClick={handleRead}
        className={`block ${isFeatured ? "sm:w-1/2 lg:w-[55%] shrink-0 relative aspect-video sm:aspect-auto" : ""}`}
      >
        <div
          className={`relative overflow-hidden w-full h-full ${!isFeatured ? "aspect-video" : "absolute inset-0"}`}
        >
          <img
            src={article.imageUrl || defaultImage}
            alt={article.title}
            className="
            absolute inset-0 w-full h-full
            object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== defaultImage) {
                target.src = defaultImage;
              }
            }}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Video Badge */}
          {article.isVideo && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs px-2.5 py-1 sm:py-1.5 rounded-full font-medium border border-white/10 shadow-md">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              <span>Watch</span>
            </div>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleSave}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 shadow-md hover:bg-black/60 transition-colors z-10"
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? "fill-violet-500 text-violet-500" : "text-white"}`}
            />
          </button>
        </div>
      </Link>

      {/* CONTENT */}
      <div
        className={`flex flex-col grow min-w-0 p-5 ${isFeatured ? "sm:p-8 lg:p-10 justify-center" : ""}`}
      >
        {/* META */}
        <div className="flex items-center justify-between text-xs mb-3 gap-2">
          <span
            title={article.source}
            className={`font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate max-w-[70%] shrink-0 ${isFeatured ? "text-xs" : "text-[10px]"}`}
          >
            {article.source}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            {formatDate(article.pubDate)}
          </span>
        </div>

        {/* TITLE */}
        <Link
          to="/article"
          state={{ article }}
          onClick={handleRead}
          className="block"
        >
          <h3
            className={`
              mb-3 font-bold leading-tight tracking-tight
              text-slate-900 dark:text-slate-300
              group-hover:underline dark:group-hover:text-slate-100 transition-colors
              ${isFeatured ? "text-xl sm:text-2xl lg:text-3xl line-clamp-4" : "text-lg lg:text-xl line-clamp-3"}
            `}
          >
            {article.title}
          </h3>
        </Link>

        {/* SNIPPET */}
        <p
          className={`mb-5 text-slate-600 dark:text-slate-300 leading-relaxed ${isFeatured ? "text-base line-clamp-4 sm:line-clamp-5" : "text-sm line-clamp-3"}`}
        >
          {article.contentSnippet}
        </p>

        {/* ACTIONS */}
        <div className="mt-auto pt-5 flex flex-wrap 2xl:flex-nowrap items-center gap-3 border-t border-slate-100 dark:border-slate-800/60 w-full">
          <Link
            to="/article"
            state={{ article }}
            onClick={handleRead}
            className="flex-1 relative rounded-full p-[1.5px] bg-linear-to-r from-violet-600 to-fuchsia-500 overflow-hidden group/btn shadow-sm hover:shadow-violet-500/25 transition-all duration-300 active:scale-95"
          >
            <div className="flex h-full w-full items-center justify-center gap-2 rounded-full bg-white dark:bg-[#0A0510] px-2 sm:px-4 py-[8.5px] transition-colors duration-300 group-hover/btn:bg-transparent">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-fuchsia-400 group-hover/btn:text-white transition-colors duration-300 whitespace-nowrap">
                Read
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-violet-600 dark:text-fuchsia-400 group-hover/btn:text-white transition-colors duration-300" />
            </div>
          </Link>

          {isFeatured ? (
            <button
              onClick={handleSummarize}
              disabled={loading}
              className={`
                flex-1 text-center inline-flex justify-center items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-4 py-2.5 rounded-full transition-all duration-300 active:scale-95 whitespace-nowrap
                ${loading
                  ? "bg-slate-100 dark:bg-oled-border text-slate-400 cursor-not-allowed"
                  : "gradient-primary text-white shadow-lg shadow-violet-500/25 hover:shadow-[0_0_15px_rgba(167,139,250,0.5)]"
                }
              `}
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  Summarize
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleShareNews}
              className="flex-1 text-center inline-flex justify-center items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-4 py-2.5 rounded-full transition-all duration-300 active:scale-95 whitespace-nowrap bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-violet-600 dark:hover:text-fuchsia-400 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      {/* INSTAGRAM / FACEBOOK SOCIAL SHARE STORY MODAL (LAZY LOADED) */}
      {showShareModal && (
        <Suspense fallback={null}>
          <ShareSocialModal
            article={article}
            onClose={() => setShowShareModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NewsCard;
