import React from "react";
import HomePageContent from "./components/HomePageContent";
import { useHomePage } from "./hooks/useHomePage";

const HomePageView: React.FC = () => {
  const homePage = useHomePage();

  return <HomePageContent {...homePage} />;
};

export default HomePageView;
