'use client';

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useOverlay } from "@/lib/useOverlay";
import { NavLink, Link, useLocation } from '@/lib/router';
import { C, DISPLAY, UI } from "../tokens";
import {
  GridIcon,
  TagIcon,
  PackageIcon,
  PenIcon,
  PercentIcon,
  BarChartIcon,
  MessageIcon,
  StarIcon,
  SettingsIcon,
  BellIcon,
} from "../icons";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/console", icon: <GridIcon size={15} />, end: true },
  { label: "Products", to: "/console/products", icon: <TagIcon size={15} /> },
  { label: "Orders", to: "/console/orders", icon: <PackageIcon size={15} /> },
  { label: "Custom Order Requests", to: "/console/custom-orders", icon: <PenIcon size={15} /> },
  { label: "Promotions", to: "/console/promotions", icon: <PercentIcon size={15} /> },
  { label: "Analytics", to: "/console/analytics", icon: <BarChartIcon size={15} /> },
  { label: "Messages", to: "/console/messages", icon: <MessageIcon size={15} /> },
  { label: "Reviews", to: "/console/reviews", icon: <StarIcon size={15} /> },
  { label: "Store Settings", to: "/console/settings", icon: <SettingsIcon size={15} /> },
];

function usePageTitle() {
  const { pathname } = useLocation();
  const segment = pathname.replace("/console", "").replace(/^\//, "") || "dashboard";
  return segment
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Sidebar inner content (shared between desktop & mobile) ──────────────────

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      {/* Wordmark + back link */}
      <div
        className="pt-[1.375rem] px-5 pb-[1.125rem] shrink-0"
        style={{ borderBottom: "1px solid rgba(250,246,240,0.1)" }}
      >
        <div
          className="mb-2"
          style={{
            fontFamily: DISPLAY,
            color: C.cream,
            fontSize: "1.05rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          FTW Console
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-[4px] no-underline"
          style={{ color: "rgba(212,169,78,0.85)", fontSize: "0.7rem", letterSpacing: "0.01em" }}
        >
          ← Back to Store
        </Link>
      </div>

      {/* Nav list */}
      <nav
        className="flex-1 py-2.5 overflow-y-auto"
        role="navigation"
        aria-label="Console navigation"
      >
        {NAV_ITEMS.map(({ label, to, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavClick}
            className="flex items-center gap-[0.6rem] py-[0.575rem] px-5 no-underline"
            style={({ isActive }) => ({
              color: isActive ? C.cream : "rgba(250,246,240,0.58)",
              fontSize: "0.8rem",
              fontWeight: isActive ? 500 : 400,
              borderLeft: `3px solid ${isActive ? C.gold : "transparent"}`,
              backgroundColor: isActive ? "rgba(250,246,240,0.09)" : "transparent",
              transition: "color 0.12s, background-color 0.12s",
              lineHeight: 1.3,
            })}
          >
            <span className="shrink-0 opacity-90">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Owner profile */}
      <div
        className="py-3.5 px-5 shrink-0"
        style={{ borderTop: "1px solid rgba(250,246,240,0.1)" }}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.gold, color: C.charcoal, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.02em" }}
          >
            AO
          </div>
          <div>
            <div style={{ color: C.cream, fontSize: "0.78rem", fontWeight: 500, lineHeight: 1.2 }}>
              Adunola Okonkwo
            </div>
            <div className="mt-[1px]" style={{ color: "rgba(250,246,240,0.4)", fontSize: "0.66rem" }}>
              Store Owner
            </div>
          </div>
        </div>
        <button
          className="p-0 cursor-pointer text-left"
          style={{ background: "none", border: "none", color: "rgba(250,246,240,0.38)", fontSize: "0.7rem" }}
        >
          Log Out
        </button>
      </div>
    </>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────

export default function ConsoleShell({ children }: { children: ReactNode }) {
  const title = usePageTitle();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useOverlay(sidebarOpen, closeSidebar);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: UI, backgroundColor: "#EDE9E3" }}>
      {/* Mobile sidebar overlay — only while the sidebar is actually open */}
      {sidebarOpen && (
        <div className="console-sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`console-sidebar${sidebarOpen ? " sidebar-open" : ""} w-60 flex flex-col shrink-0 overflow-hidden`}
        style={{ backgroundColor: C.maroon }}
      >
        <SidebarContent onNavClick={closeSidebar} />
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header
          className="h-13 flex items-center justify-between px-7 shrink-0 gap-3"
          style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(43,35,32,0.08)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="console-hamburger"
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Open navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <span
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ fontFamily: UI, fontSize: "0.95rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.01em" }}
            >
              {title}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Notifications */}
            <button
              className="relative flex items-center cursor-pointer p-[4px]"
              style={{ background: "none", border: "none", color: C.charcoal, opacity: 0.65 }}
              aria-label="Notifications"
            >
              <BellIcon size={18} />
              <span
                className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: C.maroon, color: "#fff", fontSize: "0.53rem", fontWeight: 700, lineHeight: 1 }}
              >
                4
              </span>
            </button>

            {/* Avatar */}
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: C.gold, color: C.charcoal, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.02em" }}
            >
              AO
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#EDE9E3" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
