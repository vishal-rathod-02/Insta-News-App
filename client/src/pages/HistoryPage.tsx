import React, { useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import NewsCard from "../components/NewsCard";
import SummarizeModal from "../components/SummarizeModal";
import type { NewsArticle } from "../utils/types";
import { History, Trash2, Search, Sparkles } from "lucide-react";

const HistoryPage: React.FC = () => {
  const { readingHistory, clearHistory } = useUser();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return readingHistory;
    return readingHistory.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.contentSnippet &&
          a.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [readingHistory, searchQuery]);

  const handleClear = () => {
    clearHistory();
    setConfirmClear(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-violet-500/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-linear-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl shadow-lg shadow-violet-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Reading History
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                {readingHistory.length} Viewed
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Articles and briefings you have recently opened
            </p>
          </div>
        </div>

        {/* Clear History Controls */}
        {readingHistory.length > 0 && (
          <div className="flex items-center gap-2">
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 active:scale-95 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-950/40 p-1.5 rounded-xl border border-rose-500/30">
                <span className="text-[11px] text-rose-300 font-bold px-2">Clear all?</span>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Filter */}
      {readingHistory.length > 0 && (
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your reading history..."
              className="w-full bg-white dark:bg-oled-surface border border-violet-500/25 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl py-2.5 pl-9 pr-4 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Grid */}
      {readingHistory.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-oled-surface/40 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 dark:bg-violet-600/20 text-violet-500 flex items-center justify-center mx-auto mb-4 border border-violet-500/30 shadow-inner">
            <History className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            No reading history yet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Stories you browse, read, or summarize will automatically appear here for easy access.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-lg shadow-violet-500/30 hover:opacity-90 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Start Reading Stories
          </a>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white/40 dark:bg-oled-surface/30 rounded-3xl border border-violet-500/15 p-6">
          <p className="text-sm font-semibold text-slate-400">
            No history entries match "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs text-violet-500 font-bold underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHistory.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onSummarize={setSelectedArticle}
            />
          ))}
        </div>
      )}

      {/* AI Summary Modal */}
      {selectedArticle && (
        <SummarizeModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default HistoryPage;
