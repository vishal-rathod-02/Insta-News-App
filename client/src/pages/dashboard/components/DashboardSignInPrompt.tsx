import React from "react";
import { SignInButton } from "@clerk/clerk-react";

const DashboardSignInPrompt: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
        Personalize Your Feed
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        Sign in to select your favorite topics and get a customized news feed delivered
        directly to you.
      </p>

      <SignInButton mode="modal">
        <button className="px-8 py-3 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform">
          Sign In to Continue
        </button>
      </SignInButton>
    </div>
  );
};

export default DashboardSignInPrompt;
