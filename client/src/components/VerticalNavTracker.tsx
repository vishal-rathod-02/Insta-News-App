import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../utils/Categories";
import { CATEGORY_ICONS } from "../utils/CategoryIcons";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "./WeatherWidget";

interface VerticalNavTrackerProps {
  activeCategory: string;
}

const VerticalNavTracker: React.FC<VerticalNavTrackerProps> = ({
  activeCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mobile nav to keep active item in view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement =
        scrollContainerRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  const handleScrollTo = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const navCategories = CATEGORIES.filter((c) => c.id !== "top");

  return (
    <>
      {/* --- DESKTOP VIEW (Refined Sidebar) --- */}
      <aside className="hidden xl:block w-65 shrink-0 sticky top-32 self-start max-h-[calc(100vh-128px)] overflow-y-auto scrollbar-hide z-20 group pb-4">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-violet-500/20 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] -m-px" />
        <div className="relative px-2 py-6 glass-panel rounded-3xl shadow-[0_8px_32px_rgba(139,92,246,0.05)] dark:shadow-[0_8px_32px_rgba(217,70,239,0.05)] border border-violet-50 dark:border-oled-border group-hover:border-violet-200 dark:group-hover:border-fuchsia-500/30 transition-colors duration-500">
          <div className="px-4 mb-6">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Navigation
            </h3>
          </div>

          <nav className="flex flex-col space-y-1">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleScrollTo(cat.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-left active:scale-95
                    ${isActive ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"}
                  `}
                >
                  {/* Premium Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-pill"
                      className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-2xl z-0"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <div
                      className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                    >
                      {React.cloneElement(
                        CATEGORY_ICONS[cat.id] as React.ReactElement<any>,
                        {
                          size: 18,
                          strokeWidth: isActive ? 2.5 : 2,
                        },
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold tracking-tight transition-colors ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
                    >
                      {cat.title}
                    </span>

                    {isActive && (
                      <motion.div layoutId="arrow" className="ml-auto">
                        <ChevronRight
                          size={14}
                          className="text-white opacity-80"
                        />
                      </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* --- INTERACTIVE WIDGETS --- */}
          <div className="px-4 mt-8 space-y-5 pt-6 border-t border-slate-100 dark:border-slate-800/60 relative">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
              Daily Dashboard
            </h3>

            {/* Weather Widget */}
            <WeatherWidget variant="navtracker" />
          </div>
        </div>
      </aside>

      {/* --- MOBILE/TABLET DOCK (Premium Floating Island) --- */}
      <div className="xl:hidden fixed bottom-6 inset-x-0 z-100 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative p-[1.5px] rounded-4xl pointer-events-auto max-w-[95vw] shadow-[0_15px_40px_-5px_rgba(139,92,246,0.15)] dark:shadow-[0_15px_40px_-5px_rgba(217,70,239,0.15)]"
        >
          {/* Static Premium Gradient Border */}
          <div className="absolute inset-0 rounded-4xl bg-linear-to-r from-amber-400 via-violet-500 to-fuchsia-500 opacity-80" />

          <nav
            ref={scrollContainerRef}
            className="relative flex items-center gap-2 p-2 glass-panel bg-white/95 dark:bg-[#0A0510]/95 rounded-4xl overflow-x-auto scrollbar-hide w-full z-10"
          >
            {/* Subtle themed top-glow inside the dock */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-violet-400/50 dark:via-fuchsia-400/30 to-transparent" />
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  data-active={isActive}
                  onClick={() => handleScrollTo(cat.id)}
                  layout
                  className={`relative flex items-center justify-center shrink-0 h-11
                  ${isActive ? "text-white px-5" : "text-slate-500 dark:text-slate-400 w-11 rounded-full hover:bg-slate-100 dark:hover:bg-oled-border transition-colors"}
                `}
                >
                  {/* Fluid Background Pill (Dynamic Island Transition) */}
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-bg"
                      className="absolute inset-0 gradient-primary neon-glow rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}

                  <motion.div
                    layout
                    className="relative z-10 flex items-center"
                  >
                    <motion.div
                      layout
                      className="flex items-center justify-center"
                    >
                      {React.cloneElement(
                        CATEGORY_ICONS[cat.id] as React.ReactElement<any>,
                        {
                          size: isActive ? 18 : 20,
                          strokeWidth: isActive ? 2.5 : 1.5,
                        },
                      )}
                    </motion.div>

                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.div
                          key="title"
                          initial={{ opacity: 0, scale: 0.8, x: -5 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8, x: -5 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                          className="ml-2 overflow-hidden"
                        >
                          <span className="text-xs font-black whitespace-nowrap tracking-tight">
                            {cat.title}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>
      </div>
    </>
  );
};

export default VerticalNavTracker;
