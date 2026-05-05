import React from 'react';
import { Briefcase, Cpu, Globe, Landmark, Film, Trophy, Activity, Zap } from 'lucide-react';
import type { NewsCategory } from '../utils/types';

interface CategoryHeroProps {
  category: NewsCategory;
}

const getCategoryIcon = (id: string) => {
  const iconClass = "w-10 h-10 sm:w-14 sm:h-14 text-violet-600 dark:text-violet-400";
  switch (id) {
    case 'business': return <Briefcase className={iconClass} />;
    case 'technology': return <Cpu className={iconClass} />;
    case 'world': return <Globe className={iconClass} />;
    case 'politics': return <Landmark className={iconClass} />;
    case 'entertainment': return <Film className={iconClass} />;
    case 'sports': return <Trophy className={iconClass} />;
    case 'health': return <Activity className={iconClass} />;
    default: return <Zap className={iconClass} />;
  }
};

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 p-[1.5px] mb-12 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]">
      <div className="relative bg-white/95 dark:bg-[#0A0510]/95 backdrop-blur-3xl rounded-[30.5px] p-8 sm:p-12 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 z-10 group">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-8 text-center sm:text-left w-full">
          <div className="p-4 sm:p-5 rounded-3xl bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-500/20 shadow-xl inline-flex shrink-0 mx-auto sm:mx-0">
            {getCategoryIcon(category.id)}
          </div>
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-md capitalize">
              {category.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed mx-auto sm:mx-0">
              Explore the latest updates, breaking stories, and deep dives into {category.title.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;
