import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { SummarizeModalProps } from "../utils/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  Languages,
  Flame,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  X,
  Pause,
  Play,
} from "lucide-react";
import {
  fetchArticleSummary,
  askArticleQuestion,
  type SummaryMode,
  type SummaryLanguage,
} from "../services/summaryService";
import ShareSocialModal from "./ShareSocialModal";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const LANGUAGES: {
  id: SummaryLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  voiceLang: string;
  badge: string;
}[] = [
  {
    id: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    voiceLang: "en-US",
    badge: "EN",
  },
  {
    id: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    flag: "🇮🇳",
    voiceLang: "hi-IN",
    badge: "HI",
  },
];

const MODES: { id: SummaryMode; label: string; icon: string }[] = [
  { id: "bullet", label: "5 Key Bullets", icon: "📌" },
  { id: "simple", label: "3-Sentence Digest", icon: "📝" },
  { id: "executive", label: "Executive Brief", icon: "👔" },
];

const PROMPT_SUGGESTIONS = [
  "Explain this like I'm 5",
  "Why is this story significant?",
  "What are the financial or market implications?",
  "What is the historical background?",
];

const SummarizeModal: React.FC<SummarizeModalProps> = ({ article, onClose }) => {
  const [activeTab, setActiveTab] = useState<"summary" | "ask">("summary");
  const [mode, setMode] = useState<SummaryMode>("bullet");
  const [language, setLanguage] = useState<SummaryLanguage>("en");
  const [showShareCard, setShowShareCard] = useState<boolean>(false);

  // Summary state
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Audio / Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Ask AI state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Micro-Reactions
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    fire: 14,
    insight: 28,
    market: 9,
    breaking: 19,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const articleContent = article.content || article.contentSnippet || article.title;

  // Fetch summary on mode / language change
  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      setLoading(true);
      stopAudio();
      try {
        const res = await fetchArticleSummary(article.title, articleContent, {
          mode,
          language,
        });
        if (isMounted) {
          setSummary(res.text);
          setIsCached(res.cached);
        }
      } catch (err: any) {
        if (isMounted) {
          setSummary("Failed to generate AI summary. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
      stopAudio();
    };
  }, [article.title, articleContent, mode, language]);

  // Clean up SpeechSynthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === "ask") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  // --- Speech Synthesis Handlers ---
  const playAudio = () => {
    if (!summary || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();

    // Remove markdown bullet stars for smoother narration
    const cleanText = summary.replace(/\*/g, "").replace(/#/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const currentLangObj = LANGUAGES.find((l) => l.id === language);
    utterance.lang = currentLangObj ? currentLangObj.voiceLang : "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
  };

  const pauseAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    }
  };

  // --- Copy & Share Handlers ---
  const handleCopy = async () => {
    if (!summary) return;
    const textToCopy = `📌 ${article.title}\n\nAI Summary (via InstaNews):\n${summary}\n\nRead original: ${article.link}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShowShareCard(true);
  };

  // --- Ask AI Handler ---
  const handleAsk = async (questionToAsk?: string) => {
    const q = (questionToAsk || inputQuestion).trim();
    if (!q || isAsking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: q,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionToAsk) setInputQuestion("");
    setIsAsking(true);

    try {
      const answer = await askArticleQuestion(article.title, articleContent, q);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: answer,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Sorry, I couldn't process your question right now. Please try again.",
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // --- Reaction Toggle ---
  const handleReaction = (type: string) => {
    setReactions((prev) => {
      const isSelected = userReaction === type;
      setUserReaction(isSelected ? null : type);
      return {
        ...prev,
        [type]: isSelected ? prev[type] - 1 : prev[type] + 1,
      };
    });
  };

  // Split bullet points for high-end formatting
  const bulletLines = summary
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-md p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0A0512] text-slate-800 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 dark:border-violet-500/25 overflow-hidden relative"
        >
          {/* Top Neon Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-500" />
          <div className="hidden dark:block absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-32 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <header className="px-6 py-4 border-b border-slate-200/80 dark:border-violet-500/15 flex items-center justify-between shrink-0 relative z-10 bg-slate-50/95 dark:bg-[#0E061B]/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                    Gemini AI
                  </span>
                  {isCached && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                      ⚡ Instant Cache
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-sm sm:max-w-md" title={article.title}>
                  {article.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* TAB SWITCHER */}
          <div className="px-6 pt-3 pb-2 border-b border-slate-200/80 dark:border-violet-500/10 flex items-center gap-2 bg-slate-100/70 dark:bg-[#0E061B]/60 shrink-0">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "summary"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Summary & Audio
            </button>
            <button
              onClick={() => setActiveTab("ask")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "ask"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5"
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI Q&A
              {chatMessages.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-fuchsia-500 text-white font-bold">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>

          {/* BODY CONTENT */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {activeTab === "summary" ? (
              <>
                {/* TOOLBAR: MODES & LANGUAGES */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100/80 dark:bg-[#140B22]/80 border border-slate-200 dark:border-violet-500/20">
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${mode === m.id
                          ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 scale-[1.02]"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-white/5"
                          }`}
                      >
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#170C2A]/90 border border-slate-300/60 dark:border-violet-500/25 shadow-inner">
                    <div className="flex items-center gap-1 pl-2 pr-1 text-violet-600 dark:text-violet-400 text-[11px] font-semibold">
                      <Languages className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Language</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {LANGUAGES.map((l) => {
                        const isSelected = language === l.id;
                        return (
                          <button
                            key={l.id}
                            onClick={() => setLanguage(l.id)}
                            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-linear-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white shadow-lg shadow-violet-500/30 border border-violet-400/40 scale-[1.02]"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/5 border border-transparent"
                            }`}
                            title={`${l.label} (${l.nativeLabel})`}
                          >
                            <span className="text-sm leading-none">{l.flag}</span>
                            <span className="font-semibold">{l.nativeLabel}</span>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-black tracking-wider ${
                                isSelected
                                  ? "bg-black/30 text-violet-200 border border-white/20"
                                  : "bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {l.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AUDIO NARRATOR BAR */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-violet-50/90 dark:bg-linear-to-r dark:from-violet-950/40 dark:via-[#160B24] dark:to-fuchsia-950/30 border border-violet-200 dark:border-violet-500/25">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Audio Narrator
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isPlayingAudio
                          ? `Narrating summary in ${language === "hi" ? "Hindi (हिन्दी)" : "English"}...`
                          : isAudioPaused
                            ? "Audio paused"
                            : `Listen to instant voice briefing (${language === "hi" ? "हिन्दी" : "English"})`}
                      </p>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-2">
                    {/* Animated Sound Wave Indicator */}
                    {isPlayingAudio && (
                      <div className="flex items-center gap-0.5 mr-2">
                        <span className="w-1 h-3 bg-violet-500 dark:bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1 h-5 bg-fuchsia-500 dark:bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1 h-2 bg-violet-500 dark:bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        <span className="w-1 h-4 bg-amber-500 dark:bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "450ms" }} />
                      </div>
                    )}

                    {!isPlayingAudio && !isAudioPaused ? (
                      <button
                        onClick={playAudio}
                        disabled={loading || !summary}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Play Audio
                      </button>
                    ) : (
                      <>
                        {isPlayingAudio ? (
                          <button
                            onClick={pauseAudio}
                            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Pause"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={playAudio}
                            className="p-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors cursor-pointer"
                            title="Resume"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </button>
                        )}
                        <button
                          onClick={stopAudio}
                          className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                          title="Stop"
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* SUMMARY CONTENT BOX */}
                <div className="relative min-h-40 p-6 rounded-3xl bg-slate-50 dark:bg-[#110A1C]/90 border border-slate-200 dark:border-violet-500/20 shadow-inner">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Loader2 className="w-8 h-8 text-violet-600 dark:text-violet-500 animate-spin" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                        Analyzing news & synthesizing insights with Gemini AI...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                      {mode === "bullet" ? (
                        <ul className="space-y-3">
                          {bulletLines.map((line, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              className="flex items-start gap-3"
                            >
                              <div className="w-2 h-2 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 mt-2 shrink-0 shadow-sm shadow-violet-500/50" />
                              <span className="font-normal text-slate-800 dark:text-slate-200">
                                {line.replace(/^(\*|-|\d+\.)\s*/, "")}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                          {summary}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* MICRO REACTIONS BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reader Reactions:
                  </span>
                  <div className="flex items-center gap-2">
                    <ReactionButton
                      icon={<Flame className="w-3.5 h-3.5 text-rose-500" />}
                      label="Mindblown"
                      count={reactions.fire}
                      active={userReaction === "fire"}
                      onClick={() => handleReaction("fire")}
                    />
                    <ReactionButton
                      icon={<Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />}
                      label="Insightful"
                      count={reactions.insight}
                      active={userReaction === "insight"}
                      onClick={() => handleReaction("insight")}
                    />
                    <ReactionButton
                      icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      label="Market"
                      count={reactions.market}
                      active={userReaction === "market"}
                      onClick={() => handleReaction("market")}
                    />
                    <ReactionButton
                      icon={<AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                      label="Breaking"
                      count={reactions.breaking}
                      active={userReaction === "breaking"}
                      onClick={() => handleReaction("breaking")}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* TAB 2: ASK AI CONVERSATIONAL DRAWER */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-500/20 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Ask Anything About This Article
                  </span>
                  Gemini AI has read this article and is ready to clarify facts, provide background, or analyze implications.
                </div>

                {/* Suggested Questions */}
                {chatMessages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Popular Questions:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PROMPT_SUGGESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAsk(q)}
                          disabled={isAsking}
                          className="p-2.5 text-left rounded-xl bg-slate-100 dark:bg-[#140B22] hover:bg-violet-50 dark:hover:bg-violet-600/20 border border-slate-200 dark:border-violet-500/20 text-xs text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          "{q}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="space-y-3 min-h-35 max-h-75 overflow-y-auto custom-scrollbar p-2">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${msg.sender === "user"
                          ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-none shadow-md shadow-violet-500/20"
                          : "bg-slate-100 dark:bg-[#180E29] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-violet-500/20 rounded-bl-none shadow-xs"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isAsking && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600 dark:text-violet-500" />
                      Gemini AI is thinking...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAsk();
                  }}
                  className="relative flex items-center mt-2"
                >
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    placeholder="Ask a question about this story..."
                    disabled={isAsking}
                    className="w-full bg-slate-100 dark:bg-[#140B22] border border-slate-300 dark:border-violet-500/30 text-xs text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuestion.trim() || isAsking}
                    className="absolute right-2 p-2 rounded-xl bg-violet-600 text-white disabled:opacity-40 hover:bg-violet-500 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <footer className="px-6 py-4 border-t border-slate-200/80 dark:border-violet-500/15 flex items-center justify-between gap-3 bg-slate-50/95 dark:bg-[#0E061B]/90 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!summary || loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 cursor-pointer border border-slate-200/60 dark:border-white/5"
                title="Copy Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={handleShare}
                disabled={!summary || loading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 cursor-pointer border border-slate-200/60 dark:border-white/5"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-violet-500/25 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
            >
              <span>Read Full Story</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </footer>
        </motion.div>
      </motion.div>

      {/* INSTAGRAM / FACEBOOK SOCIAL SHARE STORY MODAL */}
      {showShareCard && (
        <ShareSocialModal
          article={article}
          summaryText={summary}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
};

const ReactionButton = ({
  icon,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${active
      ? "bg-violet-100 dark:bg-violet-600/30 border-violet-400 dark:border-violet-500 text-violet-900 dark:text-white shadow-xs scale-105"
      : "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-violet-300 dark:hover:border-violet-500/30"
      }`}
  >
    {icon}
    <span>{count}</span>
  </button>
);

export default SummarizeModal;

