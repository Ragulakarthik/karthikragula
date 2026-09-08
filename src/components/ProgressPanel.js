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
        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/15 text-[11px] font-bold text-black/50 transition hover:border-black/30 hover:text-black/80 dark:border-white/20 dark:text-white/50 dark:hover:border-white/40 dark:hover:text-white/90"
        aria-label="About progress"
      >
        i
      </button>
      <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-black/10 bg-white p-4 text-left text-xs leading-relaxed text-black/70 opacity-0 shadow-xl transition duration-150 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900 dark:text-white/70">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-black/40 dark:text-white/40">
          About Progress
        </p>
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>This shows your global progress across the whole site — every category combined.</li>
          <li>The ring is split by category, so you can see where your completions come from.</li>
          <li>Tick or untick any video anytime — nothing is locked in.</li>
        </ol>
        <p className="mt-2 font-medium text-black/80 dark:text-white/80">
          Keep watching to grow your progress! 🚀
        </p>
      </div>
    </div>
  );
}

function SegmentedRing({ segments, total, done, size = 128, radius = 52, strokeWidth = 11 }) {
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  let cumulative = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        className="fill-none stroke-black/[0.06] dark:stroke-white/10"
      />
      <g transform={`rotate(-90 ${center} ${center})`}>
        {segments.map((s) => {
          if (s.length <= 0.5) return null;
          const dashoffset = -cumulative;
          cumulative += s.length;
          return (
            <circle
              key={s.key}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={s.color}
              strokeDasharray={`${s.length} ${circumference - s.length}`}
              strokeDashoffset={dashoffset}
              className="fill-none transition-all duration-500 ease-out"
            />
          );
        })}
      </g>
      <text x={center} y={center - 6} textAnchor="middle" className="fill-current text-3xl font-extrabold">
        {done}
      </text>
      <line
        x1={center - 20}
        y1={center + 8}
        x2={center + 20}
        y2={center + 8}
        strokeWidth="1"
        className="stroke-black/15 dark:stroke-white/20"
      />
      <text
        x={center}
        y={center + 26}
        textAnchor="middle"
        className="fill-current text-xs font-semibold text-black/40 dark:text-white/40"
      >
        {total}
      </text>
    </svg>
  );
}

function LegendRow({ emoji, color, label, done, total, delay = 0 }) {
  const complete = total > 0 && done === total;
  return (
    <div
      className="gwk-row-in flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: complete ? COMPLETE_COLOR : color }}
        />
        <span className="truncate text-sm font-medium">
          {emoji} {label}
        </span>
      </div>
      <span
        className={`shrink-0 text-xs font-semibold ${
          complete ? "text-green-600" : "text-black/50 dark:text-white/50"
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
    length: g.done * circumferenceUnit * (2 * Math.PI * 52),
  }));

  return (
    <aside className="w-full lg:fixed lg:inset-y-0 lg:right-0 lg:z-20 lg:w-72 lg:overflow-y-auto lg:px-4 lg:py-6">
      <div className="gwk-panel-in relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
        <div className="gwk-shimmer-bar pointer-events-none absolute inset-x-0 top-0 h-1.5" />

        <div className="flex items-center justify-between">
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-wider dark:bg-white/10">
            Your Progress
          </span>
          <InfoTooltip />
        </div>

        <div className="gwk-ring-in flex justify-center">
          <SegmentedRing segments={segments} total={overallTotal} done={overallDone} />
        </div>

        <div className="flex flex-col gap-0.5 border-t border-black/10 pt-3 dark:border-white/10">
          {groupStats.map((g, i) => (
            <LegendRow
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
    </aside>
  );
}
