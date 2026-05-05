import React from 'react';
import { useNews } from '../hooks/useNews';
import DataFetchError from './shared/DataFetchError';

interface LiveSidebarProps {
  country: string;
  category: string;
}

const LiveSidebar: React.FC<LiveSidebarProps> = ({ country }) => {
  const { articles, isLoading, error } = useNews(country, 'live', 10);

  const formatTime = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(dateStr));
    } catch {
      return 'Just now';
    }
  };

  return (
    <aside className="hidden lg:block w-[320px] shrink-0 sticky top-32 self-start h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar pr-2 pb-10">
      <div className="glass-panel rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/50 border border-slate-100 dark:border-slate-800/80 relative overflow-hidden">
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500 blur-sm opacity-50" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            </span>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-50 uppercase tracking-widest text-sm">
              Live Feed
            </h3>
          </div>
          <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md uppercase tracking-wider">
            Auto-Sync
          </span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-3 border-l-2 border-slate-100 dark:border-slate-800/80 space-y-8">
          {error ? (
            <DataFetchError message={error} />
          ) : isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse relative">
                <div className="absolute -left-[18.5px] top-1 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-950" />
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))
          ) : (
            articles.slice(0, 10).map((article, i) => (
              <div key={`${article.id}-${i}`} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[18.5px] top-1 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-950 transition-colors group-hover:bg-violet-500 dark:group-hover:bg-fuchsia-500" />
                
                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 tracking-wider">
                      {formatTime(article.pubDate)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-30">
                      • {article.source}
                    </span>
                  </div>
                  
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300 leading-snug group-hover:text-slate-700 group-hover:underline dark:group-hover:text-slate-100 transition-colors line-clamp-3">
                      {article.title}
                    </h4>
                  </a>
                  
                  {/* Expand first article slightly */}
                  {i === 0 && article.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden aspect-video shadow-md">
                       <img src={article.imageUrl} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" alt="" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default LiveSidebar;
