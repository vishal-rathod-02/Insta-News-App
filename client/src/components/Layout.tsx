import React, { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SummarizeModal from "./SummarizeModal";
import { useTheme } from "../hooks/useTheme";
import type { NewsArticle } from "../utils/types";
import { CATEGORIES } from "../utils/Categories";

import Footer from "./Footer";

export type LayoutContextType = {
  country: string;
  onSummarize: (article: NewsArticle) => void;
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
};

const Layout: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [summarizeArticle, setSummarizeArticle] = useState<NewsArticle | null>(null);

  const location = useLocation();
  const defaultCat = location.pathname.startsWith('/category/')
    ? location.pathname.split('/')[2]
    : CATEGORIES[0].id;

  const [activeCategory, setActiveCategory] = useState<string>(defaultCat);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleSummarize = useCallback((article: NewsArticle) => {
    setSummarizeArticle(article);
  }, []);

  const closeSummarizeModal = useCallback(() => {
    setSummarizeArticle(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  const contextValue: LayoutContextType = {
    country: "IN",
    onSummarize: handleSummarize,
    activeCategory,
    setActiveCategory
  };

  return (
    <div className={`min-h-screen font-sans ${theme}`}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-oled-surface">

        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          activeCategory={activeCategory}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeCategory={activeCategory}
        />

        <main className="flex-1 pt-32 px-4 md:px-8 lg:px-12 max-w-[1600px] w-full mx-auto pb-20">
          <Outlet context={contextValue} />
        </main>

        <Footer />

        {/* SUMMARY MODAL */}
        {summarizeArticle && (
          <SummarizeModal
            article={summarizeArticle}
            onClose={closeSummarizeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
