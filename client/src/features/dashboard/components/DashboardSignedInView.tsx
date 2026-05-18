import React from "react";
import DashboardFeed from "./DashboardFeed";
import DashboardHeader from "./DashboardHeader";
import DashboardLoadingState from "./DashboardLoadingState";
import DashboardTopicSelector from "./DashboardTopicSelector";

interface DashboardSignedInViewProps {
  savedCategories: string[];
  isEditing: boolean;
  loading: boolean;
  showTopicSelector: boolean;
  onHeaderAction: () => void;
  onToggleCategory: (categoryId: string) => void;
  onSave: () => void;
}

const DashboardSignedInView: React.FC<DashboardSignedInViewProps> = ({
  savedCategories,
  isEditing,
  loading,
  showTopicSelector,
  onHeaderAction,
  onToggleCategory,
  onSave,
}) => {
  return (
    <>
      <DashboardHeader isEditing={isEditing} onAction={onHeaderAction} />

      {loading ? (
        <DashboardLoadingState />
      ) : showTopicSelector ? (
        <DashboardTopicSelector
          savedCategories={savedCategories}
          isEditing={isEditing}
          onToggleCategory={onToggleCategory}
          onSave={onSave}
        />
      ) : (
        <DashboardFeed savedCategories={savedCategories} />
      )}
    </>
  );
};

export default DashboardSignedInView;
