import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
} from "lucide-react";

type Sport = "cricket" | "football";

const SportsScoreCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Sport>("cricket");
  const [matchesData, setMatchesData] = useState<Record<Sport, any[]>>({
    cricket: [],
    football: [],
  });
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getTeamAbbreviation = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        const response = await fetch("/api/sports/live");
        const result = await response.json();
        if (result.success && result.data) {
          setMatchesData(result.data);
        }
      } catch (error) {
        console.error("Error fetching live scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-10 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          Live Scoreboard
        </h3>

        {/* Navigation and Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0a0a0a] p-1.5 rounded-xl border border-slate-200 dark:border-oled-border">
            {(["cricket", "football"] as Sport[]).map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveTab(sport)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${activeTab === sport
                  ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-fuchsia-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent'
                  }`}
              >
                {sport === "cricket" ? (
                  <Trophy className="w-3.5 h-3.5" />
                ) : (
                  <Target className="w-3.5 h-3.5" />
                )}
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* Left Arrow Overlay */}
        <button
          onClick={() => scroll("left")}
          className="hidden lg:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 border border-slate-200/50 dark:border-slate-600/50 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Overlay */}
        <button
          onClick={() => scroll("right")}
          className="hidden lg:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 border border-slate-200/50 dark:border-slate-600/50 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
        >
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center py-8"
              >
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
            )}
            {!loading &&
              matchesData[activeTab]?.map((match, idx) => (
                <motion.div
                  key={`${activeTab}-${match.id}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: idx * 0.05,
                    ease: "easeOut",
                  }}
                  className="min-w-[280px] sm:min-w-[320px] snap-center shrink-0 bg-white dark:bg-[#0a0a0a] rounded-4xl p-5 border border-slate-200 dark:border-oled-border shadow-sm relative overflow-hidden group hover:border-violet-300 dark:hover:border-fuchsia-500/30 transition-colors cursor-pointer"
                  onClick={() =>
                    match.link && window.open(match.link, "_blank")
                  }
                >
                  {/* Vibrant Glow Effect for Live matches */}
                  {match.isLive && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-60"></div>
                  )}

                  <div className="flex justify-between items-center mb-5">
                    <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md ${match.isLive
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                      {match.time}
                    </span>
                    {match.isLive && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        Live
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-inner">
                          {getTeamAbbreviation(match.team1)}
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">
                          {match.team1}
                        </span>
                      </div>
                      <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white text-right shrink-0">
                        {match.score1}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-inner">
                          {getTeamAbbreviation(match.team2)}
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">
                          {match.team2}
                        </span>
                      </div>
                      <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white text-right shrink-0">
                        {match.score2}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity
                        className={`w-3.5 h-3.5 ${match.isLive ? "text-violet-500 dark:text-fuchsia-400" : "text-slate-400"}`}
                      />
                      <p
                        className={`text-xs font-semibold ${match.isLive ? "text-violet-600 dark:text-fuchsia-400" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        {match.status}
                      </p>
                    </div>
                    {match.link && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-violet-500 dark:group-hover:text-fuchsia-400 transition-colors">
                        View Match &rarr;
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SportsScoreCard;
