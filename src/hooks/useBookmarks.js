import { useContext } from "react";
import { BookmarkContext } from "../bookmarkContext";

export function useBookmarks() {
  const value = useContext(BookmarkContext);
  if (!value) {
    throw new Error("Bookmarks are unavailable");
  }
  return value;
}
