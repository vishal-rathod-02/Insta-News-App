import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookmarkIcon, HistoryIcon, SettingsIcon, XIcon } from "./shared/Icons";
import { CATEGORIES } from "../utils/Categories";
import { CATEGORY_ICONS } from "../utils/CategoryIcons";
import { Compass, UserCircle } from "lucide-react";
import type { SidebarProps } from "../utils/types";
import WeatherWidget from "./WeatherWidget";
import { useUser as useLocalUser } from "../context/UserContext";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeCategory,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedArticles, readingHistory } = useLocalUser();
  const { user } = useUser();
  const clerk = useClerk();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-oled-black/40 backdrop-blur-sm z-100 transition-opacity duration-300 md:hidden
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 z-110 h-full w-[85%] max-w-sm lg:hidden
        bg-white dark:bg-slate-950
        shadow-2xl flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="p-6 bg-slate-50 dark:bg-oled-black border-b border-violet-50 dark:border-oled-border">
          <div className="flex justify-between items-start mb-4">
            <img
              src="/logo.svg"
              alt="Insta-News"
              className="w-12 h-12 rounded-2xl shadow-xl shadow-fuchsia-500/20"
            />
            <button
              onClick={onClose}
              className="p-2 bg-white dark:bg-oled-border rounded-full shadow-sm"
            >
              <XIcon className="w-5 h-5 text-violet-600/70" />
            </button>
          </div>

          <SignedIn>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {user?.fullName || "User"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <button
              onClick={() => {
                navigate("/my-news");
                onClose();
              }}
              className="mt-4 w-full py-2.5 gradient-primary text-white neon-glow font-semibold rounded-lg text-sm transition-transform active:scale-95"
            >
              Go to My News Feed
            </button>
          </SignedIn>

          <SignedOut>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Guest User
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to sync your news
            </p>
            <SignInButton mode="modal">
              <button className="mt-4 w-full relative overflow-hidden group py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 border border-white/20 dark:border-white/10 hover:shadow-violet-500/30">
                <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-fuchsia-600 to-amber-500 transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-2">
                  <UserCircle className="w-5 h-5" />
                  Sign In / Create Account
                </span>
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget variant="sidebar" />

          {/* My News */}
          <div className="space-y-1">
            <p className="px-2 text-xs font-bold text-violet-500 uppercase mb-2">
              My News
            </p>
            <SignedIn>
              <SidebarLink
                icon={<BookmarkIcon />}
                label="Saved Articles"
                count={savedArticles.length}
                onClick={() => {
                  navigate("/saved");
                  onClose();
                }}
                isActive={location.pathname === "/saved"}
              />
              <SidebarLink
                icon={<HistoryIcon />}
                label="Reading History"
                count={readingHistory.length}
                onClick={() => {
                  navigate("/history");
                  onClose();
                }}
                isActive={location.pathname === "/history"}
              />
              <SidebarLink
                icon={<SettingsIcon />}
                label="Preferences"
                onClick={() => {
                  navigate("/my-news");
                  onClose();
                }}
                isActive={location.pathname === "/my-news"}
              />
              <SidebarLink
                icon={<UserCircle className="w-5 h-5 text-inherit" />}
                label="Manage Account"
                onClick={() => {
                  clerk.openUserProfile();
                  onClose();
                }}
              />
            </SignedIn>
            <SignedOut>
              <div className="px-3 py-4 text-center rounded-xl bg-violet-50/50 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Sign in to unlock Bookmarks, Reading History, and Personalized
                  Feeds.
                </p>
                <SignInButton mode="modal">
                  <button className="w-full mt-2 py-2 px-4 rounded-lg bg-white dark:bg-slate-800 text-violet-600 dark:text-fuchsia-400 font-bold text-xs border border-violet-100 dark:border-violet-500/20 shadow-sm hover:shadow-md hover:border-violet-300 dark:hover:border-violet-500/50 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Log In Now &rarr;
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>

          {/* Categories */}
          <div>
            <p className="px-2 text-xs font-bold text-violet-500 uppercase mb-3">
              Sections
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                className={`flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-2xl text-xs font-semibold transition-all border
                ${
                  location.pathname === "/"
                    ? "gradient-primary neon-glow text-white border-transparent shadow-lg shadow-violet-500/25"
                    : "glass-panel text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <Compass
                  className={`w-6 h-6 ${location.pathname === "/" ? "" : "text-slate-400 dark:text-slate-500"}`}
                />
                Discover
              </button>

              {CATEGORIES.map((cat) => {
                const isActive =
                  activeCategory === cat.id && location.pathname !== "/";
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigate(`/category/${cat.id}`);
                      onClose();
                    }}
                    className={`flex flex-col items-center justify-center gap-2 px-2 py-4 rounded-2xl text-xs font-semibold transition-all border
                    ${
                      isActive
                        ? "gradient-primary neon-glow text-white border-transparent shadow-lg shadow-violet-500/25"
                        : "glass-panel text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400 hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    {React.cloneElement(
                      CATEGORY_ICONS[cat.id] as React.ReactElement<any>,
                      {
                        className: `w-6 h-6 ${isActive ? "" : "text-slate-400 dark:text-slate-500"}`,
                      },
                    )}
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-violet-50 dark:border-oled-border text-center">
          <p className="text-xs text-violet-500">Version 1.0.0 • InstaNews</p>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({
  icon,
  label,
  count,
  onClick,
  isActive,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-300 group ${
      isActive
        ? "gradient-primary neon-glow text-white shadow-lg shadow-violet-500/25 scale-[1.02]"
        : "text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:-translate-y-0.5"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 text-violet-500"}`}
      >
        {icon}
      </span>
      <span className="text-sm font-bold tracking-wide">{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span
        className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow-sm ${isActive ? "bg-white text-violet-600" : "bg-violet-500 text-white"}`}
      >
        {count}
      </span>
    )}
  </button>
);

export default Sidebar;
