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
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/5 ${
        isDone
          ? "border-green-500/50 ring-1 ring-green-500/30"
          : "border-black/10 dark:border-white/10"
      }`}
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden bg-black/5"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition duration-300 group-hover:scale-105 ${isDone ? "opacity-70" : ""}`}
        />
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {duration}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg">
            ▶
          </span>
        </span>
      </a>

      <button
        type="button"
        onClick={() => toggle(video.id)}
        aria-pressed={isDone}
        className={`absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold shadow transition ${
          isDone
            ? "border-green-600 bg-green-600 text-white"
            : "border-white/80 bg-black/40 text-white/0 hover:text-white/80"
        }`}
        title={isDone ? "Mark as not completed" : "Mark as completed"}
      >
        ✓
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {(video.company || video.group) && (
          <span className="w-fit rounded-full bg-indigo-600/10 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {video.company || video.group}
          </span>
        )}
        <a href={video.url} target="_blank" rel="noopener noreferrer">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug hover:underline">
            {video.title}
          </h3>
        </a>
        {views && (
          <span className="mt-auto text-xs text-black/50 dark:text-white/50">
            {views}
          </span>
        )}
      </div>
    </div>
  );
}
