import { GitFork, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCount, formatDate, githubUrl } from "../utils/formatters";

export default function RepositoryCard({ repository }) {
  const href = githubUrl(repository);
  const name = repository.name || "Untitled repository";

  return (
    <li className="repo">
      <div className="repo-top">
        {repository.id ? (
          <Link className="repo-name" to={`/repositories/${repository.id}`}>
            {name}
          </Link>
        ) : (
          <span className="repo-name">{name}</span>
        )}
        <span className="repo-lang">{repository.language || "Language unknown"}</span>
      </div>
      <p className="repo-desc">{repository.description || "No description provided."}</p>
      <div className="repo-meta">
        <span>{repository.owner || "Unknown owner"}</span>
        <span>
          <Star size={14} aria-hidden="true" />
          {formatCount(repository.stars)} stars
        </span>
        <span>
          <GitFork size={14} aria-hidden="true" />
          {formatCount(repository.forks)} forks
        </span>
        <span>Updated {formatDate(repository.lastUpdated)}</span>
        {href && (
          <a href={href} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        )}
      </div>
    </li>
  );
}
