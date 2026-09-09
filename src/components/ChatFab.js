"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExpandIcon } from "@/components/CategoryIcons";
import AgentAvatar from "@/components/AgentAvatar";
import ChatClient from "@/components/ChatClient";

export default function ChatFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/chat") return null;

  return (
    <>
      {open && (
        <div className="gwk-pop-in fixed inset-x-3 bottom-24 top-16 z-50 sm:inset-x-auto sm:right-5 sm:w-[min(96vw,600px)]">
          <div className="gwk-brutal flex h-full max-h-full flex-col overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b-[3px] border-[var(--line)] bg-[var(--accent)] px-4 py-3">
              <span className="font-display flex items-center gap-2 font-bold text-white">
                <AgentAvatar className="h-7 w-7 border-2 border-white/70" />
                Ask Me Anything
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  aria-label="Open full page"
                  title="Open full page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white/60 text-white transition hover:bg-white/20"
                >
                  <ExpandIcon className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white/60 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  ✕
                </button>
              </div>
            </div>
            <ChatClient />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Ask Me Anything"
        aria-label={open ? "Close chat" : "Ask Me Anything"}
        aria-expanded={open}
        className="gwk-brutal fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--accent)] text-white transition hover:scale-105 active:scale-95"
      >
        {open ? (
          <span className="block rotate-90 text-xl font-bold leading-none transition-transform duration-200">
            ✕
          </span>
        ) : (
          <AgentAvatar className="h-full w-full" />
        )}
      </button>
    </>
  );
}
