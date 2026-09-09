"use client";

import Image from "next/image";
import { formatDuration, formatViewCount } from "@/lib/videos";
import { useProgress } from "@/context/ProgressContext";

export default function VideoCard({ video }) {
  const { completed, toggle } = useProgress();
  const isDone = completed.has(video.id);
  const duration = formatDuration(video.duration);
  const views = formatViewCount(video.viewCount);

  return (
    <div
      className={`group gwk-brutal relative flex flex-col overflow-hidden rounded-lg transition ${
        isDone ? "bg-[var(--done-tint)]" : "bg-[var(--surface)]"
      }`}
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden border-b-[3px] border-[var(--line)] bg-black/10"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition duration-300 group-hover:scale-105 ${isDone ? "opacity-80" : ""}`}
        />
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded border-2 border-[var(--line)] bg-[var(--surface)] px-1.5 py-0.5 text-xs font-bold text-[var(--ink)]">
            {duration}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--line)] bg-[var(--accent)] text-white shadow-[3px_3px_0_0_var(--line)]">
            ▶
          </span>
        </span>
      </a>

      <button
        type="button"
        onClick={() => toggle(video.id)}
        aria-pressed={isDone}
        className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border-2 border-[var(--line)] text-sm font-bold shadow-[2px_2px_0_0_var(--line)] transition ${
          isDone ? "bg-emerald-500 text-white" : "bg-white text-white/0 hover:text-black/40"
        }`}
        title={isDone ? "Mark as not completed" : "Mark as completed"}
      >
        ✓
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {(video.company || video.group) && (
          <span className="w-fit rounded border-2 border-[var(--line)] bg-[var(--accent)] px-2 py-0.5 text-xs font-bold text-white">
            {video.company || video.group}
          </span>
        )}
        <a href={video.url} target="_blank" rel="noopener noreferrer">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[var(--ink)] hover:underline">
            {video.title}
          </h3>
        </a>
        {views && (
          <span className="mt-auto text-xs font-medium text-[var(--muted)]">{views}</span>
        )}
      </div>
    </div>
  );
}
