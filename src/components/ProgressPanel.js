"use client";

import { useProgress } from "@/context/ProgressContext";
import { CATEGORIES } from "@/data/categories";
import { getAllVideos, getVideosByCategory } from "@/lib/videos";

const allVideos = getAllVideos();

const categoryGroups = CATEGORIES.filter((c) => c.inNav).map((c) => ({
  label: c.label,
  emoji: c.emoji,
  color: c.color,
  videos: getVideosByCategory(c.id),
}));

const COMPLETE_COLOR = "#16a34a";

function InfoTooltip() {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/15 text-[11px] font-bold text-black/50 transition hover:scale-110 hover:border-orange-500 hover:text-orange-600 dark:border-white/20 dark:text-white/50 dark:hover:border-orange-400 dark:hover:text-orange-400"
        aria-label="About progress"
      >
        i
      </button>
      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-black/10 bg-white/95 p-4 text-left text-xs leading-relaxed text-black/60 opacity-0 shadow-2xl backdrop-blur-xl transition duration-150 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900/95 dark:text-white/60">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-black/70 dark:text-white/80">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-orange-500/60 text-[9px] text-orange-600 dark:text-orange-400">
            i
          </span>
          About Progress
        </p>
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>
            This represents your{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              global progress
            </span>{" "}
            across the platform.
          </li>
          <li>
            The ring is{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              split by category
            </span>
            , so you can see where it comes from.
          </li>
          <li>
            Videos can be{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              ticked or unticked
            </span>{" "}
            anytime — nothing is locked in.
          </li>
        </ol>
        <p className="mt-2 text-black/70 dark:text-white/70">
          Keep watching to grow your{" "}
          <span className="font-semibold text-orange-600 dark:text-orange-400">progress</span>!
        </p>
      </div>
    </div>
  );
}

function withOffsets(segments) {
  let cumulative = 0;
  return segments.map((s) => {
    const dashoffset = -cumulative;
    cumulative += s.length;
    return { ...s, dashoffset };
  });
}

function SegmentedRing({ segments, total, done, size = 140, radius = 56, strokeWidth = 12 }) {
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const positioned = withOffsets(segments);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute h-24 w-24 rounded-full bg-gradient-to-br from-orange-500/30 via-red-500/20 to-transparent blur-2xl" />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative shrink-0 -rotate-0">
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-black/[0.06] dark:stroke-white/10"
        />
        <g transform={`rotate(-90 ${center} ${center})`}>
          {positioned.map((s) => {
            if (s.length <= 0.5) return null;
            return (
              <circle
                key={s.key}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                stroke={s.color}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(s.length - 3, 0)} ${circumference}`}
                strokeDashoffset={s.dashoffset}
                className="fill-none transition-all duration-500 ease-out"
              />
            );
          })}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-4xl font-black text-transparent">
          {done}
        </span>
        <span className="mt-0.5 h-px w-8 bg-black/15 dark:bg-white/20" />
        <span className="mt-0.5 text-xs font-bold text-black/35 dark:text-white/35">{total}</span>
      </div>
    </div>
  );
}

function CategoryChip({ emoji, color, label, done, total, delay = 0 }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;
  const size = 48;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="gwk-row-in flex w-16 flex-col items-center gap-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth="3.5"
            className="fill-none stroke-black/10 dark:stroke-white/10"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={complete ? COMPLETE_COLOR : color}
            transform={`rotate(-90 ${center} ${center})`}
            className="fill-none transition-all duration-500 ease-out"
          />
        </svg>
        <span className="text-lg">{complete ? "✅" : emoji}</span>
      </div>
      <span className="max-w-full truncate text-[10px] font-semibold leading-tight">{label}</span>
      <span
        className={`text-[10px] font-medium ${
          complete ? "text-green-600" : "text-black/40 dark:text-white/40"
        }`}
      >
        {done}/{total}
      </span>
    </div>
  );
}

export default function ProgressPanel() {
  const { completed, hydrated } = useProgress();

  const overallTotal = allVideos.length;
  const overallDone = hydrated ? allVideos.filter((v) => completed.has(v.id)).length : 0;

  const circumferenceUnit = overallTotal ? 1 / overallTotal : 0;
  const groupStats = categoryGroups.map((g) => ({
    ...g,
    done: hydrated ? g.videos.filter((v) => completed.has(v.id)).length : 0,
  }));

  const segments = groupStats.map((g) => ({
    key: g.label,
    color: g.color,
    length: g.done * circumferenceUnit * (2 * Math.PI * 56),
  }));

  return (
    <aside className="w-full lg:pointer-events-none lg:fixed lg:inset-y-0 lg:right-0 lg:z-20 lg:w-80 lg:overflow-y-auto lg:px-4 lg:py-6">
      <div className="gwk-panel-in pointer-events-auto relative rounded-[28px] bg-gradient-to-br from-orange-500/70 via-red-500/50 to-fuchsia-500/60 p-[1.5px] shadow-2xl shadow-red-900/10 dark:shadow-black/40">
        <div className="flex flex-col gap-6 rounded-[27px] bg-white/95 p-6 backdrop-blur-xl dark:bg-neutral-950/95">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-wider dark:bg-white/10">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
              Your Progress
            </span>
            <InfoTooltip />
          </div>

          <div className="gwk-ring-in flex justify-center">
            <SegmentedRing segments={segments} total={overallTotal} done={overallDone} />
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 border-t border-black/10 pt-5 dark:border-white/10">
            {groupStats.map((g, i) => (
              <CategoryChip
                key={g.label}
                emoji={g.emoji}
                color={g.color}
                label={g.label}
                done={g.done}
                total={g.videos.length}
                delay={i * 60}
              />
            ))}
          </div>

          <p className="text-center text-[11px] leading-snug text-black/35 dark:text-white/35">
            🔒 Saved only in this browser
          </p>
        </div>
      </div>
    </aside>
  );
}
