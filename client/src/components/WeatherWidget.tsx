import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useWeather, type CitySearchResult } from "../hooks/useWeather";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Search,
  MapPin,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Sparkles,
  Star,
  X,
  RefreshCw,
  Gauge,
  Thermometer,
  ChevronRight,
} from "lucide-react";

interface WeatherWidgetProps {
  variant?: "navtracker" | "sidebar";
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = () => {
  const {
    weather,
    loading,
    error,
    unit,
    toggleUnit,
    convertTemp,
    fetchWeather,
    searchCities,
    loadCurrentLocationWeather,
    savedCities,
    toggleFavoriteCity,
  } = useWeather();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Debounced City Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchCities(val);
      // Prioritize Indian cities if matching, followed by other locations
      const sorted = [...results].sort((a, b) => {
        const aIndia = a.country.toLowerCase().includes("india") ? -1 : 1;
        const bIndia = b.country.toLowerCase().includes("india") ? -1 : 1;
        return aIndia - bIndia;
      });
      setSearchResults(sorted);
      setIsSearching(false);
    }, 300);
  };

  const handleSelectCity = (city: CitySearchResult) => {
    fetchWeather(city.latitude, city.longitude, city.name, city.country);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Weather Icon Component
  const renderWeatherIcon = (
    conditionCode: number,
    isDay: boolean = true,
    className: string = "w-5 h-5"
  ) => {
    if (conditionCode === 0) {
      return isDay ? (
        <Sun className={`${className} text-amber-500 dark:text-amber-400 animate-spin-slow`} />
      ) : (
        <Moon className={`${className} text-indigo-500 dark:text-indigo-300`} />
      );
    }
    if (conditionCode === 1 || conditionCode === 2) {
      return isDay ? (
        <CloudSun className={`${className} text-amber-500 dark:text-amber-300`} />
      ) : (
        <CloudMoon className={`${className} text-indigo-500 dark:text-indigo-300`} />
      );
    }
    if (conditionCode === 3) {
      return <Cloud className={`${className} text-slate-500 dark:text-slate-400`} />;
    }
    if (conditionCode === 45 || conditionCode === 48) {
      return <CloudFog className={`${className} text-teal-600 dark:text-teal-300`} />;
    }
    if (conditionCode >= 51 && conditionCode <= 57) {
      return <CloudDrizzle className={`${className} text-sky-500 dark:text-sky-400`} />;
    }
    if (conditionCode >= 61 && conditionCode <= 67) {
      return <CloudRain className={`${className} text-blue-500 dark:text-blue-400`} />;
    }
    if (conditionCode >= 71 && conditionCode <= 86) {
      return <CloudSnow className={`${className} text-cyan-600 dark:text-cyan-200`} />;
    }
    if (conditionCode >= 95) {
      return <CloudLightning className={`${className} text-amber-500 dark:text-yellow-400`} />;
    }
    return <Cloud className={`${className} text-slate-500 dark:text-slate-400`} />;
  };

  const isCurrentFavorite = weather && savedCities.some(
    (c) => c.name.toLowerCase() === weather.city.toLowerCase()
  );

  // Mini Widget for Sidebar / Navigation
  const renderWidget = () => {
    if (loading && !weather) {
      return (
        <div className="w-full h-32 rounded-3xl bg-slate-100 dark:bg-[#120722]/60 animate-pulse border border-slate-200/60 dark:border-violet-500/15 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-violet-900/30" />
            <div className="space-y-1.5 flex-1">
              <div className="w-20 h-3.5 rounded bg-slate-200 dark:bg-violet-900/30" />
              <div className="w-14 h-2.5 rounded bg-slate-200 dark:bg-violet-900/20" />
            </div>
          </div>
          <div className="w-full h-6 rounded-xl bg-slate-200/60 dark:bg-violet-900/20" />
        </div>
      );
    }

    if (error && !weather) {
      return (
        <button
          onClick={loadCurrentLocationWeather}
          className="w-full p-4 rounded-3xl bg-slate-100 dark:bg-[#120722]/60 border border-slate-200 dark:border-violet-500/20 text-left hover:border-violet-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <RefreshCw className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            <span>Retry Weather</span>
          </div>
        </button>
      );
    }

    if (!weather) return null;

    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full relative group/weather overflow-hidden rounded-3xl bg-linear-to-br from-white via-slate-50 to-violet-50/40 dark:from-[#130726] dark:via-[#0D041A] dark:to-[#06020D] p-4.5 border border-slate-200 dark:border-violet-500/25 hover:border-violet-400 dark:hover:border-fuchsia-500/40 shadow-sm hover:shadow-[0_10px_30px_rgba(139,92,246,0.15)] transition-all duration-500 text-left hover:-translate-y-1 cursor-pointer"
      >
        {/* Ambient Atmosphere Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-fuchsia-500/10 dark:bg-fuchsia-500/20 rounded-full blur-2xl group-hover/weather:scale-125 transition-transform duration-700 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-2xl group-hover/weather:scale-125 transition-transform duration-700 pointer-events-none" />

        {/* Top Header: City & Weather Icon */}
        <div className="relative z-10 flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25 group-hover/weather:scale-105 group-hover/weather:rotate-6 transition-all duration-300 shrink-0">
              {renderWeatherIcon(weather.conditionCode, weather.isDay, "w-5 h-5")}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-violet-600 dark:text-violet-400 shrink-0" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                  {weather.city}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize truncate font-medium">
                {weather.condition}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 tracking-tight leading-none">
              {convertTemp(weather.temperature)}°{unit}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Feels {convertTemp(weather.feelsLike)}°
            </span>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="relative z-10 flex items-center justify-between px-3 py-1.5 bg-slate-100/90 dark:bg-black/40 rounded-xl border border-slate-200/70 dark:border-white/5 text-[10px]">
          <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 dark:text-slate-500">H:</span> {convertTemp(weather.high)}°{" "}
            <span className="text-slate-400 dark:text-slate-500 ml-1">L:</span> {convertTemp(weather.low)}°
          </div>

          <div className="flex items-center gap-2">
            {weather.rainProbability > 0 && (
              <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-semibold">
                <Droplets className="w-2.5 h-2.5" />
                {weather.rainProbability}%
              </span>
            )}
            <span className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] border ${weather.aqiColor}`}>
              AQI {weather.aqi}
            </span>
          </div>
        </div>
      </button>
    );
  };

  // Full Interactive Weather Center Modal with Full Theme Toggler Support
  const modalContent = (
    <AnimatePresence>
      {isModalOpen && weather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white dark:bg-[#0B0318] text-slate-800 dark:text-slate-100 rounded-4xl border border-slate-200/90 dark:border-violet-500/30 shadow-2xl dark:shadow-[0_0_60px_rgba(139,92,246,0.35)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
          >
            {/* Top Neon Accent Bar */}
            <div className="h-1 bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 shrink-0" />

            {/* Modal Header Bar & City Search (High z-index to overlay cleanly over all content) */}
            <div className="relative z-50 overflow-visible px-5 pt-4 pb-3 border-b border-slate-200/80 dark:border-violet-500/15 bg-slate-50/95 dark:bg-black/40 backdrop-blur-xl shrink-0 space-y-3">
              <div className="flex items-center justify-between gap-3">
                {/* Search Bar Input with high z-index autocomplete */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search any Indian or global city (e.g. Pune, Delhi, Mumbai)..."
                    className="w-full pl-9.5 pr-4 py-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-violet-500/25 focus:border-violet-500 dark:focus:border-violet-400 focus:outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-inner"
                  />
                  {isSearching && (
                    <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}

                  {/* Autocomplete Dropdown with Guaranteed High Stacking (z-[100]) */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-100 bg-white dark:bg-[#160A2C] border border-slate-200 dark:border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar">
                      {searchResults.map((city) => (
                        <button
                          key={`${city.id}-${city.latitude}`}
                          onClick={() => handleSelectCity(city)}
                          className="w-full px-4 py-2.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-violet-600/30 flex items-center justify-between transition-colors cursor-pointer border-b last:border-b-0 border-slate-100 dark:border-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-violet-600 dark:text-fuchsia-400 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-white">{city.name}</span>
                            {city.admin1 && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{city.admin1},</span>
                            )}
                            <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-300">{city.country}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Jump to GPS Local */}
                  <button
                    onClick={loadCurrentLocationWeather}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10"
                    title="Get Current GPS Location"
                  >
                    <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </button>

                  {/* Bookmark / Favorite City */}
                  <button
                    onClick={() => {
                      if (weather) {
                        toggleFavoriteCity({
                          id: Date.now(),
                          name: weather.city,
                          country: "India",
                          latitude: weather.latitude,
                          longitude: weather.longitude,
                        });
                      }
                    }}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${isCurrentFavorite
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-500 dark:text-amber-300"
                        : "bg-slate-100 dark:bg-white/10 border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    title={isCurrentFavorite ? "Saved in Favorites" : "Save as Favorite City"}
                  >
                    <Star className={`w-4 h-4 ${isCurrentFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>

                  {/* °C / °F Toggle */}
                  <button
                    onClick={toggleUnit}
                    className="px-2.5 py-1.5 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-xs shadow-md shadow-violet-500/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                    title="Switch Temperature Unit"
                  >
                    °{unit}
                  </button>

                  {/* Close Modal */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/10"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Indian Cities GPS Quick Switcher Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
                {savedCities.map((c) => {
                  const isActive = weather.city.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      onClick={() => fetchWeather(c.latitude, c.longitude, c.name, c.country)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${isActive
                          ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm shadow-violet-500/25"
                          : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10"
                        }`}
                    >
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar space-y-4 relative z-10 flex-1">
              {/* Main Hero Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-violet-500/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-3xl bg-linear-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-600/30 dark:to-fuchsia-600/30 border border-violet-500/30 shadow-inner">
                    {renderWeatherIcon(weather.conditionCode, weather.isDay, "w-12 h-12")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {weather.city}
                      </h2>
                      {weather.country && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                          {weather.country}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize flex items-center gap-2 mt-0.5">
                      <span>{weather.condition}</span>
                      <span className="text-slate-400 dark:text-slate-500">•</span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                        Feels like {convertTemp(weather.feelsLike)}°{unit}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <div className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-violet-700 via-fuchsia-600 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-violet-300 tracking-tighter leading-none">
                    {convertTemp(weather.temperature)}°{unit}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>High: {convertTemp(weather.high)}°</span>
                    <span>•</span>
                    <span>Low: {convertTemp(weather.low)}°</span>
                  </div>
                </div>
              </div>

              {/* Gemini AI Smart Weather Day Brief */}
              <div className="p-3.5 rounded-2xl bg-violet-50/90 dark:bg-linear-to-r dark:from-violet-950/80 dark:via-[#190B32]/90 dark:to-fuchsia-950/80 border border-violet-200 dark:border-violet-500/30 flex items-start gap-3 shadow-inner">
                <div className="p-1.5 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shrink-0 shadow-md shadow-violet-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                    Gemini AI Day Forecast Brief
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {weather.smartAdvice}
                  </p>
                </div>
              </div>

              {/* 24-Hour Hourly Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    24-Hour Forecast Timeline
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Hourly intervals</span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-2 pt-1 snap-x">
                  {weather.hourly.map((h, index) => (
                    <div
                      key={h.time + index}
                      className={`snap-center shrink-0 min-w-18 p-3 rounded-2xl border flex flex-col items-center justify-between gap-1.5 transition-all ${index === 0
                          ? "bg-violet-100/90 dark:bg-violet-600/30 border-violet-400/60 dark:border-violet-400/50 shadow-md shadow-violet-500/10 dark:shadow-violet-500/20"
                          : "bg-slate-50 dark:bg-black/30 border-slate-200/80 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/30 hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                    >
                      <span className={`text-[11px] font-bold ${index === 0 ? "text-violet-700 dark:text-violet-300 font-extrabold" : "text-slate-500 dark:text-slate-400"}`}>
                        {h.hour}
                      </span>
                      <div className="my-1">
                        {renderWeatherIcon(h.conditionCode, h.isDay, "w-6 h-6")}
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {convertTemp(h.temp)}°
                      </span>
                      {h.rainProb > 0 ? (
                        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                          <Droplets className="w-2 h-2" />
                          {h.rainProb}%
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">0%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmospheric Health & Metrics Grid (6 Interactive Tiles) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. Air Quality Index */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Air Quality (AQI)
                    </span>
                    <Gauge className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{weather.aqi}</div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${weather.aqiColor}`}>
                      {weather.aqiStatus}
                    </span>
                  </div>
                </div>

                {/* 2. Humidity */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Humidity
                    </span>
                    <Droplets className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{weather.humidity}%</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {weather.humidity > 65 ? "High moisture" : weather.humidity < 35 ? "Dry air" : "Comfortable"}
                    </p>
                  </div>
                </div>

                {/* 3. UV Index */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      UV Index
                    </span>
                    <Sun className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{weather.uvIndex}</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {weather.uvIndex >= 8 ? "Very High protection" : weather.uvIndex >= 5 ? "Moderate sun" : "Low risk"}
                    </p>
                  </div>
                </div>

                {/* 4. Wind Speed */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Wind Speed
                    </span>
                    <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{weather.windSpeed} km/h</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Direction: {weather.windDirection}°
                    </p>
                  </div>
                </div>

                {/* 5. Rain Probability */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Precipitation
                    </span>
                    <CloudRain className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{weather.rainProbability}%</div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Pressure: {weather.pressure} hPa
                    </p>
                  </div>
                </div>

                {/* 6. Sun Cycle */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-violet-500/15 flex flex-col justify-between gap-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Sun Times
                    </span>
                    <Sunrise className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                  </div>
                  <div className="space-y-0.5 text-xs font-bold text-slate-800 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Sunrise className="w-3 h-3 text-amber-500 dark:text-amber-400" /> {weather.sunrise}
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Sunset className="w-3 h-3 text-rose-500 dark:text-rose-400" /> {weather.sunset}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Extended Forecast */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-violet-500/20 backdrop-blur-md space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  7-Day Outlook
                </h4>

                <div className="space-y-2.5 divide-y divide-slate-200/60 dark:divide-white/5">
                  {weather.daily.map((day, i) => (
                    <div
                      key={day.date}
                      className="pt-2.5 first:pt-0 flex items-center justify-between text-xs"
                    >
                      <span className={`w-16 font-bold ${i === 0 ? "text-violet-600 dark:text-violet-400 font-black" : "text-slate-700 dark:text-slate-300"}`}>
                        {day.dayName}
                      </span>

                      <div className="flex items-center gap-2 flex-1 justify-center">
                        {renderWeatherIcon(day.conditionCode, true, "w-4 h-4")}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-28 sm:max-w-36">
                          {day.condition}
                        </span>
                      </div>

                      {day.rainProb > 0 ? (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 w-12 text-center">
                          {day.rainProb}%
                        </span>
                      ) : (
                        <span className="w-12 text-center text-[10px] text-slate-400 dark:text-slate-600">-</span>
                      )}

                      <div className="flex items-center gap-2 w-28 justify-end">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {convertTemp(day.minTemp)}°
                        </span>
                        {/* Gradient Temperature Bar */}
                        <div className="w-10 sm:w-14 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                          <div className="absolute inset-y-0 bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 rounded-full w-full" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                          {convertTemp(day.maxTemp)}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
