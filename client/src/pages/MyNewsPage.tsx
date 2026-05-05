import React, { useEffect, useState } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { CATEGORIES } from '../utils/Categories';
import { CATEGORY_ICONS } from '../utils/CategoryIcons';
import NewsSection from '../components/NewsSection';

const MyNewsPage: React.FC = () => {
  const { user } = useUser();
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences/${user?.id}`);
      const data = await res.json();
      if (data.success && data.data.savedCategories) {
        setSavedCategories(data.data.savedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch preferences', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (categories: string[]) => {
    try {
      await fetch(`/api/preferences/${user?.id}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories })
      });
      setSavedCategories(categories);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save preferences', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (savedCategories.includes(categoryId)) {
      setSavedCategories(savedCategories.filter(c => c !== categoryId));
    } else {
      setSavedCategories([...savedCategories, categoryId]);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Personalize Your Feed</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            Sign in to select your favorite topics and get a customized news feed delivered directly to you.
          </p>
          <SignInButton mode="modal">
            <button className="px-8 py-3 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">My News</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Your personalized feed</p>
          </div>
          <button 
            onClick={() => {
              if (isEditing) {
                savePreferences(savedCategories);
              } else {
                setIsEditing(true);
              }
            }}
            className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-violet-600 dark:text-violet-400 font-bold rounded-lg hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isEditing ? 'Save Preferences' : 'Edit Topics'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isEditing || savedCategories.length === 0 ? (
          <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-slate-200 dark:border-oled-border shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Select topics you follow</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => {
                const isSelected = savedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                        : 'border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {CATEGORY_ICONS[cat.id]}
                    <span className="font-bold">{cat.title}</span>
                  </button>
                );
              })}
            </div>
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => savePreferences(savedCategories)}
                  className="px-8 py-3 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
                >
                  Save & View Feed
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {savedCategories.map(categoryId => {
              const cat = CATEGORIES.find(c => c.id === categoryId);
              if (!cat) return null;
              return (
                <div key={categoryId}>
                  <NewsSection
                    title={`${cat.title} Updates`}
                    categoryId={cat.id}
                    country="IN"
                    limit={6}
                    onSummarize={() => {}}
                  />
                </div>
              );
            })}
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default MyNewsPage;
