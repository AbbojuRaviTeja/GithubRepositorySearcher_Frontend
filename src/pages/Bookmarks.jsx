import RepositoryList from "../components/RepositoryList";
import { useBookmarks } from "../hooks/useBookmarks";

export default function Bookmarks() {
  const { items } = useBookmarks();

  return (
    <section className="page">
      <header className="page-head">
        <h1 className="page-title">Bookmarks</h1>
        <p className="lede">
          Repositories you marked with Save. These stay in this browser and open without another API call.
        </p>
      </header>
      <div className="results">
        <div className="results-head">
          <h2>{items.length === 1 ? "1 bookmark" : `${items.length} bookmarks`}</h2>
        </div>
        <RepositoryList
          repositories={items}
          emptyTitle="No bookmarks yet"
          emptyText="Use Save on the right of a repository to keep it here."
        />
      </div>
    </section>
  );
}
