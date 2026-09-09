"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_ICONS, HomeIcon } from "@/components/CategoryIcons";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  ...CATEGORIES.filter((c) => c.inNav).map((c) => ({
    href: `/category/${c.id}`,
    label: c.label,
    Icon: CATEGORY_ICONS[c.id],
  })),
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r-[3px] border-[var(--line)] bg-[var(--surface)] p-3 transition-[width] duration-200 lg:flex ${
        collapsed ? "w-16 items-center" : "w-56"
      }`}
    >
      <div
        className={`mb-6 flex w-full items-center ${collapsed ? "justify-center" : "justify-between"} px-1`}
      >
        {!collapsed && (
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            <span className="bg-[var(--accent)] px-1 text-white">Karthik</span> Ragula
          </Link>
        )}
        <div className={`flex items-center gap-2 ${collapsed ? "mt-2 flex-col" : ""}`}>
          <ThemeToggle />
          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-[var(--line)] text-base font-bold transition hover:bg-[var(--accent)] hover:text-white"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
      </div>
      <nav className="flex w-full flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-2 rounded-md border-2 py-2 text-sm font-bold transition ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                active
                  ? "border-[var(--line)] bg-[var(--accent)] text-white shadow-[3px_3px_0_0_var(--line)]"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--background)]"
              }`}
            >
              <item.Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
