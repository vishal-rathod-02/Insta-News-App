import React from "react";
import { CATEGORIES } from "../../../utils/Categories";
import { CATEGORY_ICONS } from "../../../utils/CategoryIcons";

interface DashboardTopicSelectorProps {
  savedCategories: string[];
  isEditing: boolean;
  onToggleCategory: (categoryId: string) => void;
  onSave: () => void;
}

const DashboardTopicSelector: React.FC<DashboardTopicSelectorProps> = ({
  savedCategories,
  isEditing,
  onToggleCategory,
  onSave,
}) => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 border border-slate-200 dark:border-oled-border shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
        Select topics you follow
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => {
          const isSelected = savedCategories.includes(category.id);

          return (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300"
                  : "border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {CATEGORY_ICONS[category.id]}
              <span className="font-bold">{category.title}</span>
            </button>
          );
        })}
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={onSave}
            className="px-8 py-3 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
          >
            Save & View Feed
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardTopicSelector;
