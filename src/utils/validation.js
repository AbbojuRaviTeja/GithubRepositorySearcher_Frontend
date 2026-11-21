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

export function validateSavedFilters({ language, minStars }) {
  if (language.trim().length > 64) {
    return "Language must be at most 64 characters.";
  }
  const stars = minStars.trim();
  if (stars && !/^\d{1,18}$/.test(stars)) {
    return "Minimum stars must be a whole number of 0 or more.";
  }
  return "";
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
