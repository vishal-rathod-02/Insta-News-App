import React, { useState, useMemo } from "react";
import { useUser } from "../context/UserContext";
import NewsCard from "../components/NewsCard";
import SummarizeModal from "../components/SummarizeModal";
import type { NewsArticle } from "../utils/types";
import { Bookmark, Search, Share2, Check, Sparkles, Filter, Trash2, Tag } from "lucide-react";

/**
 * Intelligent category detection for articles that might not have an explicit category tag
 */
export const detectArticleCategory = (article: NewsArticle): string => {
  if (article.category) {
    const raw = article.category.toLowerCase().trim();
    if (raw === "sports" || raw === "sport") return "Sports";
    if (raw === "technology" || raw === "tech") return "Technology";
    if (raw === "business" || raw === "markets") return "Business";
    if (raw === "entertainment") return "Entertainment";
    if (raw === "health") return "Health";
    if (raw === "science" || raw === "space") return "Science";
    if (raw === "world" || raw === "politics" || raw === "global") return "World";
  }

  const text = `${article.title || ""} ${article.contentSnippet || ""} ${article.content || ""} ${article.source || ""} ${article.link || ""}`.toLowerCase();

  // Sports Check
  if (
    /\b(cricket|ipl|bcci|football|soccer|tennis|atp|wta|badminton|olympic|score|match|wicket|goal|tournament|fifa|nba|f1|formula 1|champions league|cricinfo|espn|batting|bowling|grand slam|wimbledon|la liga|serie a|bundesliga|world cup|hockey|kabaddi|boxing|wrestling|test match|t20|odi|super cup|trophy|championship|rohit|kohli|dhoni|messi|ronaldo|nadal|djokovic|alcaraz)\b/.test(
      text
    )
  ) {
    return "Sports";
  }

  // Technology Check
  if (
    /\b(ai|artificial intelligence|tech|technology|apple|google|microsoft|nvidia|openai|chip|chips|software|app|smartphone|iphone|android|robot|robotics|meta|cyber|cybersecurity|gadget|semiconductor|chatgpt|llm|quantum|algorithm|vr|ar|crypto|bitcoin|ethereum|hardware|developer|cloud computing|spacex)\b/.test(
      text
    )
  ) {
    return "Technology";
  }

  // Business & Finance Check
  if (
    /\b(market|markets|stock|stocks|sensex|nifty|economy|economic|gdp|inflation|rbi|federal reserve|fed|bank|banking|shares|rupee|dollar|trade|investment|investor|profit|revenue|startup|startups|finance|financial|wall street|bse|nse|equity|mutual fund|treasury|ipo|valuation|fintech)\b/.test(
      text
    )
  ) {
    return "Business";
  }

  // Entertainment Check
  if (
    /\b(movie|movies|cinema|film|films|box office|actor|actress|hollywood|bollywood|netflix|trailer|music|song|songs|grammy|oscar|celebrity|ott|series|director|album|pop|singer|concert|theatre|drama|showbiz)\b/.test(
      text
    )
  ) {
    return "Entertainment";
  }

  // Health Check
  if (
    /\b(health|doctor|hospital|medicine|medical|vaccine|virus|cancer|disease|fitness|diet|mental health|who|pharma|wellness|covid|nutrition|surgery|healthcare|therapy|symptom)\b/.test(
      text
    )
  ) {
    return "Health";
  }

  // Science Check
  if (
    /\b(science|scientific|nasa|space|isro|planet|astronomy|galaxy|physics|climate|earth|moon|mars|telescope|spacecraft|solar|asteroid|rocket|cosmic|biology|genetics)\b/.test(
      text
    )
  ) {
    return "Science";
  }

  // World & Politics Check
  if (
    /\b(world|global|un|united nations|nato|biden|trump|putin|modi|china|russia|ukraine|israel|gaza|europe|asia|diplomacy|treaty|embassy|war|foreign|election|elections|parliament|minister|congress|bjp|senate|summit|geopolitics|treaty)\b/.test(
      text
    )
  ) {
    return "World";
  }

  return "General";
};

const SavedPage: React.FC = () => {
  const { savedArticles, removeSavedArticle, exportSavedArticles } = useUser();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Map each saved article with its detected category
  const articlesWithCategories = useMemo(() => {
    return savedArticles.map((article) => ({
      ...article,
      detectedCategory: detectArticleCategory(article),
    }));
  }, [savedArticles]);

  // Available categories with article counts
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = { All: savedArticles.length };
    articlesWithCategories.forEach((a) => {
      counts[a.detectedCategory] = (counts[a.detectedCategory] || 0) + 1;
    });

    const categoryOrder = [
      "All",
      "Sports",
      "Technology",
      "Business",
      "Entertainment",
      "Health",
      "Science",
      "World",
      "General",
    ];

    return categoryOrder.filter((cat) => counts[cat] && counts[cat] > 0);
  }, [savedArticles.length, articlesWithCategories]);

  // Filtered articles based on search & category
  const filteredArticles = useMemo(() => {
    return articlesWithCategories.filter((article) => {
      const matchesSearch =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.contentSnippet &&
          article.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" ||
        article.detectedCategory.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [articlesWithCategories, searchQuery, selectedCategory]);

  // Total read time estimation
  const totalReadTimeMinutes = useMemo(() => {
    return savedArticles.reduce((acc, curr) => {
      const words = (curr.content || curr.contentSnippet || curr.title).split(/\s+/).length;
      return acc + Math.max(1, Math.ceil(words / 180));
    }, 0);
  }, [savedArticles]);

  const handleShareReadingList = async () => {
    const digestText = exportSavedArticles("markdown");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My InstaNews Reading Digest",
          text: `📰 My InstaNews Reading Digest (${savedArticles.length} stories):\n\n${savedArticles
            .slice(0, 5)
            .map((a, i) => `${i + 1}. ${a.title}`)
            .join("\n")}\n\nRead more on InstaNews!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Dismissed share
      }
    }

    // Fallback: Copy clean digest to clipboard
    await navigator.clipboard.writeText(digestText);
    setCopiedFormat("shared");
    setTimeout(() => setCopiedFormat(null), 2200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-violet-500/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-linear-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl shadow-lg shadow-violet-500/30">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Saved Articles Archive
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                {savedArticles.length} Stories
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your personal reading library • ~{totalReadTimeMinutes} mins reading queue
            </p>
          </div>
        </div>

        {/* Share Reading List Action */}
        {savedArticles.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareReadingList}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              title="Share your reading list"
            >
              {copiedFormat === "shared" ? (
                <Check className="w-4 h-4 text-emerald-300" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span>{copiedFormat === "shared" ? "Digest Copied to Clipboard!" : "Share Reading List"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      {savedArticles.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Category Filter Pills with Live Item Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full md:w-auto pb-1">
            <Filter className="w-4 h-4 text-violet-400 shrink-0 ml-1 mr-1" />
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              const count =
                cat === "All"
                  ? savedArticles.length
                  : articlesWithCategories.filter(
                      (a) => a.detectedCategory.toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-oled-surface/70 hover:bg-slate-200 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-violet-500/10 text-violet-400 dark:text-violet-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved stories..."
              className="w-full bg-white dark:bg-oled-surface border border-violet-500/25 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Grid */}
      {savedArticles.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-oled-surface/40 backdrop-blur-xl border border-violet-500/20 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/10 dark:bg-violet-600/20 text-violet-500 flex items-center justify-center mx-auto mb-4 border border-violet-500/30 shadow-inner">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            No saved articles yet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Click the bookmark icon on any news headline or story card to build your personal reading list.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-xs font-bold shadow-lg shadow-violet-500/30 hover:opacity-90 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Explore Top News
          </a>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white/40 dark:bg-oled-surface/30 rounded-3xl border border-violet-500/15 p-6">
          <p className="text-sm font-semibold text-slate-400">
            No articles match "{selectedCategory}" or your current search.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 text-xs text-violet-500 font-bold underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="relative group/card flex flex-col">
              {/* Category Pill Tag */}
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#0C0618]/90 text-violet-300 border border-violet-500/30 backdrop-blur-md shadow-sm flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-fuchsia-400" />
                  {article.detectedCategory}
                </span>
              </div>

              <NewsCard
                article={article}
                onSummarize={setSelectedArticle}
              />
              <button
                onClick={() => removeSavedArticle(article.id)}
                className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/75 text-slate-300 hover:text-rose-400 hover:bg-black/95 backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-opacity border border-white/10 cursor-pointer shadow-md"
                title="Remove from saved"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AI Summary Modal */}
      {selectedArticle && (
        <SummarizeModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default SavedPage;
