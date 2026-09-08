import React, { useEffect } from "react";
import { ShieldCheck, Lock, Eye, Database, Server, KeyRound, Mail } from "lucide-react";

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-700/50">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Transparency & Security
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Last updated: September 7, 2026 • Effective immediately
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-violet-500/20 mb-12 shadow-xl bg-violet-50/40 dark:bg-violet-950/10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-violet-500" />
          Our Privacy Pledge
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          At InstaNews, we respect your privacy. We never sell your personal data, track you across unrelated websites, or store your passwords. Authentication is powered securely by Clerk, and your preferences are used solely to deliver personalized news feeds and AI-powered insights.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8">
        <PolicySection
          icon={<Eye className="w-5 h-5 text-violet-500" />}
          title="1. Information We Collect"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We collect minimal information necessary to provide you with a tailored news reading experience:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>
              <strong>Account Information:</strong> When you register or sign in using Google OAuth or Email through Clerk, we receive your name, email address, and avatar image. Passwords are handled directly and securely by Clerk and are never accessible to our servers.
            </li>
            <li>
              <strong>Preferences & Bookmarks:</strong> Categories you select in "My News", bookmarked articles, and your recent reading history.
            </li>
            <li>
              <strong>Usage Data:</strong> Technical logs such as search queries, IP addresses (used strictly for rate limiting and fraud prevention), and browser user-agent info.
            </li>
          </ul>
        </PolicySection>

        <PolicySection
          icon={<Database className="w-5 h-5 text-amber-500" />}
          title="2. How We Use Your Information"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your data is used solely to power the core functionality of InstaNews:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>Personalizing your news feed in "My News" based on your selected topics.</li>
            <li>Generating AI summaries on demand via Google Gemini AI when requested.</li>
            <li>Synchronizing your saved bookmarks across all your devices.</li>
            <li>Monitoring application health and preventing abuse via rate limiting.</li>
          </ul>
        </PolicySection>

        <PolicySection
          icon={<Server className="w-5 h-5 text-fuchsia-500" />}
          title="3. Third-Party Integrations"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We partner with trusted industry providers for infrastructure and security:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>
              <strong>Clerk:</strong> Handles user authentication, session tokens, and Google OAuth compliance.
            </li>
            <li>
              <strong>Google Gemini AI:</strong> Processes article text for instant 3-bullet summaries. No personal user data is sent with summary requests.
            </li>
            <li>
              <strong>MongoDB & Upstash Redis:</strong> Secure database and caching services for instant article loading and saved preferences.
            </li>
          </ul>
        </PolicySection>

        <PolicySection
          icon={<KeyRound className="w-5 h-5 text-emerald-500" />}
          title="4. Data Security & Your Rights"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            All network communication between your browser and our backend is encrypted using industry-standard TLS/SSL encryption.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            You have full control over your data. You can update your preferences, clear your reading history, or delete your account at any time through the Manage Account modal powered by Clerk.
          </p>
        </PolicySection>

        <PolicySection
          icon={<Mail className="w-5 h-5 text-blue-500" />}
          title="5. Contact Us"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            If you have questions or concerns regarding this Privacy Policy, please contact our privacy team at{" "}
            <a href="mailto:privacy@instanews.app" className="text-violet-500 hover:underline font-semibold">
              privacy@instanews.app
            </a>.
          </p>
        </PolicySection>
      </div>
    </div>
  );
};

const PolicySection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-violet-500/10 hover:border-violet-500/25 transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
    </div>
    <div className="text-slate-600 dark:text-slate-300">
      {children}
    </div>
  </div>
);

export default PrivacyPage;
