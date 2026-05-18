import React from 'react';

const NewsletterBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-amber-500 p-[1.5px] mb-12 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]">
      <div className="relative bg-white/95 dark:bg-[#0A0510]/95 backdrop-blur-3xl rounded-[30.5px] p-8 sm:p-12 overflow-hidden flex flex-col items-center justify-center gap-6 z-10 text-center">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-linear-to-r from-violet-100 to-fuchsia-100 dark:from-violet-500/20 dark:to-fuchsia-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-widest shadow-inner border border-violet-200/50 dark:border-violet-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Premium Digest
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Curated Intelligence. <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
              Coming Soon.
            </span>
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto font-medium leading-relaxed">
            We are crafting a highly personalized, AI-driven daily digest that delivers the most critical stories perfectly tailored to your interests.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner group cursor-default">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-300">
                Currently in Private Beta
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
