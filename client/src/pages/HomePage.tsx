import React, { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";
import NewsSection from "../components/NewsSection";
import RightSidebar from "../components/RightSidebar";
import VerticalNavTracker from "../components/VerticalNavTracker";
import { CATEGORIES } from "../utils/Categories";
import { CATEGORY_ICONS } from "../utils/CategoryIcons";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useNews } from "../hooks/useNews";
import NewsletterBanner from "../components/NewsletterBanner";
import type { LayoutContextType } from "../components/Layout";

const HomePage: React.FC = () => {
  const { country, onSummarize, setActiveCategory } = useOutletContext<LayoutContextType>();
  const navigate = useNavigate();
  const { articles: trendingArticles, isLoading: isTrendingLoading } = useNews(country, 'top');

  // Array of category IDs to observe
  const categoryIds = CATEGORIES.filter(c => c.id !== 'top').map(c => c.id);
  
  // Custom hook that returns the currently visible section ID
  const visibleSectionId = useIntersectionObserver(categoryIds, 150);

  // Sync scroll-spy with Layout's activeCategory state
  useEffect(() => {
    setActiveCategory(visibleSectionId);
  }, [visibleSectionId, setActiveCategory]);

  useEffect(() => {
    document.title = "Trending Now - InstaNews | Your Daily Digest";
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* 1. Vertical Sidebar Scroll Tracking */}
      <VerticalNavTracker activeCategory={visibleSectionId} />

      {/* 2. Main Feed Column */}
      <main className="flex-1 min-w-0 flex flex-col gap-12 ">
        <Carousel
          country={country}     
          onSummarize={onSummarize}
        />

        {/* 2.5 Breaking News / Trending Ticker (Mobile/Tablet Only) */}
        {!isTrendingLoading && trendingArticles.length > 0 && (
          <div className="lg:hidden flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-xs mb-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 shrink-0 border-r border-amber-200 dark:border-amber-500/30 pr-4">
               <div className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
               </div>
               <span className="font-bold text-xs tracking-widest uppercase">Trending</span>
            </div>
            <div 
              className="flex-1 overflow-hidden relative"
              style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
            >
               <div className="whitespace-nowrap overflow-x-auto scrollbar-hide text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-8 px-4">
                 {trendingArticles.slice(0, 5).map((article, idx) => (
                   <React.Fragment key={article.id}>
                     <a 
                       href={article.link} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                     >
                       {article.title}
                     </a>
                     {idx < 4 && <span className="text-amber-300 dark:text-amber-700/50">•</span>}
                   </React.Fragment>
                 ))}
               </div>
            </div>
          </div>
        )}

        {CATEGORIES.filter(c => c.id !== 'top').map((category, index) => (
          <React.Fragment key={category.id}>
             {/* Premium Newsletter Banner inserted after the 1st category */}
             {index === 1 && <NewsletterBanner />}

             <div id={category.id} className="relative scroll-m-32">
             <div className="group flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 border-b border-violet-50 dark:border-oled-border/50 pb-4">
               <div className="flex items-center gap-4">
                 <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-fuchsia-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                   {React.cloneElement(CATEGORY_ICONS[category.id] as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 })}
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
                 onClick={() => navigate(`/category/${category.id}`)}
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
          </React.Fragment>
        ))}
      </main>

      {/* 3. Structured Right Sidebar */}
      <RightSidebar country={country} />
    </div>
  );
};

export default HomePage;
