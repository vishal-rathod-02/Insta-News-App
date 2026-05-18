import React from "react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";

interface ArticleSourcePanelProps {
  link: string;
}

const ArticleSourcePanel: React.FC<ArticleSourcePanelProps> = ({ link }) => {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
      <div className="flex flex-col">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
          Want to read more?
        </span>

        <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-violet-500" /> Original Source
        </span>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold tracking-wide shadow-md shadow-violet-500/20 transition-all active:scale-95"
      >
        Read Full Article <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

export default ArticleSourcePanel;
