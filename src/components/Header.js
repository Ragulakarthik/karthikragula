"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-20 border-b border-black/10 bg-white/80 backdrop-blur lg:hidden dark:border-white/10 dark:bg-black/60">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10 2xl:px-16">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-red-600">Karthik</span> Ragula
        </Link>
        {!isHome && (
          <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium sm:gap-2">
            {CATEGORIES.filter((c) => c.inNav).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-black/5 dark:hover:bg-white/10"
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
