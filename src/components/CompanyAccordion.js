"use client";

import { useMemo, useState } from "react";
import VideoCard from "@/components/VideoCard";
import { useProgress } from "@/context/ProgressContext";

export default function CompanyAccordion({ groups, query }) {
  const { completed } = useProgress();
  const [openCompany, setOpenCompany] = useState(groups[0]?.label ?? null);

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filteredGroups = useMemo(() => {
    return groups.map((g) => ({
      ...g,
      matches: g.videos.filter((v) => !q || v.title.toLowerCase().includes(q)),
    }));
  }, [groups, q]);

  const noMatches = isSearching && filteredGroups.every((g) => g.matches.length === 0);

  return (
    <div className="flex flex-col gap-3">
      {filteredGroups.map((g) => {
        if (isSearching && g.matches.length === 0) return null;
        const isOpen = isSearching ? true : openCompany === g.label;
        const doneCount = g.videos.filter((v) => completed.has(v.id)).length;
        const pct = g.videos.length ? Math.round((doneCount / g.videos.length) * 100) : 0;
        const shown = isSearching ? g.matches : g.videos;

        return (
          <div
            key={g.label}
            className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
          >
            <button
              type="button"
              onClick={() =>
                !isSearching &&
                setOpenCompany((prev) => (prev === g.label ? null : g.label))
              }
              className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition ${
                isOpen
                  ? "bg-black/[0.03] dark:bg-white/[0.05]"
                  : "hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{g.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-black/50 dark:text-white/50">
                    {doneCount}/{g.videos.length} completed
                  </span>
                  <span
                    className={`text-black/40 transition-transform dark:text-white/40 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-1.5 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
            {isOpen && (
              <div className="grid grid-cols-1 gap-4 border-t border-black/10 p-4 sm:grid-cols-2 xl:grid-cols-3 dark:border-white/10">
                {shown.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </div>
        );
      })}
      {noMatches && (
        <p className="py-16 text-center text-black/50 dark:text-white/50">
          No videos match your search.
        </p>
      )}
    </div>
  );
}
