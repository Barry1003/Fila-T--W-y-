'use client';

import { useState } from "react";
import type { ReactNode } from "react";
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
        style={{
          padding: "1.375rem 1.25rem 1.125rem",
          borderBottom: "1px solid rgba(250,246,240,0.1)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            color: C.cream,
            fontSize: "1.05rem",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            marginBottom: "0.5rem",
            lineHeight: 1.1,
          }}
        >
          FTW Console
        </div>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            color: "rgba(212,169,78,0.85)",
            fontSize: "0.7rem",
            textDecorationLine: "none",
            letterSpacing: "0.01em",
          }}
        >
          ← Back to Store
        </Link>
      </div>

      {/* Nav list */}
      <nav
        style={{ flex: 1, padding: "0.625rem 0", overflowY: "auto" }}
        role="navigation"
        aria-label="Console navigation"
      >
        {NAV_ITEMS.map(({ label, to, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavClick}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.575rem 1.25rem",
              color: isActive ? C.cream : "rgba(250,246,240,0.58)",
              textDecorationLine: "none",
              fontSize: "0.8rem",
              fontWeight: isActive ? 500 : 400,
              borderLeft: `3px solid ${isActive ? C.gold : "transparent"}`,
              backgroundColor: isActive ? "rgba(250,246,240,0.09)" : "transparent",
              transition: "color 0.12s, background-color 0.12s",
              lineHeight: 1.3,
            })}
          >
            <span style={{ flexShrink: 0, opacity: 0.9 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Owner profile */}
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderTop: "1px solid rgba(250,246,240,0.1)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: C.gold, color: C.charcoal,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.72rem", fontWeight: 700, flexShrink: 0, letterSpacing: "0.02em",
            }}
          >
            AO
          </div>
          <div>
            <div style={{ color: C.cream, fontSize: "0.78rem", fontWeight: 500, lineHeight: 1.2 }}>
              Adunola Okonkwo
            </div>
            <div style={{ color: "rgba(250,246,240,0.4)", fontSize: "0.66rem", marginTop: "1px" }}>
              Store Owner
            </div>
          </div>
        </div>
        <button
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(250,246,240,0.38)", fontSize: "0.7rem", padding: 0, textAlign: "left",
          }}
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

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: UI,
        backgroundColor: "#EDE9E3",
      }}
    >
      {/* Mobile sidebar overlay */}
      <div
        className="console-sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`console-sidebar${sidebarOpen ? " sidebar-open" : ""}`}
        style={{
          width: 240,
          backgroundColor: C.maroon,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <SidebarContent onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <header
          style={{
            height: 52,
            backgroundColor: "#fff",
            borderBottom: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.75rem",
            flexShrink: 0,
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
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
              style={{
                fontFamily: UI,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: C.charcoal,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            {/* Notifications */}
            <button
              style={{
                background: "none", border: "none", cursor: "pointer",
                position: "relative", padding: "4px",
                color: C.charcoal, opacity: 0.65,
                display: "flex", alignItems: "center",
              }}
              aria-label="Notifications"
            >
              <BellIcon size={18} />
              <span
                style={{
                  position: "absolute", top: 0, right: 0,
                  width: 15, height: 15,
                  backgroundColor: C.maroon, color: "#fff",
                  borderRadius: "50%", fontSize: "0.53rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
                }}
              >
                4
              </span>
            </button>

            {/* Avatar */}
            <div
              style={{
                width: 30, height: 30, borderRadius: "50%",
                backgroundColor: C.gold, color: C.charcoal,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em",
              }}
            >
              AO
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", backgroundColor: "#EDE9E3" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
