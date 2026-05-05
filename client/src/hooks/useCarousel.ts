import { useState, useEffect } from "react";
import { getCarouselNews } from "../services/carouselServices";
import type { NewsArticle } from "../utils/types";

export const useCarousel = (
  country: string,
  limit: number = 20
) => {

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCarousel = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCarouselNews(country, limit);
        if (isMounted) setArticles(data);
      } catch (err) {
        if (isMounted) setError("Failed to fetch carousel news");
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCarousel();

    return () => {
      isMounted = false;
    };

  }, [country, limit]);

  return { articles, isLoading, error };
};