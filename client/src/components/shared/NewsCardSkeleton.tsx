
import React from 'react';

const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-2 animate-pulse"></div>
        <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded-md mb-2 animate-pulse"></div>
        <div className="h-6 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-md mb-4 animate-pulse"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-md mb-4 animate-pulse"></div>
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md mb-4 animate-pulse"></div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
