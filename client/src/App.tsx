import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import SavedPage from "./pages/SavedPage";
import HistoryPage from "./pages/HistoryPage";
import MyNewsPage from "./pages/MyNewsPage";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const RouteNotFound = () => {
  throw new Error("404 - Route Not Found");
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="my-news" element={<MyNewsPage />} />
            <Route path="*" element={<RouteNotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
