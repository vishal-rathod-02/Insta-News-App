import React, { useEffect, useState, useRef } from "react";
import type { SummarizeModalProps } from "../utils/types";
import {
  XIcon,
  CopyIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
  ShareIcon,
  SparklesIcon
} from "./shared/Icons";
import { fetchArticleSummary } from "../services/summaryService";
import { motion, AnimatePresence } from "framer-motion";

const SummarizeModal: React.FC<SummarizeModalProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [mode, setMode] = useState<"bullet" | "simple">("bullet");
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch Summary
  useEffect(() => {
    const getSummary = async () => {
      setIsLoading(true);
      setError(null);
      setSummary("");
      setDisplayedSummary("");

      try {
        const content = article.content || article.contentSnippet || "";

        const result = await fetchArticleSummary(article.title, content, {
          mode,
          language
        });

        setSummary(result);
      } catch {
        setError("Unable to generate summary at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    // Stop speech when regenerating
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    getSummary();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [article, mode, language]);

  // Typing Effect for AI feel
  useEffect(() => {
    if (!isLoading && summary && !error) {
      let i = 0;
      setDisplayedSummary("");
      const intervalId = setInterval(() => {
        setDisplayedSummary(summary.slice(0, i));
        i++;
        if (i > summary.length) {
          clearInterval(intervalId);
        }
      }, 10); // Typing speed
      return () => clearInterval(intervalId);
    }
  }, [summary, isLoading, error]);


  // Copy
  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share
  const handleShare = async () => {
    if (!summary) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Summary: ${article.title}`,
          text: summary,
          url: article.link,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      handleCopy();
    }
  };

  // Text-to-Speech
  const toggleSpeech = () => {
    if (!summary.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };


  const renderSummaryHTML = (text: string) => {

    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return html;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#02010A]/60 backdrop-blur-md p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-2xl max-h-[85vh] flex flex-col bg-white/90 dark:bg-[#0A0614]/90 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-violet-200/50 dark:border-violet-800/30 overflow-hidden relative"
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-75" />

          {/* HEADER */}
          <header className="flex flex-col gap-4 px-6 py-5 border-b border-violet-100/50 dark:border-white/5 shrink-0 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 border border-violet-200/50 dark:border-violet-700/50 shadow-inner">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 blur-md"
                  />
                  <SparklesIcon className="w-5 h-5 text-violet-600 dark:text-fuchsia-400 relative z-10" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    AI Summary
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Powered by Gemini</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <div className="relative group">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="appearance-none text-sm px-4 py-1.5 pr-8 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                >
                  <option value="bullet">Bullet Points</option>
                  <option value="simple">Simple Explanation</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>

              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="appearance-none text-sm px-4 py-1.5 pr-8 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white leading-tight">
              {article.title}
            </h3>

            {isLoading && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                  />
                  <span className="text-sm font-medium animate-pulse ml-2">Generating insights...</span>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-slate-200/50 dark:bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                    />
                  </div>
                  <div className="h-4 bg-slate-200/50 dark:bg-white/5 rounded-full overflow-hidden relative w-5/6">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                    />
                  </div>
                  <div className="h-4 bg-slate-200/50 dark:bg-white/5 rounded-full overflow-hidden relative w-4/6">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]"
              >
                <div
                  className="whitespace-pre-line prose dark:prose-invert max-w-none prose-p:my-2 prose-li:my-1 prose-ul:my-2"
                  dangerouslySetInnerHTML={{ __html: renderSummaryHTML(displayedSummary) }}
                />

                {/* Blinking cursor */}
                {displayedSummary.length < summary.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-violet-500 ml-1 translate-y-1"
                  />
                )}
              </motion.div>
            )}
          </div>

          {/* FOOTER */}
          <footer className="p-4 sm:p-5 border-t border-violet-100/50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-2">
              <button
                onClick={toggleSpeech}
                disabled={isLoading || !!error}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#120C1F] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                aria-label={isSpeaking ? "Pause Audio" : "Play Audio"}
              >
                {isSpeaking ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {isSpeaking ? "Pause" : "Listen"}
                </span>
              </button>

              <button
                onClick={handleCopy}
                disabled={isLoading || !!error}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#120C1F] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                aria-label="Copy Summary"
              >
                {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>

            <button
              onClick={handleShare}
              disabled={isLoading || !!error}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              <ShareIcon className="w-4 h-4" />
              <span>Share</span>
            </button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SummarizeModal;
