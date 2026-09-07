import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { customClerkAppearance } from "../utils/clerkTheme";

export const SignInPage: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Banner */}
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <img
            src="/logo.svg"
            alt="Insta-News"
            className="w-10 h-10 rounded-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              INSTA<span className="text-violet-500">NEWS</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Instant Intelligence
            </span>
          </div>
        </Link>

        {/* Feature Highlights */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" /> AI Summaries
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Real-time Feed
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Sync
          </span>
        </div>

        {/* Clerk Sign In */}
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          appearance={customClerkAppearance}
        />
      </div>
    </div>
  );
};

export const SignUpPage: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Banner */}
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <img
            src="/logo.svg"
            alt="Insta-News"
            className="w-10 h-10 rounded-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              INSTA<span className="text-violet-500">NEWS</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Instant Intelligence
            </span>
          </div>
        </Link>

        {/* Feature Highlights */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Personalized Topics
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Cloud Bookmarks
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Google OAuth
          </span>
        </div>

        {/* Clerk Sign Up */}
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={customClerkAppearance}
        />
      </div>
    </div>
  );
};
