import { useCallback } from "react";
import { useSavedCategories } from "./useSavedCategories";

export const useDashboardPage = () => {
  const {
    savedCategories,
    isEditing,
    loading,
    savePreferences,
    startEditing,
    toggleCategory,
  } = useSavedCategories();

  const handleHeaderAction = useCallback(() => {
    if (isEditing) {
      void savePreferences(savedCategories);
      return;
    }

    startEditing();
  }, [isEditing, savePreferences, savedCategories, startEditing]);

  const handleSave = useCallback(() => {
    void savePreferences(savedCategories);
  }, [savePreferences, savedCategories]);

  return {
    savedCategories,
    isEditing,
    loading,
    showTopicSelector: isEditing || savedCategories.length === 0,
    handleHeaderAction,
    handleSave,
    toggleCategory,
  };
};
