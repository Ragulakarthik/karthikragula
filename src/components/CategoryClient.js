"use client";

import { useMemo, useState } from "react";
import VideoCard from "@/components/VideoCard";
import ProgressPanel from "@/components/ProgressPanel";
import CompanyAccordion from "@/components/CompanyAccordion";
import { extractProblemNumber, groupVideosBy } from "@/lib/videos";

const GROUPED_CATEGORIES = {
  companies: {
    field: "company",
    order: ["Infosys", "Cognizant", "Accenture", "LTI Mindtree", "Capsitech"],
  },
  dsa: {
    field: "topic",
    order: [
      "Arrays & Hashing",
      "Two Pointers",
      "Sliding Window",
      "Stack",
      "Intervals",
      "Strings",
      "Greedy",
      "Math & Bit Manipulation",
    ],
  },
  miscellaneous: {
    field: "group",
    order: ["Temples", "Food", "Dance", "Other"],
  },
};

export default function CategoryClient({ category, videos }) {
  const [query, setQuery] = useState("");
  const groupConfig = GROUPED_CATEGORIES[category.id];
  const isGrouped = Boolean(groupConfig);

  const sorted = useMemo(() => {
    if (category.id !== "dsa") return videos;
    return [...videos].sort((a, b) => {
      const na = extractProblemNumber(a.title);
      const nb = extractProblemNumber(b.title);
      if (na === null) return 1;
      if (nb === null) return -1;
      return na - nb;
    });
  }, [category.id, videos]);

  const groups = useMemo(() => {
    if (!groupConfig) return [];
    const { field, order } = groupConfig;
    return [...groupVideosBy(sorted, field).entries()]
      .sort(([a], [b]) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      })
      .map(([label, vids]) => ({ label, videos: vids }));
  }, [groupConfig, sorted]);

  const filtered = useMemo(() => {
    if (isGrouped) return [];
    const q = query.trim().toLowerCase();
    return sorted.filter((v) => !q || v.title.toLowerCase().includes(q));
  }, [isGrouped, sorted, query]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="min-w-0 flex-1 lg:pr-80">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${category.label}...`}
            className="w-full max-w-md rounded-full border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-red-500 dark:border-white/15 dark:bg-white/5"
          />
          <span className="text-sm text-black/50 dark:text-white/50">
            {isGrouped ? videos.length : filtered.length} video
            {(isGrouped ? videos.length : filtered.length) === 1 ? "" : "s"}
          </span>
        </div>

        {isGrouped ? (
          <CompanyAccordion groups={groups} query={query} />
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-black/50 dark:text-white/50">
            No videos match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>

      <ProgressPanel />
    </div>
  );
}
