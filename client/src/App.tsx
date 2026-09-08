import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./features/home/HomePageView";
import ErrorBoundary from "./components/shared/ErrorBoundary";

// Lazy-loaded routes to prevent bundle bloat
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const SavedPage = lazy(() => import("./pages/SavedPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const MyNewsPage = lazy(() => import("./features/dashboard/DashboardPageView"));
const ArticlePage = lazy(() => import("./features/article-details/ArticleDetailsPageView"));
const SignInPage = lazy(() => import("./pages/AuthPages").then((m) => ({ default: m.SignInPage })));
const SignUpPage = lazy(() => import("./pages/AuthPages").then((m) => ({ default: m.SignUpPage })));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

const RouteNotFound = () => {
  throw new Error("404 - Route Not Found");
};

const PageLoaderFallback = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading page...</span>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageLoaderFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="category/:categoryId" element={<CategoryPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="my-news" element={<MyNewsPage />} />
              <Route path="article" element={<ArticlePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="sign-in/*" element={<SignInPage />} />
              <Route path="sign-up/*" element={<SignUpPage />} />
              <Route path="*" element={<RouteNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
