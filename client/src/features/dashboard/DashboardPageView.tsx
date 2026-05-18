import React from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import DashboardSignedInView from "./components/DashboardSignedInView";
import DashboardSignInPrompt from "./components/DashboardSignInPrompt";
import { useDashboardPage } from "./hooks/useDashboardPage";

const DashboardPageView: React.FC = () => {
  const dashboardPage = useDashboardPage();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-8">
      <SignedOut>
        <DashboardSignInPrompt />
      </SignedOut>

      <SignedIn>
        <DashboardSignedInView
          savedCategories={dashboardPage.savedCategories}
          isEditing={dashboardPage.isEditing}
          loading={dashboardPage.loading}
          showTopicSelector={dashboardPage.showTopicSelector}
          onHeaderAction={dashboardPage.handleHeaderAction}
          onToggleCategory={dashboardPage.toggleCategory}
          onSave={dashboardPage.handleSave}
        />
      </SignedIn>
    </div>
  );
};

export default DashboardPageView;
