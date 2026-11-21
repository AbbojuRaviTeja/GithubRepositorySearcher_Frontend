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

async function request(executor) {
  try {
    const response = await executor();
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export function searchRepositories({ query, language, sort }) {
  const body = { query };
  if (language) {
    body.language = language;
  }
  if (sort) {
    body.sort = sort;
  }
  return request(() => apiClient.post("/api/github/search", body));
}

export function listRepositories({ language, minStars, sort, page, size }) {
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
  if (sort) {
    params.sort = sort;
  }
  return request(() => apiClient.get("/api/github/repositories", { params }));
}

export function getRepository(githubId) {
  return request(() => apiClient.get(`/api/github/repositories/${githubId}`));
}
