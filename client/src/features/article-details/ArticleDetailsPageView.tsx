import React from "react";
import ArticleDetailsContent from "./components/ArticleDetailsContent";
import { useArticleDetailsPage } from "./hooks/useArticleDetailsPage";

const ArticleDetailsPageView: React.FC = () => {
  const { article, handleBack } = useArticleDetailsPage();

  if (!article) {
    return null;
  }

  return <ArticleDetailsContent article={article} onBack={handleBack} />;
};

export default ArticleDetailsPageView;
