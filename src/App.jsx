import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { BookmarkProvider } from "./bookmarks";
import Navbar from "./components/Navbar";
import Bookmarks from "./pages/Bookmarks";
import Dashboard from "./pages/Dashboard";
import RepositoryDetails from "./pages/RepositoryDetails";
import SavedRepositories from "./pages/SavedRepositories";
import { warmApi } from "./services/githubApi";

function MissingPage() {
  return (
    <section className="page">
      <h1 className="page-title">Page not found</h1>
      <p className="lede">That address is not part of this app.</p>
      <p className="back">
        <Link to="/">Back to search</Link>
      </p>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    warmApi();
  }, []);

  return (
    <BrowserRouter>
      <BookmarkProvider>
        <div className="app">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/saved" element={<SavedRepositories />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/repositories/:githubId" element={<RepositoryDetails />} />
              <Route path="*" element={<MissingPage />} />
            </Routes>
          </main>
        </div>
      </BookmarkProvider>
    </BrowserRouter>
  );
}
