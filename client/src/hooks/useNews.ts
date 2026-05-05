import { useState, useEffect } from "react";
import { getNewsForCategory } from "../services/newsService";
import type { NewsArticle, UseNewsOptions } from "../utils/types";

export const useNews = (
  country: string,
  categoryId: string,
  limit: number = 9,
  options?: UseNewsOptions
) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialNews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getNewsForCategory(country, categoryId, limit, { ...options, page: 1 });
        
        if (isMounted) {
          setArticles(data);
          setPage(1);
          setHasMore(data.length === limit);
        }
      } catch (e) {
        if (isMounted) {
          setError("Failed to fetch news articles.");
        }
        console.error(e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialNews();

    return () => {
      isMounted = false;
    };
  }, [country, categoryId, limit, options?.keyword, options?.video, options?.trending]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getNewsForCategory(country, categoryId, limit, { ...options, page: nextPage });
      
      if (data.length > 0) {
        setArticles(prev => {
          const newArticles = data.filter(d => !prev.some(p => p.id === d.id));
          return [...prev, ...newArticles];
        });
        setPage(nextPage);
        setHasMore(data.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Failed to load more news:", e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return { articles, isLoading, isLoadingMore, hasMore, loadMore, error };
};
