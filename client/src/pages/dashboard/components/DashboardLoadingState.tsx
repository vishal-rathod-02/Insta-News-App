import React from "react";

const DashboardLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default DashboardLoadingState;
