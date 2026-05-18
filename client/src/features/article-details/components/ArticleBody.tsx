import React from "react";
import type { NewsArticle } from "../../../utils/types";

interface ArticleBodyProps {
  article: NewsArticle;
}

const ArticleBody: React.FC<ArticleBodyProps> = ({ article }) => {
  return (
    <>
      {article.imageUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/50 relative aspect-video">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-violet-600 dark:prose-a:text-fuchsia-400 prose-img:rounded-xl relative z-10">
        {article.content ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p className="text-slate-700 dark:text-slate-300 text-lg">
            {article.contentSnippet}
          </p>
        )}
      </div>
    </>
  );
};

export default ArticleBody;
