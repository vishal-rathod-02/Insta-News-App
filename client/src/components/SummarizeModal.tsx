import React from "react";
import type { SummarizeModalProps } from "../utils/types";
import { XIcon, SparklesIcon } from "./shared/Icons";
import { motion, AnimatePresence } from "framer-motion";

const SummarizeModal: React.FC<SummarizeModalProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-oled-black/60 backdrop-blur-md p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-xl flex flex-col bg-white/90 dark:bg-[#0A0614]/90 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-violet-200/50 dark:border-violet-800/30 overflow-hidden relative"
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-75" />

          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-violet-100/50 dark:border-white/5 shrink-0 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 border border-violet-200/50 dark:border-violet-700/50 shadow-inner">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-400/20 to-fuchsia-400/20 blur-md"
                />
                <SparklesIcon className="w-5 h-5 text-violet-600 dark:text-fuchsia-400 relative z-10" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                  AI Summary
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Upgrading Engine</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <XIcon />
            </button>
          </header>

          {/* CONTENT */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 mb-6 rounded-full bg-linear-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center shadow-inner border border-violet-200/50 dark:border-violet-700/30 relative"
            >
              <SparklesIcon className="w-10 h-10 text-violet-500 dark:text-fuchsia-400 relative z-10" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-violet-400/20 dark:bg-fuchsia-400/20 rounded-full blur-xl"
              />
            </motion.div>

            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">
              We're building something smarter!
            </h3>

            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed text-[15px]">
              The Summarize feature is currently taking a short break while we develop our own highly-advanced, custom AI agent specifically tailored for this app.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
              <p className="text-violet-600 dark:text-fuchsia-300 text-sm font-medium">
                We're dropping the limitations to bring you instant, flawless insights. This feature will be back and better than ever very soon! 🚀
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-8 px-8 py-3 w-full sm:w-auto rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium shadow-md shadow-violet-500/20 transition-all active:scale-95"
            >
              Got it, thanks!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SummarizeModal;
