import React from 'react';
import { useNews } from '../hooks/useNews';
import { Link } from 'react-router-dom';
import DataFetchError from './shared/DataFetchError';

interface RightSidebarProps {
  country: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ country }) => {
  const { articles, isLoading, error } = useNews(country, 'top');

  return (
    <aside className="hidden lg:block w-75 shrink-0 sticky top-32 self-start h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar pr-2 space-y-6">
      <div className="glass-panel rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full gradient-primary neon-glow animate-pulse" />
          Trending Now
        </h3>
        
        <div className="space-y-4">
          {error ? (
            <DataFetchError message={error} />
          ) : isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-16 h-16 bg-slate-200 dark:bg-oled-border rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-oled-border rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-oled-border rounded w-2/3" />
                </div>
              </div>
            ))
          ) : (
            articles.slice(0, 6).map((article, i) => (
              <Link 
                key={article.id}
                to="/category/top"
                className="group flex gap-3 items-start"
              >
                <span className="text-4xl font-black text-slate-300 dark:text-slate-700 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors leading-none tracking-tighter self-center w-8 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight  group-hover:text-shadow-slate-900 group-hover:underline dark:group-hover:text-slate-50 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{article.source}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 mt-6 relative overflow-hidden group/explore">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[40px] rounded-full pointer-events-none group-hover/explore:bg-violet-500/20 transition-colors duration-500" />
        
        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg mb-4 relative z-10">
          Explore Topics
        </h3>
        <div className="flex flex-wrap gap-2 relative z-10">
          {["AI", "Startups", "Elections", "Climate", "Crypto", "Space", "HealthTech", "Markets"].map(
            (tag) => (
              <button 
                key={tag} 
                onClick={() => window.location.href = `/search?q=${encodeURIComponent(tag)}`}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg cursor-pointer hover:bg-violet-600 hover:text-white hover:border-violet-600 dark:hover:bg-violet-600 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-violet-500/25 hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-violet-500 dark:text-fuchsia-400 group-hover:text-white transition-colors">#</span>
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
