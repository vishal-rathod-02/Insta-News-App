import { getApiUrl } from "../../../utils/apiConfig";

interface DashboardPreferencesResponse {
  success: boolean;
  data?: {
    savedCategories?: string[];
    bookmarkedArticles?: any[];
  };
}

const LOCAL_STORAGE_KEY = "user_saved_categories";

/**
 * Fetch user preferences (categories) with fallback resilience
 */
export const fetchDashboardPreferences = async (
  userId?: string,
  token?: string | null,
): Promise<string[]> => {
  // 1. Try authenticated /api/preferences/me endpoint if token is present
  if (token) {
    try {
      const response = await fetch(getApiUrl("/api/preferences/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as DashboardPreferencesResponse;
        const categories = data.data?.savedCategories ?? [];
        if (categories.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
        }
        return categories;
      }
    } catch (authErr) {
      console.warn("Auth token preference fetch failed, attempting fallback:", authErr);
    }
  }

  // 2. Try legacy /api/preferences/:userId endpoint if userId is present
  if (userId) {
    try {
      const response = await fetch(getApiUrl(`/api/preferences/${userId}`));
      if (response.ok) {
        const data = (await response.json()) as DashboardPreferencesResponse;
        const categories = data.data?.savedCategories ?? [];
        if (categories.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
        }
        return categories;
      }
    } catch (userErr) {
      console.warn("UserId preference fetch failed, using local storage:", userErr);
    }
  }

  // 3. Fallback to LocalStorage so UI never breaks
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore JSON parse errors
  }

  return [];
};

/**
 * Save user preferred categories with fallback resilience
 */
export const saveDashboardPreferences = async (
  categories: string[],
  userId?: string,
  token?: string | null,
): Promise<void> => {
  // Always save locally first for instant offline responsiveness
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.warn("Failed to save categories to localStorage", err);
  }

  let savedToServer = false;

  // 1. Try saving to /api/preferences/me with Bearer token
  if (token) {
    try {
      const response = await fetch(getApiUrl("/api/preferences/me/categories"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories }),
      });

      if (response.ok) {
        savedToServer = true;
      }
    } catch (authErr) {
      console.warn("Auth token preference save failed, trying fallback:", authErr);
    }
  }

  // 2. If not saved yet, try /api/preferences/:userId/categories
  if (!savedToServer && userId) {
    try {
      const response = await fetch(getApiUrl(`/api/preferences/${userId}/categories`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      if (response.ok) {
        savedToServer = true;
      }
    } catch (userErr) {
      console.warn("UserId preference save failed:", userErr);
    }
  }
};
