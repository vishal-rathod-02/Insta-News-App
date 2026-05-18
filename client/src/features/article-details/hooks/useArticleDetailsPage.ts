import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { NewsArticle } from "../../../utils/types";

export const useArticleDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article as NewsArticle | undefined;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!article) {
      navigate("/");
      return;
    }

    document.title = `${article.title} - InstaNews`;
  }, [article, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return { article, handleBack };
};
