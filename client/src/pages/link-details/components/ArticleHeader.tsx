import React from "react";
import { Calendar } from "lucide-react";
import type { NewsArticle } from "../../../utils/types";
import { formatArticleDate } from "../articleDetails.utils";

interface ArticleHeaderProps {
  article: NewsArticle;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  return (
    <header className="mb-8 relative z-10">
      <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
        <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-fuchsia-300 font-bold uppercase tracking-wider text-xs border border-violet-200 dark:border-violet-700/50">
          {article.source || "News"}
        </span>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-4 h-4" />
          {formatArticleDate(article.pubDate)}
        </div>
      </div>

      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
        {article.title}
      </h1>
    </header>
  );
};

export default ArticleHeader;
