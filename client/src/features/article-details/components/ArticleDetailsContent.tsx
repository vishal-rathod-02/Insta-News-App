import React from "react";
import RightSidebar from "../../../components/RightSidebar";
import type { NewsArticle } from "../../../utils/types";
import ArticleBackButton from "./ArticleBackButton";
import ArticleBody from "./ArticleBody";
import ArticleHeader from "./ArticleHeader";
import ArticleSourcePanel from "./ArticleSourcePanel";

interface ArticleDetailsContentProps {
  article: NewsArticle;
  onBack: () => void;
}

const ArticleDetailsContent: React.FC<ArticleDetailsContentProps> = ({
  article,
  onBack,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <main className="flex-1 max-w-4xl min-w-0">
        <ArticleBackButton onBack={onBack} />

        <article className="glass-panel p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

          <ArticleHeader article={article} />
          <ArticleBody article={article} />
          <ArticleSourcePanel link={article.link} />
        </article>
      </main>

      <RightSidebar country="us" />
    </div>
  );
};

export default ArticleDetailsContent;
