import { useUser, useAuth } from "@clerk/clerk-react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardPreferences,
  saveDashboardPreferences,
} from "../services/dashboardPreferencesService";

export const useSavedCategories = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchPreferences = useCallback(async () => {
    if (!userId) {
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const categories = await fetchDashboardPreferences(userId, token);
      setSavedCategories(categories);
    } catch (error) {
      console.error("Failed to fetch preferences", error);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (userId) {
      void fetchPreferences();
      return;
    }

    setLoading(false);
  }, [fetchPreferences, isLoaded, userId]);

  const savePreferences = useCallback(
    async (categories: string[]) => {
      if (!userId) {
        return;
      }

      try {
        const token = await getToken();
        await saveDashboardPreferences(categories, userId, token);
        setSavedCategories(categories);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save preferences", error);
      }
    },
    [userId, getToken],
  );

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setSavedCategories((currentCategories) =>
      currentCategories.includes(categoryId)
        ? currentCategories.filter((currentCategory) => currentCategory !== categoryId)
        : [...currentCategories, categoryId],
    );
  }, []);

  return {
    savedCategories,
    isEditing,
    loading,
    savePreferences,
    startEditing,
    toggleCategory,
  };
};
