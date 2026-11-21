import axios from "axios";

const configuredBase = import.meta.env.VITE_API_BASE_URL;
const trimmedBase = typeof configuredBase === "string" ? configuredBase.trim().replace(/\/$/, "") : "";

export const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : trimmedBase || "http://localhost:8080",
  timeout: 45000,
  headers: {
    Accept: "application/json",
  },
});

export class ApiError extends Error {
  constructor({ message, status = 0, fieldErrors = [], retryAfter = null }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

function readRetryAfter(headers) {
  if (!headers) {
    return null;
  }
  const value = headers["retry-after"] ?? headers["Retry-After"];
  if (value == null || value === "") {
    return null;
  }
  return String(value);
}

export function toApiError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({ message: "Something went wrong. Try again." });
  }

  if (error.code === "ERR_CANCELED") {
    const canceled = new ApiError({ message: "" });
    canceled.canceled = true;
    return canceled;
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError({ message: "The request timed out. Try again in a moment." });
  }

  if (!error.response) {
    const target = apiClient.defaults.baseURL || "http://localhost:8080";
    return new ApiError({
      message: target.startsWith("http://localhost")
        ? "The backend is unavailable. Start it on port 8080 and try again."
        : "The API could not be reached. If this site is hosted separately from the API, the API must allow this site's address.",
    });
  }

  const status = error.response.status;
  const data = error.response.data;
  const retryAfter = readRetryAfter(error.response.headers);
  let message = `Request failed (${status}).`;
  let fieldErrors = [];

  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (typeof data.message === "string" && data.message.trim()) {
      message = data.message.trim();
    }
    if (Array.isArray(data.fieldErrors)) {
      fieldErrors = data.fieldErrors.filter((item) => item && item.message);
    }
  } else if (status === 500 || status === 502 || status === 503 || status === 504) {
    message = "The backend is unavailable. Start it on port 8080 and try again.";
  }

  if (status === 429) {
    message = retryAfter
      ? `${message} Retry after ${retryAfter}.`
      : message;
  }

  return new ApiError({ message, status, fieldErrors, retryAfter });
}

const responseCache = new Map();
const CACHE_MS = 60000;

function cacheKey(method, payload) {
  return `${method}:${JSON.stringify(payload)}`;
}

function readCache(key) {
  const hit = responseCache.get(key);
  if (!hit) {
    return null;
  }
  if (Date.now() - hit.at > CACHE_MS) {
    responseCache.delete(key);
    return null;
  }
  return hit.data;
}

function writeCache(key, data) {
  responseCache.set(key, { at: Date.now(), data });
  return data;
}

async function request(executor) {
  try {
    const response = await executor();
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export function searchRepositories({ query, language, sort, signal }) {
  const body = { query };
  if (language) {
    body.language = language;
  }
  if (sort) {
    body.sort = sort;
  }
  const key = cacheKey("search", body);
  const cached = readCache(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  return request(() => apiClient.post("/api/github/search", body, { signal })).then((data) => writeCache(key, data));
}

export function listRepositories({ language, minStars, minForks, updatedFrom, updatedTo, sort, page, size, signal }) {
  const params = {
    page,
    size,
  };
  if (language) {
    params.language = language;
  }
  if (minStars !== undefined && minStars !== null && minStars !== "") {
    params.minStars = minStars;
  }
  if (minForks !== undefined && minForks !== null && minForks !== "") {
    params.minForks = minForks;
  }
  if (updatedFrom) {
    params.updatedFrom = updatedFrom;
  }
  if (updatedTo) {
    params.updatedTo = updatedTo;
  }
  if (sort) {
    params.sort = sort;
  }
  const key = cacheKey("list", params);
  const cached = readCache(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  return request(() => apiClient.get("/api/github/repositories", { params, signal })).then((data) => writeCache(key, data));
}

export function warmApi() {
  return listRepositories({ page: 0, size: 1, sort: "stars" }).catch(() => null);
}

export function getRepository(githubId) {
  return request(() => apiClient.get(`/api/github/repositories/${githubId}`));
}
