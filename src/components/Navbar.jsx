import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          GitHub Repository Searcher
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/" end>
            Search
          </NavLink>
          <NavLink to="/saved">
            Saved
          </NavLink>
          <NavLink to="/bookmarks">
            Bookmarks
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
