import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from "./shared/Icons";
import { CATEGORIES } from "../utils/Categories";
import { CATEGORY_ICONS } from "../utils/CategoryIcons";
import type { NavbarProps } from "../utils/types";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import { Compass, Loader2, X, Bookmark, History, Sparkles } from "lucide-react";
import { getNewsForCategory } from "../services/newsService";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import MarketTicker from "./MarketTicker";

const SUGGESTIONS = [
  "Global News",
  "Technology Trends",
  "Market Updates",
  "Sports Highlights",
  "Health & Wellness",
  "Entertainment Buzz",
  "Political Updates",
];

const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onToggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const [liveSuggestions, setLiveSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      try {
        const articles = await getNewsForCategory("IN", "top", 6, {
          trending: true,
        });
        const titles = articles.map((a: any) => a.title).filter(Boolean);
        if (isMounted) {
          setTrendingTopics(Array.from(new Set(titles)));
        }
      } catch (err) {
        console.error("Failed to fetch trending topics", err);
      }
    };
    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const articles = await getNewsForCategory("IN", "all", 5, {
          keyword: searchQuery,
        });
        const titles = articles.map((a: any) => a.title).filter(Boolean);
        setLiveSuggestions(Array.from(new Set(titles)));
      } catch (err) {
        console.error("Failed to fetch live suggestions", err);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displaySuggestions = searchQuery.trim()
    ? liveSuggestions
    : trendingTopics.length > 0
      ? trendingTopics
      : SUGGESTIONS;

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    } else if (location.pathname !== "/search") {
      setSearchQuery("");
    }
  }, [searchParams, location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b 
      ${isScrolled
          ? "bg-white/80 dark:bg-oled-black/80 backdrop-blur-md border-violet-100 dark:border-oled-border"
          : "bg-white dark:bg-oled-black border-transparent"
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* BRAND */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src="/logo.svg"
              alt="Insta-News"
              className="w-8 h-8 rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-none">
                INSTA
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-widest leading-none">
                NEWS
              </span>
            </div>
          </Link>

          {/* SEARCH (Desktop Only) */}
          <div
            className="hidden md:block flex-1 max-w-md mx-auto relative"
            ref={searchContainerRef}
          >
            <div className="relative p-[1.5px] rounded-full overflow-hidden flex items-center justify-center group">
              {/* Spinning Google AI-style border (Continuous non-hover) */}
              <div
                className="absolute w-[300%] h-[300%] animate-spin opacity-80"
                style={{
                  animationDuration: "5s",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 60%, #F59E0B 85%, #8B5CF6 100%)",
                }}
              />

              {/* Inner Search Field */}
              <div className="relative flex w-full items-center bg-violet-50 dark:bg-oled-surface rounded-full overflow-hidden focus-within:bg-white dark:focus-within:bg-[#0A0510] transition-colors z-10">
                <span className="pl-4 pr-2 text-violet-500 group-focus-within:text-amber-500 transition-colors">
                  <SearchIcon className="w-4 h-4" />
                </span>
                <input
                  id="news-search"
                  name="newsSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(searchQuery);
                    }
                  }}
                  placeholder="Search headlines..."
                  autoComplete="off"
                  className="w-full bg-transparent py-2 pr-10 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none"
                />

                {/* Clear Button */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      title="Clear search"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Auto-suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-oled-surface/95 backdrop-blur-2xl border border-violet-100 dark:border-violet-500/20 rounded-2xl shadow-[0_10px_40px_-10px_rgba(139,92,246,0.15)] overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  {searchQuery ? "Suggestions" : "Trending Topics"}
                </div>
                {isFetchingSuggestions && searchQuery.trim() ? (
                  <div className="px-3 py-4 flex justify-center items-center">
                    <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                  </div>
                ) : displaySuggestions.length > 0 ? (
                  <ul className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {displaySuggestions.map((suggestion, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleSearch(suggestion)}
                          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors group"
                        >
                          <SearchIcon className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors shrink-0" />
                          <span className="truncate">{suggestion}</span>
                        </button>
                      </li>
                    ))}
                    {searchQuery &&
                      !displaySuggestions.some(
                        (s) => s.toLowerCase() === searchQuery.toLowerCase(),
                      ) && (
                        <li className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => handleSearch(searchQuery)}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-sm font-bold text-violet-700 dark:text-violet-300 transition-colors group"
                          >
                            <SearchIcon className="w-4 h-4 text-violet-500 transition-colors shrink-0" />
                            <span className="truncate">
                              Search for "{searchQuery}"
                            </span>
                          </button>
                        </li>
                      )}
                  </ul>
                ) : (
                  <div className="px-3 py-4 flex flex-col items-center justify-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      No matching topics found.
                    </span>
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-lg shadow-violet-500/20 transition-all active:scale-95"
                    >
                      <SearchIcon className="w-4 h-4" />
                      Search for "{searchQuery}"
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-oled-border transition-colors"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all border border-slate-200 dark:border-slate-700 active:scale-95">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2 mr-2">
                  <Link
                    to="/my-news"
                    className={`p-2.5 rounded-full transition-all duration-300 ${location.pathname === "/my-news" ? "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] scale-110" : "text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-fuchsia-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"}`}
                    title="My News"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/saved"
                    className={`p-2.5 rounded-full transition-all duration-300 ${location.pathname === "/saved" ? "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] scale-110" : "text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-fuchsia-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"}`}
                    title="Saved Articles"
                  >
                    <Bookmark className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/history"
                    className={`p-2.5 rounded-full transition-all duration-300 ${location.pathname === "/history" ? "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] scale-110" : "text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-fuchsia-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"}`}
                    title="Reading History"
                  >
                    <History className="w-4 h-4" />
                  </Link>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "w-8 h-8 rounded-full border-2 border-violet-200 dark:border-violet-800 shadow-sm shadow-violet-500/20",
                    },
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-900 dark:text-slate-50 hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV */}
      <div className="border-t border-violet-50 dark:border-oled-border">
        <div className=" mx-auto px-2 lg:px-8">
          <LayoutGroup>
            <div className="relative flex gap-6 lg:gap-8 py-3 overflow-x-auto scrollbar-hide lg:justify-center">
              {/* DISCOVER ROUTE */}
              <Link
                to="/"
                className={`group relative flex items-center gap-2 pb-2 text-sm font-medium whitespace-nowrap transition-colors ${location.pathname === "/"
                    ? "text-violet-600 dark:text-fuchsia-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-300"
                  }`}
              >
                <Compass className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
                <span className="transition-transform duration-300 group-hover:-translate-y-px">
                  Discover
                </span>
                {location.pathname === "/" && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.75 gradient-primary neon-glow rounded-t-md"
                  />
                )}
              </Link>

              {CATEGORIES.map((cat) => {
                const isActiveRoute =
                  location.pathname === `/category/${cat.id}`;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className={`group relative flex items-center gap-2 pb-2 text-sm font-medium whitespace-nowrap transition-colors ${isActiveRoute
                        ? "text-violet-600 dark:text-fuchsia-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-300"
                      }`}
                  >
                    {React.cloneElement(
                      CATEGORY_ICONS[cat.id] as React.ReactElement<any>,
                      {
                        className:
                          "w-4 h-4 text-inherit transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-[1px]",
                      },
                    )}
                    <span className="transition-transform duration-300 group-hover:-translate-y-px">
                      {cat.title}
                    </span>
                    {isActiveRoute && (
                      <motion.span
                        layoutId="navbar-underline"
                        className="absolute left-0 right-0 -bottom-px h-0.75 gradient-primary neon-glow rounded-t-md"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      </div>

      {/* LIVE MARKET & CRYPTO MARQUEE TICKER */}
      <MarketTicker />
    </header>
  );
};

export default Navbar;
