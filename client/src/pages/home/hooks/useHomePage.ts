import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContextType } from "../../../components/Layout";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { useNews } from "../../../hooks/useNews";
import { HOME_CATEGORY_IDS } from "../home.constants";

export const useHomePage = () => {
  const { country, onSummarize, setActiveCategory } =
    useOutletContext<LayoutContextType>();
  const navigate = useNavigate();
  const { articles: trendingArticles, isLoading: isTrendingLoading } = useNews(
    country,
    "top",
  );
  const visibleSectionId = useIntersectionObserver(HOME_CATEGORY_IDS, 150);

  useEffect(() => {
    setActiveCategory(visibleSectionId);
  }, [visibleSectionId, setActiveCategory]);

  useEffect(() => {
    document.title = "Trending Now - InstaNews | Your Daily Digest";
  }, []);

  const onExploreCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return {
    country,
    onSummarize,
    trendingArticles,
    isTrendingLoading,
    visibleSectionId,
    onExploreCategory,
  };
};
