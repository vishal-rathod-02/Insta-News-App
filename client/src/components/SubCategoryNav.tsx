import React from "react";
import type { NewsCategory } from "../utils/types";

interface SubCategoryNavProps {
  category: NewsCategory;
  activeSubCategory: string;
  setActiveSubCategory: (sub: string) => void;
}

const getSubCategoryEmoji = (id: string) => {
  switch (id) {
    case "markets":
      return "📈";
    case "economy":
      return "🏦";
    case "startups":
      return "🚀";
    case "ai":
      return "🤖";
    case "gadgets":
      return "📱";
    case "software":
      return "💻";
    case "movies":
      return "🎬";
    case "music":
      return "🎵";
    case "television":
      return "📺";
    case "cricket":
      return "🏏";
    case "football":
      return "⚽";
    case "tennis":
      return "🎾";
    case "f1":
      return "🏁";
    case "fitness":
      return "🏋️";
    case "nutrition":
      return "🍎";
    case "mental-health":
      return "🧠";
    default:
      return "📌";
  }
};

const SubCategoryNav: React.FC<SubCategoryNavProps> = ({
  category,
  activeSubCategory,
  setActiveSubCategory,
}) => {
  if (!category.subcategories || category.subcategories.length === 0)
    return null;

  return (
    <div className="mb-10 w-full relative">
      {/* Mobile scroll shadow indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-white dark:from-oled-black to-transparent z-10 pointer-events-none sm:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white dark:from-oled-black to-transparent z-10 pointer-events-none sm:hidden" />

      <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex items-center gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-800/40 backdrop-blur-xl rounded-full border border-slate-200/60 dark:border-slate-700/50 shadow-inner min-w-max">
          <button
            onClick={() => setActiveSubCategory("all")}
            className={`relative px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 group
              ${activeSubCategory === "all"
                ? "text-white shadow-lg shadow-violet-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/50"
              }`}
          >
            {activeSubCategory === "all" && (
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-full" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className={`text-[15px] transition-all duration-300 ${activeSubCategory !== "all" ? "opacity-70 grayscale-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" : "scale-110 drop-shadow-md"}`}
              >
                ✨
              </span>
              All {category.title}
            </span>
          </button>

          {/* Vertical Separator */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/50 mx-1" />

          {category.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubCategory(sub.id)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 group
                ${activeSubCategory === sub.id
                  ? "text-white shadow-lg shadow-violet-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/50"
                }`}
            >
              {activeSubCategory === sub.id && (
                <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-full" />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span
                  className={`text-[15px] transition-all duration-300 ${activeSubCategory !== sub.id ? "opacity-70 grayscale-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" : "scale-110 drop-shadow-md"}`}
                >
                  {getSubCategoryEmoji(sub.id)}
                </span>
                {sub.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryNav;
