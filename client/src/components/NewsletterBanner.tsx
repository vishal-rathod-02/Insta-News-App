import React from 'react';

const NewsletterBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-r from-violet-600 via-fuchsia-600 to-amber-500 p-[1.5px] mb-12 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)]">
      <div className="relative bg-white/95 dark:bg-[#0A0510]/95 backdrop-blur-3xl rounded-[30.5px] p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            Premium Digest
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
            Never Miss a Headline.
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Get the most important stories curated by our expert editors delivered straight to your inbox every morning.
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white min-w-[280px] transition-all placeholder:text-slate-400"
            />
            <button className="px-8 py-4 rounded-2xl font-bold text-white gradient-primary neon-glow hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
              Subscribe ✨
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-4 text-center font-medium">
            Join 50,000+ smart readers. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBanner;
