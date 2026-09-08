import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import ProgressPanel from "@/components/ProgressPanel";

export default function Home() {
  return (
    <div className="w-full px-4 py-12 sm:px-6 lg:pl-10 lg:pr-0 2xl:pl-16">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 lg:pr-80">
          <section className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need to prep, in one place.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-black/60 dark:text-white/60">
              Interview prep, DSA in Java, resume tips & career advice.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.filter((c) => c.inNav).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-8 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-4xl">{c.emoji}</span>
                <span className="text-lg font-bold">{c.label} Sheet</span>
                <span className="text-sm font-semibold text-red-600">
                  Open Sheet &rarr;
                </span>
              </Link>
            ))}
          </section>
        </div>

        <ProgressPanel />
      </div>
    </div>
  );
}
