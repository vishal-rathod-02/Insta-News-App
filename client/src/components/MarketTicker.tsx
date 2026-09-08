import React, { useEffect, useState } from "react";
import { fetchMarkets, type MarketItem } from "../services/marketService";
import { TrendingUp, TrendingDown, Activity, Pause, Play, X } from "lucide-react";

const MarketTicker: React.FC = () => {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;

    const load = async () => {
      const data = await fetchMarkets();
      if (isMounted) setMarkets(data);
    };

    // Defer initial market load by 800ms to allow critical path FCP/LCP to finish first
    const initialTimer = setTimeout(() => {
      load();
      interval = setInterval(load, 60000); // 1 min auto-refresh
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (isDismissed || markets.length === 0) return null;

  // Duplicate list to create a seamless infinite marquee effect
  const marqueeItems = [...markets, ...markets, ...markets];

  return (
    <div className="relative z-30 w-full bg-white/95 dark:bg-[#080312]/95 border-b border-slate-200/80 dark:border-violet-500/20 backdrop-blur-md overflow-hidden select-none py-1.5 px-3">
      {/* Ambient gradient edges */}
      <div className="absolute left-0 inset-y-0 w-12 bg-linear-to-r from-white dark:from-[#080312] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-linear-to-l from-white dark:from-[#080312] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Market Label Badge */}
        <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded-lg bg-violet-100/80 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-500/30 text-[10px] font-black tracking-widest text-violet-700 dark:text-violet-300 uppercase shadow-xs">
          <Activity className="w-3 h-3 text-violet-600 dark:text-fuchsia-400 animate-pulse" />
          <span>MARKETS</span>
        </div>

        {/* Marquee Track (Controlled solely by the pause button) */}
        <div className="flex-1 overflow-hidden ml-3 mr-2">
          <div
            className="flex items-center gap-6 whitespace-nowrap animate-marquee"
            style={{
              animationDuration: "35s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {marqueeItems.map((item, idx) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-100 transition-opacity"
                >
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] font-bold tracking-tight">
                    {item.symbol}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-[11px] font-bold">
                    {item.price}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                      isPositive
                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                        : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {item.changePercent >= 0 ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: Pause/Play & Dismiss */}
        <div className="flex items-center gap-1 shrink-0 relative z-20">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={isPaused ? "Resume auto-scroll" : "Pause scroll"}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Hide market ticker"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
