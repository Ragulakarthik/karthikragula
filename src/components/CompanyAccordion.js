"use client";

import { useMemo, useState } from "react";
import VideoCard from "@/components/VideoCard";
import { useProgress } from "@/context/ProgressContext";

export default function CompanyAccordion({ groups, query }) {
  const { completed } = useProgress();
  const [openCompany, setOpenCompany] = useState(null);

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
    <div className="flex flex-col gap-4">
      {filteredGroups.map((g) => {
        if (isSearching && g.matches.length === 0) return null;
        const isOpen = isSearching ? true : openCompany === g.label;
        const doneCount = g.videos.filter((v) => completed.has(v.id)).length;
        const pct = g.videos.length ? Math.round((doneCount / g.videos.length) * 100) : 0;
        const shown = isSearching ? g.matches : g.videos;

        return (
          <div key={g.label} className="gwk-brutal-sm overflow-hidden rounded-lg bg-[var(--surface)]">
            <button
              type="button"
              onClick={() =>
                !isSearching &&
                setOpenCompany((prev) => (prev === g.label ? null : g.label))
              }
              className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition ${
                isOpen ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--background)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold">{g.label}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold ${isOpen ? "text-white/80" : "text-[var(--muted)]"}`}
                  >
                    {doneCount}/{g.videos.length} completed
                  </span>
                  <span
                    className={`font-bold transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </div>
              </div>
              <div
                className={`h-1.5 w-full overflow-hidden rounded-full ${isOpen ? "bg-white/25" : "bg-[var(--line)]/12"}`}
              >
                <div
                  className={`h-full min-w-[3px] rounded-full transition-all duration-500 ${isOpen ? "bg-white" : "bg-emerald-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
            {isOpen && (
              <div className="grid grid-cols-1 gap-4 border-t-[3px] border-[var(--line)] bg-[var(--background)] p-4 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </div>
        );
      })}
      {noMatches && (
        <p className="py-16 text-center font-medium text-[var(--muted)]">
          No videos match your search.
        </p>
      )}
    </div>
  );
}
