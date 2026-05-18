import React from "react";
import { ArrowLeft } from "lucide-react";

interface ArticleBackButtonProps {
  onBack: () => void;
}

const ArticleBackButton: React.FC<ArticleBackButtonProps> = ({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="group flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all active:scale-95 w-fit font-medium text-sm"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Back
    </button>
  );
};

export default ArticleBackButton;
