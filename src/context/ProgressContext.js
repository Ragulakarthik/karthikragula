"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "gwk-completed-videos";
const ProgressContext = createContext(null);

const EMPTY_SET = new Set();
const listeners = new Set();
let cache = null;

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function getSnapshot() {
  if (cache === null) cache = readStore();
  return cache;
}

function getServerSnapshot() {
  return EMPTY_SET;
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeStore(next) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // ignore unavailable storage
  }
  listeners.forEach((callback) => callback());
}

export function ProgressProvider({ children }) {
  const completed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback((id) => {
    const next = new Set(getSnapshot());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStore(next);
  }, []);

  return (
    <ProgressContext.Provider value={{ completed, toggle, hydrated: true }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
