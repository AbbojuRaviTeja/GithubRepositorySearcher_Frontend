import RepositoryCard from "./RepositoryCard";

export default function RepositoryList({ repositories, emptyTitle, emptyText }) {
  if (!repositories.length) {
    return (
      <div className="empty">
        <p className="empty-title">{emptyTitle}</p>
        {emptyText && <p>{emptyText}</p>}
      </div>
    );
  }

  return (
    <ul className="repo-list">
      {repositories.map((repository) => (
        <RepositoryCard key={repository.id ?? repository.name} repository={repository} />
      ))}
    </ul>
  );
}
