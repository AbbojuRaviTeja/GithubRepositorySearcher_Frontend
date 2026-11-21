const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const countFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "0";
  }
  return countFormatter.format(number);
}

export function formatDate(value) {
  if (!value) {
    return "Unknown";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  return dateFormatter.format(date);
}

export function githubUrl(repository) {
  if (!repository?.owner || !repository?.name) {
    return null;
  }
  return `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
}

export function formatRange(page, size, count, total) {
  if (!total || !count) {
    return "0 repositories";
  }
  const start = page * size + 1;
  const end = start + count - 1;
  const noun = total === 1 ? "repository" : "repositories";
  return `Showing ${start}–${end} of ${formatCount(total)} ${noun}`;
}
