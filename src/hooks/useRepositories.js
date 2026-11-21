import { useEffect, useState } from "react";
import { listRepositories } from "../services/githubApi";
import { validateSavedFilters } from "../utils/validation";

const INITIAL_QUERY = {
  language: "",
  minStars: "",
  sort: "stars",
  page: 0,
  size: 20,
  revision: 0,
};

export function useRepositories() {
  const [draft, setDraft] = useState({
    language: "",
    minStars: "",
    sort: "stars",
  });
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterError, setFilterError] = useState("");

  useEffect(() => {
    let ignore = false;

    listRepositories({
      language: query.language,
      minStars: query.minStars === "" ? undefined : Number(query.minStars),
      sort: query.sort,
      page: query.page,
      size: query.size,
    })
      .then((data) => {
        if (!ignore) {
          setResult(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setResult(null);
          setError(err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setFilterError("");
  }

  function applyFilters(event) {
    event.preventDefault();
    const message = validateSavedFilters(draft);
    if (message) {
      setFilterError(message);
      return;
    }
    setFilterError("");
    setLoading(true);
    setError(null);
    setQuery((current) => ({
      language: draft.language.trim(),
      minStars: draft.minStars.trim(),
      sort: draft.sort,
      page: 0,
      size: current.size,
      revision: current.revision + 1,
    }));
  }

  function setPage(page) {
    setLoading(true);
    setError(null);
    setQuery((current) => ({
      ...current,
      page,
      revision: current.revision + 1,
    }));
  }

  function setSize(size) {
    setLoading(true);
    setError(null);
    setQuery((current) => ({
      ...current,
      size: Number(size),
      page: 0,
      revision: current.revision + 1,
    }));
  }

  function reload() {
    setLoading(true);
    setError(null);
    setQuery((current) => ({
      ...current,
      revision: current.revision + 1,
    }));
  }

  return {
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
  };
}
