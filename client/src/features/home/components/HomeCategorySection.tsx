import React from "react";
import NewsSection from "../../../components/NewsSection";
import { CATEGORY_ICONS } from "../../../utils/CategoryIcons";
import type { NewsArticle, NewsCategory } from "../../../utils/types";

interface HomeCategorySectionProps {
  category: NewsCategory;
  country: string;
  onExplore: () => void;
  onSummarize: (article: NewsArticle) => void;
}

const HomeCategorySection: React.FC<HomeCategorySectionProps> = ({
  category,
  country,
  onExplore,
  onSummarize,
}) => {
  const icon = CATEGORY_ICONS[category.id];

  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(
        icon as React.ReactElement<{ size?: number; strokeWidth?: number }>,
        { size: 24, strokeWidth: 2.5 },
      )
    : icon;

  return (
    <div id={category.id} className="relative scroll-m-32">
      <div className="group flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 border-b border-violet-50 dark:border-oled-border/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-fuchsia-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
            {renderedIcon}
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize tracking-tight flex items-center gap-3">
              {category.title}
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
                Top Stories
              </span>
            </h2>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 opacity-80">
              Discover the latest in {category.title.toLowerCase()}
            </p>
          </div>
        </div>

        <button
          onClick={onExplore}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors group/btn"
        >
          Explore all
          <span className="bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full group-hover/btn:bg-violet-100 dark:group-hover/btn:bg-fuchsia-500/20 group-hover/btn:translate-x-1 transition-all">
            &rarr;
          </span>
        </button>
      </div>

      <NewsSection
        title=""
        categoryId={category.id}
        country={country}
        onSummarize={onSummarize}
      />
    </div>
  );
};

export default HomeCategorySection;
