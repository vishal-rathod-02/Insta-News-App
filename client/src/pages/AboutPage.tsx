import React, { useEffect } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Globe2,
  Cpu,
  Layers,
  HeartHandshake,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center relative py-12 sm:py-16 overflow-hidden rounded-3xl glass-panel border border-violet-500/20 mb-16 shadow-2xl">
        {/* Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-6 border border-violet-200 dark:border-violet-700/50">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            Empowering Modern Readers
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            News at the Speed of Thought with{" "}
            <span className="bg-clip-text text-transparent bg-linear-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500">
              AI Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            InstaNews was built with a single mission: to eliminate information overload
            and deliver concise, intelligent, and beautifully curated news in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-full gradient-primary text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:opacity-95 transition-transform active:scale-95 flex items-center gap-2"
            >
              Explore Feed
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/category/technology"
              className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            >
              Technology News
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values / Features Grid */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Why Choose InstaNews?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Discover the technology and design philosophy that makes InstaNews stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-violet-500" />}
            title="Instant AI Summaries"
            description="Powered by Google Gemini AI, get 3-bullet core takeaways of complex articles without the fluff."
          />
          <FeatureCard
            icon={<Globe2 className="w-6 h-6 text-amber-500" />}
            title="Global Multi-Source Feeds"
            description="Real-time multi-category news aggregation across Technology, Business, Sports, Entertainment, and more."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
            title="Secure & Personalized"
            description="Seamless authentication via Clerk with Google OAuth, synchronizing your topics and bookmarks securely."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-fuchsia-500" />}
            title="Ultra-Fast Redis Caching"
            description="Upstash Redis caching ensures sub-millisecond responses and instant headline retrieval."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-blue-500" />}
            title="OLED Glassmorphic Design"
            description="Custom-tailored dark and light themes engineered for optimal visual comfort and readability."
          />
          <FeatureCard
            icon={<HeartHandshake className="w-6 h-6 text-rose-500" />}
            title="Journalism First"
            description="We respect original publishers, always providing clear attribution and direct links to original sources."
          />
        </div>
      </div>

      {/* Story & Commitment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-3xl glass-panel border border-violet-500/20 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Our Vision
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
            In an era of relentless clickbait and infinite feeds, finding high-signal news is harder than ever. InstaNews was crafted to solve this problem by pairing state-of-the-art AI summarization with a distraction-free, fluid interface.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            Whether you want a 30-second morning briefing on global finance or in-depth sports scores, InstaNews adapts to your reading habits effortlessly.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-violet-500/20 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-sm sm:text-base">
            Have feedback, feature requests, or partnership inquiries? We are always eager to hear from our community.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-violet-500" />
              <span>support@instanews.app</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Globe2 className="w-4 h-4 text-amber-500" />
              <span>Available globally in real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-2xl glass-panel border border-violet-500/10 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 group">
    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-fit mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default AboutPage;
