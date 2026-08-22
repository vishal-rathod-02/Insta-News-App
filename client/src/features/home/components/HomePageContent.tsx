import React from "react";
import type { NewsArticle } from "../../../utils/types";
import Carousel from "../../../components/Carousel";
import RightSidebar from "../../../components/RightSidebar";
import VerticalNavTracker from "../../../components/VerticalNavTracker";
import HomeCategorySection from "./HomeCategorySection";
import MobileTrendingTicker from "./MobileTrendingTicker";
import { HOME_FEED_CATEGORIES } from "../home.constants";

interface HomePageContentProps {
  country: string;
  onSummarize: (article: NewsArticle) => void;
  trendingArticles: NewsArticle[];
  isTrendingLoading: boolean;
  visibleSectionId: string;
  onExploreCategory: (categoryId: string) => void;
}

const HomePageContent: React.FC<HomePageContentProps> = ({
  country,
  onSummarize,
  trendingArticles,
  isTrendingLoading,
  visibleSectionId,
  onExploreCategory,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <VerticalNavTracker activeCategory={visibleSectionId} />

      <main className="flex-1 min-w-0 flex flex-col gap-12">
        <Carousel country={country} onSummarize={onSummarize} />

        {!isTrendingLoading && trendingArticles.length > 0 && (
          <MobileTrendingTicker articles={trendingArticles} />
        )}

        {HOME_FEED_CATEGORIES.map((category) => (
          <React.Fragment key={category.id}>
            <HomeCategorySection
              category={category}
              country={country}
              onExplore={() => onExploreCategory(category.id)}
              onSummarize={onSummarize}
            />
          </React.Fragment>
        ))}
      </main>

      <RightSidebar country={country} />
    </div>
  );
};

export default HomePageContent;
