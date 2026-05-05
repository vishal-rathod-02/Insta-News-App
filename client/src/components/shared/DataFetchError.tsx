import React from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';

interface DataFetchErrorProps {
  message?: string;
  onRetry?: () => void;
}

const DataFetchError: React.FC<DataFetchErrorProps> = ({ 
  message = "Failed to fetch new articles", 
  onRetry 
}) => {
  return (
    <div className="w-full flex justify-center py-12">
      <div className="relative group max-w-md w-full">
        {/* Glow behind the card */}
        <div className="absolute -inset-1 bg-linear-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        {/* Gradient border wrapper */}
        <div className="relative p-[1px] rounded-2xl bg-linear-to-b from-red-200 to-orange-100 dark:from-red-500/50 dark:to-orange-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(239,68,68,0.15)] transition-all duration-300">
          <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-oled-surface rounded-[calc(1rem-1px)] text-center overflow-hidden">
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full mb-4">
            <WifiOff className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 text-center">
            Connection Interrupted
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6 text-sm">
            {message}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-colors active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFetchError;
