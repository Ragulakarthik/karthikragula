"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "gwk-completed-videos";
const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch {
      // ignore unavailable/corrupt storage
    }
    setHydrated(true);
  }, []);

  function toggle(id) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore unavailable storage
      }
      return next;
    });
  }

  return (
    <ProgressContext.Provider value={{ completed, toggle, hydrated }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
