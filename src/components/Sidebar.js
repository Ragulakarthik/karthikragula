"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

const NAV_ITEMS = [
  { href: "/", label: "Home", emoji: "🏠" },
  ...CATEGORIES.filter((c) => c.inNav).map((c) => ({
    href: `/category/${c.id}`,
    label: c.label,
    emoji: c.emoji,
  })),
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-black/10 bg-white p-3 transition-[width] duration-200 lg:flex dark:border-white/10 dark:bg-black/40 ${
        collapsed ? "w-16 items-center" : "w-56"
      }`}
    >
      <div className={`mb-6 flex w-full items-center ${collapsed ? "justify-center" : "justify-between"} px-1`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-red-600">Karthik</span> Ragula
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base font-bold hover:bg-black/5 dark:hover:bg-white/10"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="flex w-full flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${active ? "bg-red-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
