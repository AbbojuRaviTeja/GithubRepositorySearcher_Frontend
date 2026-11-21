import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RepositoryDetails from "./pages/RepositoryDetails";
import SavedRepositories from "./pages/SavedRepositories";

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
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/saved" element={<SavedRepositories />} />
            <Route path="/repositories/:githubId" element={<RepositoryDetails />} />
            <Route path="*" element={<MissingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
