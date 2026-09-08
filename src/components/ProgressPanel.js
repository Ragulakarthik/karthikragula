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
        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-[var(--line)] text-[11px] font-bold transition hover:bg-[var(--accent)] hover:text-white"
        aria-label="About progress"
      >
        i
      </button>
      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border-2 border-[var(--line)] bg-white p-4 text-left text-xs leading-relaxed text-[var(--muted)] opacity-0 shadow-[5px_5px_0_0_var(--line)] transition duration-150 group-hover:opacity-100">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--ink)]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--line)] text-[9px]">
            i
          </span>
          About Progress
        </p>
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>
            This represents your{" "}
            <span className="font-bold text-[var(--accent)]">global progress</span> across the
            platform.
          </li>
          <li>
            The ring is <span className="font-bold text-[var(--accent)]">split by category</span>,
            so you can see where it comes from.
          </li>
          <li>
            Videos can be{" "}
            <span className="font-bold text-[var(--accent)]">ticked or unticked</span> anytime —
            nothing is locked in.
          </li>
        </ol>
        <p className="mt-2 text-[var(--ink)]">
          Keep watching to grow your{" "}
          <span className="font-bold text-[var(--accent)]">progress</span>!
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

function SegmentedRing({ segments, total, done, size = 136, radius = 54, strokeWidth = 14 }) {
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const positioned = withOffsets(segments);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative shrink-0">
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-[var(--background)]"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth + 3}
          className="fill-none stroke-[var(--line)]"
          style={{ opacity: 0.15 }}
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
                strokeDasharray={`${Math.max(s.length - 2, 0)} ${circumference}`}
                strokeDashoffset={s.dashoffset}
                className="fill-none transition-all duration-500 ease-out"
              />
            );
          })}
        </g>
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2 - 4}
          className="fill-[var(--surface)] stroke-[var(--line)]"
          strokeWidth="2.5"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-[var(--ink)]">{done}</span>
        <span className="mt-0.5 h-[3px] w-8 bg-[var(--line)]" />
        <span className="mt-0.5 text-xs font-bold text-[var(--muted)]">{total}</span>
      </div>
    </div>
  );
}

function CategoryChip({ emoji, color, label, done, total, delay = 0 }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  return (
    <div
      className="gwk-row-in flex w-16 flex-col items-center gap-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--line)] text-lg"
        style={{ backgroundColor: complete ? COMPLETE_COLOR : color }}
      >
        <span className={complete ? "" : "opacity-90"}>{complete ? "✅" : emoji}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full border border-[var(--line)] bg-[var(--background)]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: complete ? COMPLETE_COLOR : color }}
        />
      </div>
      <span className="max-w-full truncate text-[10px] font-bold leading-tight text-[var(--ink)]">
        {label}
      </span>
      <span
        className={`text-[10px] font-bold ${complete ? "text-emerald-600" : "text-[var(--muted)]"}`}
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
    length: g.done * circumferenceUnit * (2 * Math.PI * 54),
  }));

  return (
    <aside className="w-full lg:pointer-events-none lg:fixed lg:inset-y-0 lg:right-0 lg:z-20 lg:w-80 lg:overflow-y-auto lg:px-4 lg:py-6">
      <div className="gwk-panel-in gwk-brutal pointer-events-auto relative rounded-xl bg-[var(--surface)]">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <span className="font-display inline-flex items-center gap-1.5 rounded-md border-2 border-[var(--line)] bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Your Progress
            </span>
            <InfoTooltip />
          </div>

          <div className="gwk-ring-in flex justify-center">
            <SegmentedRing segments={segments} total={overallTotal} done={overallDone} />
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 border-t-[3px] border-[var(--line)] pt-5">
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

          <p className="text-center text-[11px] font-medium leading-snug text-[var(--muted)]">
            🔒 Saved only in this browser
          </p>
        </div>
      </div>
    </aside>
  );
}
