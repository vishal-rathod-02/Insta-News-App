import React from "react";

interface DashboardHeaderProps {
  isEditing: boolean;
  onAction: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isEditing, onAction }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">My News</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your personalized feed</p>
      </div>

      <button
        onClick={onAction}
        className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-violet-600 dark:text-violet-400 font-bold rounded-lg hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors"
      >
        {isEditing ? "Save Preferences" : "Edit Topics"}
      </button>
    </div>
  );
};

export default DashboardHeader;
