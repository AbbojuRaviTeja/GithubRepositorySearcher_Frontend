import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import LoadingState from "../components/LoadingState";
import RepositoryList from "../components/RepositoryList";
import SearchForm from "../components/SearchForm";
import { searchRepositories } from "../services/githubApi";
import { validateSearch } from "../utils/validation";

export default function Dashboard() {
  const [form, setForm] = useState({
    query: "",
    language: "",
    sort: "stars",
  });
  const [loading, setLoading] = useState(false);
  const [clientError, setClientError] = useState("");
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setClientError("");
  }

  async function runSearch() {
    const message = validateSearch(form);
    if (message) {
      setClientError(message);
      setError(null);
      return;
    }

    const payload = {
      query: form.query.trim(),
      language: form.language.trim(),
      sort: form.sort,
    };

    setClientError("");
    setError(null);
    setLoading(true);
    try {
      const data = await searchRepositories(payload);
      setResponse(data && Array.isArray(data.repositories) ? data : { message: "", repositories: [] });
    } catch (err) {
      setResponse(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    runSearch();
  }

  const repositories = response?.repositories ?? [];
  const heading = repositories.length === 1 ? "1 repository" : `${repositories.length} repositories`;

  return (
    <section className="page">
      <header className="page-head">
        <h1 className="page-title">GitHub Repository Searcher</h1>
        <p className="lede">
          Search public GitHub repositories by keyword, language, and popularity. Each match is stored so you can browse it again without calling GitHub.
        </p>
      </header>

      <SearchForm values={form} onChange={updateField} onSubmit={handleSubmit} disabled={loading} />

      {clientError && <ErrorMessage message={clientError} />}
      {error && (
        <ErrorMessage message={error.message} details={error.fieldErrors} onRetry={runSearch} />
      )}
      {loading && <LoadingState label="Searching GitHub and saving matches…" />}

      {!loading && response && (
        <div className="results">
          <div className="results-head">
            <h2>{heading}</h2>
            {response.message && <p>{response.message}</p>}
          </div>
          <RepositoryList
            repositories={repositories}
            emptyTitle="No repositories found"
            emptyText="Try a broader keyword or leave the language blank."
          />
        </div>
      )}

      {!loading && !response && !error && !clientError && (
        <p className="hint">Results show up here after a search.</p>
      )}
    </section>
  );
}
