"use client";

import { useCallback, useSyncExternalStore } from "react";
import Sidebar from "@/components/Sidebar";

const STORAGE_KEY = "gwk-sidebar-collapsed";
const listeners = new Set();
let cache = null;

function readStore() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getSnapshot() {
  if (cache === null) cache = readStore();
  return cache;
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeStore(next) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // ignore unavailable storage
  }
  listeners.forEach((callback) => callback());
}

export default function SidebarShell({ children }) {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    writeStore(!getSnapshot());
  }, []);

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={`flex min-h-full flex-1 flex-col transition-[padding] duration-200 ${
          collapsed ? "lg:pl-16" : "lg:pl-56"
        }`}
      >
        {children}
      </div>
    </>
  );
}
