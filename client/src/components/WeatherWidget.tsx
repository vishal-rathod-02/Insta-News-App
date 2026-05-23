import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWeather } from "../hooks/useWeather";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "./shared/Icons";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from "lucide-react";

interface WeatherWidgetProps {
  variant?: "navtracker" | "sidebar";
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ }) => {
  const { weather, loading, error, getWeatherCondition } = useWeather();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const renderWeatherIcon = (
    condition: string,
    className: string = "w-4 h-4",
  ) => {
    const cond = condition.toLowerCase();
    if (cond.includes("clear")) return <Sun className={className} />;
    if (cond.includes("rain") || cond.includes("showers"))
      return <CloudRain className={className} />;
    if (cond.includes("drizzle")) return <CloudDrizzle className={className} />;
    if (cond.includes("snow")) return <CloudSnow className={className} />;
    if (cond.includes("thunder"))
      return <CloudLightning className={className} />;
    if (cond.includes("fog")) return <CloudFog className={className} />;
    return <Cloud className={className} />;
  };

  const renderWidget = () => {
    if (loading || error || !weather) {
      return (
        <div className="animate-pulse flex gap-2 h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
      );
    }

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full relative group/weather overflow-hidden rounded-3xl bg-linear-to-br from-white to-slate-50 dark:from-[#1A1425] dark:to-[#0F0A18] p-5 border border-violet-100 dark:border-violet-900/30 hover:border-violet-300 dark:hover:border-violet-700/50 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(139,92,246,0.15)] transition-all duration-500 text-left hover:-translate-y-1"
      >
        {/* Animated Background Gradients */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-[30px] group-hover/weather:scale-150 transition-transform duration-700 ease-out" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[30px] group-hover/weather:scale-150 transition-transform duration-700 ease-out delay-100" />

        <div className="relative z-10 flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 group-hover/weather:rotate-12 transition-transform duration-500">
              {renderWeatherIcon(weather.condition, "w-5 h-5")}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {weather.city}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                {weather.condition}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 tracking-tighter leading-none">
              {weather.temperature}°
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between px-3 py-2 bg-slate-100/50 dark:bg-black/20 rounded-xl border border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              High
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {weather.high}°
            </span>
          </div>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              Low
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {weather.low}°
            </span>
          </div>
        </div>
      </button>
    );
  };

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && weather && (
        <div className="fixed inset-0 z-9999 overflow-y-auto custom-scrollbar">
          {/* Fixed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Scrollable Container */}
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white/80 dark:bg-[#0A0510]/95 backdrop-blur-2xl rounded-4xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(139,92,246,0.5)] border border-white/50 dark:border-white/10 p-6 sm:p-8"
            >
              {/* Premium Glows */}
              <div className="absolute -top-16 -right-24 w-80 h-64 bg-violet-500/30 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-24 w-80 h-64 bg-fuchsia-500/30 rounded-full blur-[70px] pointer-events-none" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100/80 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-200 transition-all z-20 shadow-sm active:scale-95"
              >
                <XIcon className="w-4 h-4" />
              </button>

              <div className="relative z-10 flex flex-col items-center mb-6 mt-1">
                <div className="p-3.5 rounded-3xl bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 dark:border-fuchsia-500/20 mb-3 shadow-inner">
                  {renderWeatherIcon(
                    weather.condition,
                    "w-8 h-8 sm:w-10 sm:h-10 text-violet-600 dark:text-fuchsia-400 drop-shadow-md",
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white mb-0.5">
                  {weather.city}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 capitalize tracking-wide">
                  {weather.condition}
                </p>

                <div className="text-[4rem] sm:text-[4.5rem] leading-none font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mt-2 mb-2 drop-shadow-sm">
                  {weather.temperature}°
                </div>

                <div className="flex items-center gap-6 mt-1">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                      High
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
                      {weather.high}°
                    </span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                      Low
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
                      {weather.low}°
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-slate-50/80 dark:bg-black/20 rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-inner">
                <h4 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" /> 7-Day Forecast
                </h4>
                <div className="space-y-2.5">
                  {weather.daily.map((day, i) => {
                    const dateObj = new Date(day.date + "T00:00:00");
                    const dayName =
                      i === 0
                        ? "Today"
                        : dateObj.toLocaleDateString("en-US", {
                          weekday: "short",
                        });
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between group"
                      >
                        <span
                          className={`w-12 sm:w-14 font-bold text-xs sm:text-sm ${i === 0 ? "text-violet-600 dark:text-fuchsia-400" : "text-slate-600 dark:text-slate-300"}`}
                        >
                          {dayName}
                        </span>

                        <div className="flex-1 flex justify-center">
                          <div className="p-1 rounded-full bg-slate-200/50 dark:bg-white/5 group-hover:bg-violet-100 dark:group-hover:bg-violet-500/20 transition-colors">
                            {renderWeatherIcon(
                              getWeatherCondition(day.conditionCode),
                              "w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-fuchsia-400",
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 w-20 sm:w-24 justify-end">
                          <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                            {day.minTemp}°
                          </span>
                          {/* Visual Temp Bar */}
                          <div className="w-6 sm:w-8 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                            <div className="absolute inset-y-0 bg-linear-to-r from-violet-400 to-fuchsia-500 rounded-full w-full opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">
                            {day.maxTemp}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {renderWidget()}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default WeatherWidget;
