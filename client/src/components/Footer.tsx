import React from "react";
import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A0510] backdrop-blur-xl">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative p-2 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600">
                InstaNews
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Experience the future of news consumption. AI-summarized,
              beautifully presented, and intelligently curated just for you.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Github className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              <FooterLink text="Top Stories" />
              <FooterLink text="Technology" />
              <FooterLink text="Business" />
              <FooterLink text="Entertainment" />
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Terms of Service" />
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">
              Stay Updated
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Get the most important stories delivered straight to your inbox.
            </p>
            <form
              className="relative group"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors shadow-md shadow-violet-500/20 active:scale-95"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} InstaNews. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors group"
          >
            Back to top
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-[#2A1D40] transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({
  icon,
  href,
}: {
  icon: React.ReactNode;
  href: string;
}) => (
  <a
    href={href}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-linear-to-br hover:from-violet-600 hover:to-fuchsia-600 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm hover:shadow-lg hover:shadow-violet-500/25"
  >
    {icon}
  </a>
);

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a
      href="#"
      className="group flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors"
    >
      <span className="w-0 overflow-hidden opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300 ease-out">
        <ArrowUpRight className="w-3 h-3 text-violet-500 dark:text-fuchsia-400" />
      </span>
      <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out">
        {text}
      </span>
    </a>
  </li>
);

export default Footer;
