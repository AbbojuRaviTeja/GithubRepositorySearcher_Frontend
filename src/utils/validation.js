export function validateSearch({ query, language }) {
  const keyword = query.trim();
  if (!keyword) {
    return "Enter a search keyword.";
  }
  if (keyword.length > 256) {
    return "Keyword must be at most 256 characters.";
  }
  if (language.trim().length > 64) {
    return "Language must be at most 64 characters.";
  }
  return "";
}

function validCount(value, label) {
  const trimmed = value.trim();
  if (trimmed && !/^\d{1,18}$/.test(trimmed)) {
    return `${label} must be a whole number of 0 or more.`;
  }
  return "";
}

function validDate(value, label) {
  const trimmed = value.trim();
  if (trimmed && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${label} must be a date.`;
  }
  return "";
}

export function validateSavedFilters({ language, minStars, minForks, updatedFrom, updatedTo }) {
  if (language.trim().length > 64) {
    return "Language must be at most 64 characters.";
  }
  const stars = validCount(minStars, "Minimum stars");
  if (stars) {
    return stars;
  }
  const forks = validCount(minForks, "Minimum forks");
  if (forks) {
    return forks;
  }
  const fromError = validDate(updatedFrom, "Updated from");
  if (fromError) {
    return fromError;
  }
  const toError = validDate(updatedTo, "Updated to");
  if (toError) {
    return toError;
  }
  if (updatedFrom && updatedTo && updatedFrom > updatedTo) {
    return "Updated from must be on or before updated to.";
  }
  return "";
}

export function matchesLocalFilters(repository, filters) {
  const stars = filters.minStars.trim();
  const forks = filters.minForks.trim();
  const from = filters.updatedFrom.trim();
  const to = filters.updatedTo.trim();
  if (stars && Number(repository.stars || 0) < Number(stars)) {
    return false;
  }
  if (forks && Number(repository.forks || 0) < Number(forks)) {
    return false;
  }
  const day = repository.lastUpdated ? String(repository.lastUpdated).slice(0, 10) : "";
  if ((from || to) && !day) {
    return false;
  }
  if (from && day < from) {
    return false;
  }
  if (to && day > to) {
    return false;
  }
  return true;
}

export function parseGithubId(value) {
  if (!/^\d+$/.test(String(value || ""))) {
    return null;
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }
  return id;
}
