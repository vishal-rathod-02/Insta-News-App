import React from "react";
import { useUser } from "../context/UserContext";
import NewsCard from "../components/NewsCard";
import SummarizeModal from "../components/SummarizeModal";
import type { NewsArticle } from "../utils/types";
import { HistoryIcon } from "../components/shared/Icons";

const HistoryPage: React.FC = () => {
  const { readingHistory, clearHistory } = useUser();
  const [selectedArticle, setSelectedArticle] =
    React.useState<NewsArticle | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <HistoryIcon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Reading History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Articles you have recently viewed
            </p>
          </div>
        </div>

        {readingHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {readingHistory.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <HistoryIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No reading history
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Articles you read will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {readingHistory.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onSummarize={setSelectedArticle}
            />
          ))}
        </div>
      )}

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
