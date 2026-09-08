import React, { useEffect } from "react";
import { FileText, CheckCircle2, AlertCircle, Scale, Sparkles, ShieldCheck, Mail } from "lucide-react";

const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-200 dark:border-violet-700/50">
          <FileText className="w-4 h-4 text-violet-500" />
          Legal & Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Last updated: September 7, 2026 • Please read these terms carefully before using InstaNews
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-violet-500/20 mb-12 shadow-xl bg-violet-50/40 dark:bg-violet-950/10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-violet-500" />
          Agreement Overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          By accessing or using InstaNews ("we", "our", or "the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue using the service.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8">
        <TermsSection
          icon={<Scale className="w-5 h-5 text-violet-500" />}
          title="1. News Aggregation & Content Attribution"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            InstaNews aggregates headlines, snippets, and publicly accessible feeds from accredited news publishers worldwide.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>All news articles, trademarks, logos, and original media remain the exclusive intellectual property of their respective publishers.</li>
            <li>InstaNews provides clear attribution and direct links back to original source publications for full reading.</li>
            <li>We do not alter the factual content of original publisher articles.</li>
          </ul>
        </TermsSection>

        <TermsSection
          icon={<Sparkles className="w-5 h-5 text-amber-500" />}
          title="2. AI-Generated Summaries Disclaimer"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our platform provides automated, AI-driven summarization powered by Google Gemini AI to assist with rapid news comprehension.
          </p>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              AI summaries are generated algorithmically for informational purposes only. While we strive for accuracy, AI models may occasionally generate approximations. Readers are encouraged to read the full original article for critical decisions.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          title="3. User Accounts & Responsibilities"
        >
          <p className="mb-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            When you create an account via Clerk or Google OAuth:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>You agree to provide accurate and truthful account information.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials and all activities occurring under your account.</li>
            <li>You agree not to attempt to reverse engineer, scrape at scale, flood, or bypass rate limits on the platform.</li>
          </ul>
        </TermsSection>

        <TermsSection
          icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
          title="4. Limitation of Liability"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            InstaNews is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In no event shall InstaNews, its developers, or partners be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or reliance on any news aggregated from third parties.
          </p>
        </TermsSection>

        <TermsSection
          icon={<Mail className="w-5 h-5 text-blue-500" />}
          title="5. Inquiries & Legal Notices"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            For questions regarding these Terms & Conditions or copyright-related inquiries, please email{" "}
            <a href="mailto:legal@instanews.app" className="text-violet-500 hover:underline font-semibold">
              legal@instanews.app
            </a>.
          </p>
        </TermsSection>
      </div>
    </div>
  );
};

const TermsSection = ({
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

export default TermsPage;
