import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import NewsSection from "../components/NewsSection";
import LiveSidebar from "../components/LiveSidebar";
import type { LayoutContextType } from "../components/Layout";
import { Home, ChevronRight, Search } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { country, onSummarize, setActiveCategory } = useOutletContext<LayoutContextType>();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    setActiveCategory(""); // Clear active category highlight in nav
    document.title = query ? `Search: ${query} - InstaNews` : "Search - InstaNews";
    window.scrollTo(0, 0);
  }, [query, setActiveCategory]);

  if (!query) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No search query provided.</h2>
        <button onClick={() => navigate('/')} className="text-violet-600 underline">Return Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Column */}
      <main className="flex-1 w-full min-w-0">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-bold mb-6 text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 group"
            >
              <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-slate-800 dark:text-slate-200">
              Search
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-37.5 sm:max-w-75">
              "{query}"
            </span>
          </nav>
          
          <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1.5px] mb-12 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]">
            <div className="relative bg-white/95 dark:bg-[#0A0510]/95 backdrop-blur-3xl rounded-[30.5px] p-8 sm:p-12 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 z-10 group">
              {/* Decorative background glows */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-8 text-center sm:text-left w-full">
                <div className="p-4 sm:p-5 rounded-3xl bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-500/20 shadow-xl inline-flex shrink-0 mx-auto sm:mx-0">
                  <Search className="w-10 h-10 sm:w-14 sm:h-14 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-md">
                    Search Results
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed mx-auto sm:mx-0">
                    Showing top stories matching: <span className="font-black text-violet-600 dark:text-fuchsia-400 italic">"{query}"</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use category "all" to search across all news feeds */}
        <NewsSection
          title=""
          categoryId="all"
          country={country}
          limit={32}
          keyword={query}
          onSummarize={onSummarize}
        />

        {/* Dynamic addition: Always give them something to read */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-6 flex items-center gap-3">
             <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                <Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
               Discover More Top Stories
             </h2>
          </div>
          <NewsSection
            title=""
            categoryId="world"
            country={country}
            limit={6}
            onSummarize={onSummarize}
          />
        </div>
      </main>

      {/* Live Feed Sidebar */}
      <LiveSidebar country={country} category="top" />
    </div>
  );
};

export default SearchPage;
