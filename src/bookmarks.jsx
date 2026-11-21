import { useMemo, useState } from "react";
import { BOOKMARK_STORAGE_KEY, BookmarkContext, readBookmarks } from "./bookmarkContext";

export function BookmarkProvider({ children }) {
  const [items, setItems] = useState(readBookmarks);

  const value = useMemo(() => {
    const ids = new Set(items.map((item) => item.id));

    function toggle(repository) {
      if (!repository?.id) {
        return;
      }
      setItems((current) => {
        const exists = current.some((item) => item.id === repository.id);
        const next = exists
          ? current.filter((item) => item.id !== repository.id)
          : [repository, ...current.filter((item) => item.id !== repository.id)];
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }

    return {
      items,
      has: (id) => ids.has(id),
      toggle,
    };
  }, [items]);

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
}
