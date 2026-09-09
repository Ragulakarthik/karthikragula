"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { getAllVideos, getVideosByCategory } from "@/lib/videos";

const allVideos = getAllVideos();

const categoryGroups = CATEGORIES.filter((c) => c.inNav).map((c) => ({
  id: c.id,
  label: c.label,
  Icon: CATEGORY_ICONS[c.id],
  color: c.color,
  videos: getVideosByCategory(c.id),
}));

const COMPLETE_COLOR = "#16a34a";

const STATUS_STEPS = [
  { min: 100, text: "All done! 🏆" },
  { min: 75, text: "Almost there" },
  { min: 50, text: "Halfway there" },
  { min: 25, text: "Making progress" },
  { min: 1, text: "Just getting started" },
  { min: 0, text: "Let's get started" },
];

function statusFor(pct) {
  return STATUS_STEPS.find((s) => pct >= s.min).text;
}

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
      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border-2 border-[var(--line)] bg-[var(--surface)] p-4 text-left text-xs leading-relaxed text-[var(--muted)] opacity-0 shadow-[5px_5px_0_0_var(--line)] transition duration-150 group-hover:opacity-100">
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
            <span className="font-bold text-[var(--accent)]">ticked or unticked</span> anytime,
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

function StatMeter({ segments, total, done }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const visible = segments.filter((s) => s.pct > 0.4);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-col items-center">
        <span className="font-display leading-none text-[var(--ink)]">
          <span className="text-6xl font-bold tabular-nums">{pct}</span>
          <span className="text-2xl font-bold">%</span>
        </span>
        <span className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
          {done} / {total} watched
        </span>
      </div>

      <div className="gwk-brutal-sm flex h-8 w-full overflow-hidden rounded-md bg-[var(--background)]">
        {visible.map((s) => (
          <div
            key={s.key}
            className="h-full border-r-2 border-[var(--line)] transition-all duration-500"
            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ id, Icon, color, label, done, total, delay = 0 }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  return (
    <Link
      href={`/category/${id}`}
      className="gwk-row-in group -mx-2 flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-[var(--background)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--line)] text-white transition-transform group-hover:scale-110 ${
          complete ? "gwk-complete-pulse" : ""
        }`}
        style={{ backgroundColor: color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-bold text-[var(--ink)] group-hover:underline">
            {label}
          </span>
          <span
            className={`shrink-0 text-[11px] font-bold ${complete ? "text-emerald-600" : "text-[var(--muted)]"}`}
          >
            {done}/{total}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]/12">
          <div
            className="h-full min-w-[3px] rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: complete ? COMPLETE_COLOR : color }}
          />
        </div>
      </div>
      <span className="shrink-0 -translate-x-1 text-sm font-bold text-[var(--muted)] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
        →
      </span>
    </Link>
  );
}

export default function ProgressPanel() {
  const { completed, hydrated } = useProgress();

  const overallTotal = allVideos.length;
  const overallDone = hydrated ? allVideos.filter((v) => completed.has(v.id)).length : 0;
  const overallPct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

  const groupStats = categoryGroups.map((g) => ({
    ...g,
    done: hydrated ? g.videos.filter((v) => completed.has(v.id)).length : 0,
  }));

  const segments = groupStats.map((g) => ({
    key: g.label,
    color: g.color,
    pct: overallTotal ? (g.done / overallTotal) * 100 : 0,
  }));

  return (
    <aside className="w-full lg:pointer-events-none lg:fixed lg:inset-y-0 lg:right-0 lg:z-20 lg:w-80 lg:overflow-y-auto lg:px-4 lg:py-6">
      <div className="gwk-panel-in gwk-brutal pointer-events-auto relative rounded-xl bg-[var(--surface)]">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <span className="font-display gwk-brutal-sm inline-flex -rotate-2 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Your Progress
            </span>
            <InfoTooltip />
          </div>

          <div className="gwk-ring-in flex flex-col items-center gap-4 py-1">
            <StatMeter segments={segments} total={overallTotal} done={overallDone} />
            <span
              className={`gwk-brutal-sm rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                overallPct >= 100 ? "bg-emerald-500 text-white" : "bg-[var(--background)] text-[var(--ink)]"
              }`}
            >
              {statusFor(overallPct)}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-t-[3px] border-[var(--line)] pt-5">
            {groupStats.map((g, i) => (
              <CategoryRow
                key={g.label}
                id={g.id}
                Icon={g.Icon}
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
