import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle2, Flame, Users, Sparkles } from "lucide-react";
import { getApiUrl } from "../utils/apiConfig";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  category: string;
  totalVotes: number;
  options: PollOption[];
}

const DailyPollCard: React.FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPoll = async () => {
      try {
        const res = await fetch(getApiUrl("/api/polls/today"));
        if (!res.ok) throw new Error("Failed to load poll");
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setPoll(data.data);
          const savedVote = localStorage.getItem(`poll_voted_${data.data.id}`);
          if (savedVote) {
            setSelectedOption(savedVote);
            setHasVoted(true);
          }
        }
      } catch {
        // Fallback default poll
        if (isMounted) {
          const fallback: Poll = {
            id: "poll-tech-default",
            question: "Will Generative AI agents become the primary way people consume news by 2027?",
            category: "Technology & AI",
            totalVotes: 1420,
            options: [
              { id: "opt-1", text: "Yes, personalized AI briefs are the future", votes: 894 },
              { id: "opt-2", text: "No, traditional human journalism will stay preferred", votes: 382 },
              { id: "opt-3", text: "Hybrid model (human verified + AI curated)", votes: 144 },
            ],
          };
          setPoll(fallback);
          const savedVote = localStorage.getItem(`poll_voted_${fallback.id}`);
          if (savedVote) {
            setSelectedOption(savedVote);
            setHasVoted(true);
          }
        }
      }
    };

    fetchPoll();
  }, []);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting || !poll) return;

    setIsSubmitting(true);
    setSelectedOption(optionId);
    setHasVoted(true);
    localStorage.setItem(`poll_voted_${poll.id}`, optionId);

    try {
      const res = await fetch(getApiUrl("/api/polls/vote"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPoll(data.data);
      } else {
        // Optimistic local increment
        setPoll((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            totalVotes: prev.totalVotes + 1,
            options: prev.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        });
      }
    } catch {
      // Local optimistic update
      setPoll((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          totalVotes: prev.totalVotes + 1,
          options: prev.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll) return null;

  return (
    <div className="rounded-3xl p-5 bg-white/95 dark:bg-[#0C0618]/90 border border-slate-200/80 dark:border-violet-500/25 shadow-xl text-slate-800 dark:text-slate-100 relative overflow-hidden backdrop-blur-xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-fuchsia-600/10 dark:bg-fuchsia-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-violet-100 dark:bg-violet-600/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30">
            <Vote className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
            Community Pulse
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          {poll.category}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug">
        {poll.question}
      </h3>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {poll.options.map((option) => {
          const percentage =
            poll.totalVotes > 0
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0;
          const isUserChoice = selectedOption === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden group ${
                isUserChoice
                  ? "border-violet-500 dark:border-violet-400/60 bg-violet-50 dark:bg-violet-950/40 shadow-md shadow-violet-500/10 dark:shadow-violet-500/20"
                  : hasVoted
                  ? "border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-[#120824]/60"
                  : "border-slate-200 dark:border-violet-500/20 bg-slate-50/80 dark:bg-[#120824]/80 hover:border-violet-400 dark:hover:border-violet-400/50 hover:bg-violet-50/70 dark:hover:bg-violet-900/20 cursor-pointer active:scale-[0.99]"
              }`}
            >
              {/* Progress Bar Animation if Voted */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 ${
                    isUserChoice
                      ? "bg-linear-to-r from-violet-500/25 via-fuchsia-500/25 to-violet-500/25 dark:from-violet-600/30 dark:via-fuchsia-600/30 dark:to-violet-600/30"
                      : "bg-slate-200/60 dark:bg-slate-800/40"
                  }`}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {isUserChoice && (
                    <CheckCircle2 className="w-4 h-4 text-violet-600 dark:text-fuchsia-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isUserChoice
                        ? "text-violet-900 dark:text-white font-bold"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {option.text}
                  </span>
                </div>

                {hasVoted && (
                  <span className="text-xs font-mono font-black text-violet-700 dark:text-violet-300 shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-violet-500/15">
        <div className="flex items-center gap-1.5 font-medium">
          <Users className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span>{poll.totalVotes.toLocaleString()} votes</span>
        </div>
        {hasVoted ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Vote Recorded
          </span>
        ) : (
          <span className="text-violet-600 dark:text-violet-400 font-semibold">Click to cast vote</span>
        )}
      </div>
    </div>
  );
};

export default DailyPollCard;
