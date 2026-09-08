import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { NewsArticle } from '../utils/types';

interface UserContextType {
  savedArticles: NewsArticle[];
  readingHistory: NewsArticle[];
  saveArticle: (article: NewsArticle) => void;
  removeSavedArticle: (articleId: string) => void;
  addToHistory: (article: NewsArticle) => void;
  clearHistory: () => void;
  isSaved: (articleId: string) => boolean;
  exportSavedArticles: (format: 'markdown' | 'json' | 'text') => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [readingHistory, setReadingHistory] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const storedSaved = localStorage.getItem('savedArticles');
    const storedHistory = localStorage.getItem('readingHistory');

    if (storedSaved) setSavedArticles(JSON.parse(storedSaved));
    if (storedHistory) setReadingHistory(JSON.parse(storedHistory));
  }, []);

  const saveArticle = (article: NewsArticle) => {
    setSavedArticles(prev => {
      if (prev.some(a => a.id === article.id)) return prev;
      const updated = [article, ...prev];
      localStorage.setItem('savedArticles', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedArticle = (articleId: string) => {
    setSavedArticles(prev => {
      const updated = prev.filter(a => a.id !== articleId);
      localStorage.setItem('savedArticles', JSON.stringify(updated));
      return updated;
    });
  };

  const addToHistory = (article: NewsArticle) => {
    setReadingHistory(prev => {
      const filtered = prev.filter(a => a.id !== article.id);
      const updated = [article, ...filtered].slice(0, 100); // Keep last 100
      localStorage.setItem('readingHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setReadingHistory([]);
    localStorage.removeItem('readingHistory');
  };

  const isSaved = (articleId: string) => savedArticles.some(a => a.id === articleId);

  const exportSavedArticles = (format: 'markdown' | 'json' | 'text' = 'markdown'): string => {
    if (format === 'json') {
      return JSON.stringify(savedArticles, null, 2);
    }
    if (format === 'text') {
      return savedArticles
        .map((a, i) => `${i + 1}. ${a.title}\n   Source: ${a.source || 'Unknown'}\n   Link: ${a.link}\n`)
        .join('\n');
    }
    // Markdown
    return `# InstaNews - Saved Articles Digest\n*Exported on ${new Date().toLocaleDateString()}*\n\n` +
      savedArticles
        .map((a, i) => `### ${i + 1}. [${a.title}](${a.link})\n**Source**: ${a.source || 'News Source'} | **Published**: ${a.pubDate || 'Recent'}\n\n> ${a.contentSnippet || a.content || 'No snippet available'}\n`)
        .join('\n---\n\n');
  };

  return (
    <UserContext.Provider value={{
      savedArticles,
      readingHistory,
      saveArticle,
      removeSavedArticle,
      addToHistory,
      clearHistory,
      isSaved,
      exportSavedArticles
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
