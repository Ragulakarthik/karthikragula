"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "gwk-theme";
const listeners = new Set();
let cache = null;

function readStore() {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function getSnapshot() {
  if (cache === null) cache = readStore();
  return cache;
}

function getServerSnapshot() {
  return "light";
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeStore(next) {
  cache = next;
  document.documentElement.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore unavailable storage
  }
  listeners.forEach((callback) => callback());
}

export default function ThemeToggle({ className = "" }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    writeStore(getSnapshot() === "dark" ? "light" : "dark");
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-[var(--line)] text-sm transition hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] ${className}`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
