import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import ProgressPanel from "@/components/ProgressPanel";

export default function Home() {
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:pl-10 lg:pr-0 2xl:pl-16">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 lg:pr-96">
          <section className="mb-12 text-center">
            <span className="gwk-brutal-sm inline-block rotate-[-1.5deg] rounded-md bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white">
              The Karthik Ragula Archive
            </span>
            <h1 className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Everything you need
              <br />
              to <span className="bg-[var(--accent)] px-2 text-white">prep</span>, in one place.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-medium text-[var(--muted)]">
              Interview prep, DSA in Java, resume tips &amp; career advice.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.filter((c) => c.inNav).map((c) => {
              const Icon = CATEGORY_ICONS[c.id];
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="gwk-brutal group flex flex-col items-center justify-between gap-3 rounded-xl bg-[var(--surface)] p-8 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--line)] text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight">
                      {c.label} Sheet
                    </span>
                  </div>
                  <span className="rounded border-2 border-[var(--line)] bg-[var(--ink)] px-3 py-1 text-sm font-bold text-[var(--surface)] transition group-hover:bg-[var(--accent)] group-hover:text-white">
                    Open Sheet &rarr;
                  </span>
                </Link>
              );
            })}
          </section>
        </div>

        <ProgressPanel />
      </div>
    </div>
  );
}
