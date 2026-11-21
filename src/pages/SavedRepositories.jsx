import ErrorMessage from "../components/ErrorMessage";
import FilterPanel from "../components/FilterPanel";
import LoadingState from "../components/LoadingState";
import RepositoryList from "../components/RepositoryList";
import { useRepositories } from "../hooks/useRepositories";
import { PAGE_SIZES } from "../utils/options";
import { formatRange } from "../utils/formatters";

export default function SavedRepositories() {
  const {
    draft,
    updateDraft,
    applyFilters,
    filterError,
    query,
    result,
    loading,
    error,
    setPage,
    setSize,
    reload,
  } = useRepositories();

  const repositories = result?.repositories ?? [];
  const totalPages = result?.totalPages ?? 0;
  const currentPage = (result?.page ?? query.page) + 1;
  const hasFilters = Boolean(query.language || query.minStars !== "");
  const summary = result
    ? formatRange(result.page, result.size, repositories.length, result.totalElements)
    : "";

  return (
    <section className="page">
      <header className="page-head">
        <h1 className="page-title">Saved repositories</h1>
        <p className="lede">
          Rows already stored in PostgreSQL. This page reads the database API and does not call GitHub.
        </p>
      </header>

      <FilterPanel draft={draft} onChange={updateDraft} onSubmit={applyFilters} disabled={loading} />
      {filterError && <ErrorMessage message={filterError} />}

      {loading && !result && <LoadingState label="Loading saved repositories…" />}
      {loading && result && (
        <p className="hint" role="status">
          Updating results…
        </p>
      )}
      {error && <ErrorMessage message={error.message} details={error.fieldErrors} onRetry={reload} />}

      {result && (
        <div className="results">
          <div className="results-head">
            <h2>Stored results</h2>
            <p>{summary}</p>
          </div>
          <RepositoryList
            repositories={repositories}
            emptyTitle={hasFilters ? "No matching repositories" : "Nothing saved yet"}
            emptyText={
              hasFilters
                ? "Clear a filter or search from the home page to store more repositories."
                : "Run a search from the home page. Matches are saved here."
            }
          />
          <div className="pager">
            <label className="field page-size">
              <span>Per page</span>
              <select
                value={query.size}
                onChange={(event) => setSize(event.target.value)}
                disabled={loading}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <div className="pager-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setPage(query.page - 1)}
                disabled={loading || query.page <= 0}
              >
                Previous
              </button>
              <span>
                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setPage(query.page + 1)}
                disabled={loading || totalPages === 0 || currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
