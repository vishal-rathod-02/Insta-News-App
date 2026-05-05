import React, { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './shared/Icons';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle } from 'lucide-react';

interface WeatherWidgetProps {
  variant?: 'navtracker' | 'sidebar';
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ }) => {
  const { weather, loading, error, getWeatherCondition } = useWeather();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderWeatherIcon = (condition: string, className: string = "w-4 h-4") => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) return <Sun className={className} />;
    if (cond.includes('rain') || cond.includes('showers')) return <CloudRain className={className} />;
    if (cond.includes('drizzle')) return <CloudDrizzle className={className} />;
    if (cond.includes('snow')) return <CloudSnow className={className} />;
    if (cond.includes('thunder')) return <CloudLightning className={className} />;
    if (cond.includes('fog')) return <CloudFog className={className} />;
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
        className="w-full relative group/weather overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/80 dark:border-slate-700/50 hover:border-violet-500/50 dark:hover:border-fuchsia-400/50 transition-all duration-300 text-left hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5"
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-500/10 rounded-full blur-[20px] group-hover/weather:bg-fuchsia-500/20 transition-colors duration-500" />
        
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 group-hover/weather:scale-110 transition-transform">
              {renderWeatherIcon(weather.condition)}
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Weather Report</h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
              {weather.temperature}°<span className="text-sm opacity-80">C</span>
            </span>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed truncate max-w-[150px]">
            {weather.city} • <span className="capitalize">{weather.condition}</span>
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">
            H:{weather.high}° L:{weather.low}°
          </span>
        </div>
      </button>
    );
  };

  return (
    <>
      {renderWidget()}

      <AnimatePresence>
        {isModalOpen && weather && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl overflow-hidden shadow-2xl p-6 border border-white/20 dark:border-slate-800"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>

              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{weather.city}</h3>
                <div className="text-6xl font-black text-violet-600 dark:text-fuchsia-400 mt-2 mb-1">{weather.temperature}°C</div>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{weather.condition}</p>
                <div className="flex justify-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-300 font-semibold">
                  <span>High: {weather.high}°</span>
                  <span>Low: {weather.low}°</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">7-Day Forecast</h4>
                {weather.daily.map((day, i) => {
                  const dateObj = new Date(day.date + 'T00:00:00');
                  const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  return (
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <span className="w-20 font-medium text-slate-700 dark:text-slate-200">{dayName}</span>
                      <div className="flex-1 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-left pl-4">
                        {renderWeatherIcon(getWeatherCondition(day.conditionCode), "w-4 h-4 opacity-70")}
                        <span>{getWeatherCondition(day.conditionCode)}</span>
                      </div>
                      <div className="w-24 text-right text-slate-600 dark:text-slate-300 font-bold">
                        {day.maxTemp}° <span className="opacity-50 text-xs font-medium ml-1">/ {day.minTemp}°</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeatherWidget;
