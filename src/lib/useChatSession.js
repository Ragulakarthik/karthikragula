"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "gwk-chat-session";
const EMPTY_TURNS = [];
const listeners = new Set();
let cache = null;

function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_TURNS;
  } catch {
    return EMPTY_TURNS;
  }
}

function getSnapshot() {
  if (cache === null) cache = readSession();
  return cache;
}

function getServerSnapshot() {
  return EMPTY_TURNS;
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeSession(next) {
  cache = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore unavailable storage
  }
  listeners.forEach((callback) => callback());
}

// Keeps the conversation alive across closing/reopening the chat popover and switching
// between the popover and the full /chat page, for the rest of this browser tab's session
// (sessionStorage), until "New chat" clears it.
export function useChatSession() {
  const turns = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTurns = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(getSnapshot()) : updater;
    writeSession(next);
  }, []);

  const clearChat = useCallback(() => setTurns(EMPTY_TURNS), [setTurns]);

  return { turns, setTurns, clearChat };
}
