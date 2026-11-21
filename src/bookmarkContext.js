import { createContext } from "react";

export const BookmarkContext = createContext(null);
export const BOOKMARK_STORAGE_KEY = "github-searcher-bookmarks";

export function readBookmarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKMARK_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
  } catch {
    return [];
  }
}
