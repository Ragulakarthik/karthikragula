"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-[var(--line)] bg-[var(--surface)] lg:hidden">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 2xl:px-16">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          <span className="bg-[var(--accent)] px-1 text-white">Karthik</span> Ragula
        </Link>
        {!isHome && (
          <nav className="flex items-center gap-1.5 overflow-x-auto text-sm font-bold sm:gap-2">
            {CATEGORIES.filter((c) => c.inNav).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="whitespace-nowrap rounded-md border-2 border-[var(--line)] px-3 py-1.5 transition hover:bg-[var(--accent)] hover:text-white"
              >
                {c.emoji} {c.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
