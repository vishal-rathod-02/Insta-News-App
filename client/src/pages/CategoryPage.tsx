import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import NewsSection from "../components/NewsSection";
import LiveSidebar from "../components/LiveSidebar";
import { CATEGORIES } from "../utils/Categories";
import { COUNTRIES } from "../utils/Country";
import type { LayoutContextType } from "../components/Layout";
import CategoryHero from "../components/CategoryHero";
import SubCategoryNav from "../components/SubCategoryNav";
import SportsScoreCard from "../components/SportsScoreCard";
import { Home, ChevronRight } from "lucide-react";

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { country, onSummarize, setActiveCategory } = useOutletContext<LayoutContextType>();

  const [worldRegion, setWorldRegion] = useState("US"); // Default world perspective to US
  const [activeSubCategory, setActiveSubCategory] = useState<string>("all");

  const category = CATEGORIES.find(c => c.id === categoryId);

  useEffect(() => {
    if (category) {
      setActiveCategory(category.id);
    }
  }, [category, setActiveCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSubCategory("all");
  }, [categoryId]);

  useEffect(() => {
    if (category) {
      document.title = `${category.title} News - InstaNews Focus`;
    }
  }, [category]);

  if (!category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <button onClick={() => navigate('/')} className="text-violet-600 underline">Return Home</button>
      </div>
    );
  }

  const actualCountry = category.id === "world" ? worldRegion : country;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Column */}
      <main className="flex-1 w-full min-w-0">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-bold mb-6 text-slate-500 dark:text-slate-400">
            <button
              onClick={() => navigate('/')}
              className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
            >
              <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className={`transition-colors ${activeSubCategory === "all" ? "text-slate-800 dark:text-slate-200" : "cursor-pointer hover:text-violet-600 dark:hover:text-violet-400"}`} onClick={() => activeSubCategory !== "all" && setActiveSubCategory("all")}>
              {category.title}
            </span>
            {activeSubCategory !== "all" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                <span className="text-violet-600 dark:text-violet-400">
                  {category.subcategories?.find(s => s.id === activeSubCategory)?.title}
                </span>
              </>
            )}
          </nav>

          <CategoryHero category={category} />

          {category.id === "world" && (
            <div className="mt-8 mb-4">
              <p className="text-xs font-bold text-violet-500 uppercase mb-3 px-1">
                Regional Perspective
              </p>
              <div className="flex gap-3 max-w-md">
                {COUNTRIES.map((c) => {
                  const isSelected = worldRegion === c.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => setWorldRegion(c.code)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm
                      ${isSelected
                          ? "bg-violet-600 shadow-blue-500/20 text-white border-blue-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-oled-blackdark:border-slate-800 dark:text-slate-300 dark:hover:bg-oled-border"
                        }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-category Pill Navigation */}
          <SubCategoryNav
            category={category}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={setActiveSubCategory}
          />
        </div>

        {category.id === "sports" && <SportsScoreCard />}

        <NewsSection
          title=""
          categoryId={category.id}
          country={actualCountry}
          limit={32}
          keyword={activeSubCategory === "all" ? undefined : activeSubCategory}
          featuredLayout={true}
          onSummarize={onSummarize}
          enableInfiniteScroll={true}
        />
      </main>

      {/* Live Feed Sidebar */}
      <LiveSidebar country={actualCountry} category={category.id} />
    </div>
  );
};

export default CategoryPage;
