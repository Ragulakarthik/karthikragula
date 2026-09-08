"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

const STORAGE_KEY = "gwk-sidebar-collapsed";

export default function SidebarShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCollapsed(raw === "1");
    } catch {
      // ignore unavailable storage
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore unavailable storage
      }
      return next;
    });
  }

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={`flex min-h-full flex-1 flex-col transition-[padding] duration-200 ${
          collapsed ? "lg:pl-16" : "lg:pl-56"
        }`}
      >
        {children}
      </div>
    </>
  );
}
