import React, { useEffect, useRef } from "react";
import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./shared/NewsCardSkeleton";
import DataFetchError from "./shared/DataFetchError";
import { useNews } from "../hooks/useNews";

interface NewsSectionProps {
  title: string;
  categoryId: string;
  country: string;
  limit?: number;
  keyword?: string;
  featuredLayout?: boolean;
  onSummarize: (article: any) => void;
  enableInfiniteScroll?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  categoryId,
  country,
  limit = 12,
  keyword,
  featuredLayout = false,
  onSummarize,
  enableInfiniteScroll = false
}) => {
  const { articles, isLoading, isLoadingMore, hasMore, loadMore, error } = useNews(
    country,
    categoryId,
    limit,
    keyword ? { keyword } : undefined
  );

  const loaderRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // trigger slightly before it becomes visible
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  return (
    <section id={categoryId} className="mb-12">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50 border-b-2 border-violet-500/30 pb-2">
          {title}
        </h2>
      )}

      {error && (
        <DataFetchError message={error} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading &&
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className={featuredLayout && index === 0 ? "col-span-1 sm:col-span-2 lg:col-span-2" : ""}>
              <NewsCardSkeleton />
            </div>
          ))}

        {(!isLoading || articles.length > 0) &&
          articles.map((article, index) => {
            const isFeaturedCard = featuredLayout && index === 0;
            return (
              <div key={`${article.id}-${index}`} className={isFeaturedCard ? "col-span-1 sm:col-span-2 lg:col-span-2" : ""}>
                <NewsCard
                  article={article}
                  onSummarize={onSummarize}
                  isFeatured={isFeaturedCard}
                />
              </div>
            );
          })}

        {/* Skeleton loaders for infinite scrolling */}
        {isLoadingMore &&
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-more-${index}`}>
              <NewsCardSkeleton />
            </div>
          ))
        }
      </div>

      {/* Infinite Scroll trigger element */}
      {!isLoading && !error && enableInfiniteScroll && hasMore && articles.length > 0 && (
        <div ref={loaderRef} className="w-full h-20 flex items-center justify-center mt-6">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/20 rounded-4xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 text-center">
            No articles found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
            We couldn't find any news articles matching your search criteria. Try using different keywords or explore the trending topics.
          </p>
        </div>
      )}
    </section>
  );
};

export default NewsSection;
