import React from "react";
import NewsSection from "../../../components/NewsSection";
import { CATEGORIES } from "../../../utils/Categories";

interface DashboardFeedProps {
  savedCategories: string[];
}

const DashboardFeed: React.FC<DashboardFeedProps> = ({ savedCategories }) => {
  return (
    <div className="space-y-16">
      {savedCategories.map((categoryId) => {
        const category = CATEGORIES.find(({ id }) => id === categoryId);

        if (!category) {
          return null;
        }

        return (
          <div key={categoryId}>
            <NewsSection
              title={`${category.title} Updates`}
              categoryId={category.id}
              country="IN"
              limit={6}
              onSummarize={() => {}}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardFeed;
