'use client';

import { useState } from "react";
import { C, UI } from "../../tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "codes" | "banners";

interface DiscountCode {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: string;
  usedCount: number;
  limitCount: number | null;
  active: boolean;
  expiry: string;
  expired: boolean;
}

interface Banner {
  id: string;
  text: string;
  cta: string;
  dateRange: string;
  status: "Live" | "Scheduled" | "Expired";
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INIT_CODES: DiscountCode[] = [
  { id: "1", code: "WELCOME10", type: "Percentage", value: "10%", usedCount: 42, limitCount: 200, active: true, expiry: "31 Dec 2026", expired: false },
  { id: "2", code: "FREESHIP25", type: "Fixed Amount", value: "£25", usedCount: 18, limitCount: 100, active: true, expiry: "15 Oct 2026", expired: false },
  { id: "3", code: "GELE15", type: "Percentage", value: "15%", usedCount: 7, limitCount: 50, active: false, expiry: "30 Sep 2026", expired: false },
  { id: "4", code: "ASOKEVIP", type: "Percentage", value: "20%", usedCount: 89, limitCount: 150, active: true, expiry: "01 Jan 2027", expired: false },
  { id: "5", code: "NEWCUSTOMER", type: "Fixed Amount", value: "£15", usedCount: 203, limitCount: null, active: false, expiry: "Expired", expired: true },
];

const INIT_BANNERS: Banner[] = [
  { id: "1", text: "Free UK shipping on all orders over £150 — use code FREESHIP25", cta: "Shop Now", dateRange: "01 Sep 2026 – 30 Sep 2026", status: "Live" },
  { id: "2", text: "New Aso-Oke collection dropping 15 Oct — early access for newsletter subscribers", cta: "Sign up", dateRange: "10 Oct 2026 – 30 Oct 2026", status: "Scheduled" },
  { id: "3", text: "Summer sale: 15% off everything with SUMMER15", cta: "", dateRange: "01 Jun 2026 – 31 Aug 2026", status: "Expired" },
];

const CATEGORIES = ["Aso-Oke", "Filà / Caps", "Gele Sets", "Adire", "Custom Orders", "Accessories"];

const BANNER_STATUS_STYLES = {
  Live: { bg: "rgba(59,138,147,0.12)", color: C.teal },
  Scheduled: { bg: "rgba(46,74,158,0.1)", color: "#2E4A9E" },
  Expired: { bg: "rgba(43,35,32,0.07)", color: "rgba(43,35,32,0.4)" },
};

// ── Shared sub-components ─────────────────────────────────────────────────────

function BannerStatusBadge({ status }: { status: "Live" | "Scheduled" | "Expired" }) {
  const s = BANNER_STATUS_STYLES[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 100,
        fontSize: "0.68rem",
        fontWeight: 500,
        backgroundColor: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
        fontFamily: UI,
      }}
    >
      {status}
    </span>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={active}
      style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: UI }}
    >
      <span
        style={{
          display: "inline-flex",
          width: 32,
          height: 18,
          borderRadius: 100,
          backgroundColor: active ? C.gold : "rgba(43,35,32,0.18)",
          alignItems: "center",
          padding: "0 2px",
          transition: "background-color 0.18s",
          position: "relative",
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#fff",
            transform: `translateX(${active ? 14 : 0}px)`,
            transition: "transform 0.18s",
            display: "block",
          }}
        />
      </span>
      <span style={{ fontSize: "0.72rem", color: active ? "#8A6818" : "rgba(43,35,32,0.45)", fontWeight: 500 }}>
        {active ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (!limit) {
    return (
      <span style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.55)" }}>
        {used} used · unlimited
      </span>
    );
  }
  const pct = Math.min((used / limit) * 100, 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 90 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.7)", fontWeight: 500 }}>
          {used}/{limit}
        </span>
        <span style={{ fontSize: "0.65rem", color: "rgba(43,35,32,0.4)" }}>used</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(43,35,32,0.1)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 2,
            backgroundColor: pct > 90 ? C.maroon : C.gold,
          }}
        />
      </div>
    </div>
  );
}

function EmptyState({ label, onAction, actionLabel }: { label: string; onAction: () => void; actionLabel: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "rgba(212,169,78,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.35rem",
          color: C.gold,
        }}
      >
        %
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: C.charcoal, fontFamily: UI }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", marginTop: 4, fontFamily: UI }}>
          Get started by creating your first promotion
        </div>
      </div>
      <button onClick={onAction} style={{ backgroundColor: C.gold, color: C.charcoal, border: "none", borderRadius: 6, padding: "0.55rem 1.125rem", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: UI }}>
        {actionLabel}
      </button>
    </div>
  );
}

// ── Discount codes table ──────────────────────────────────────────────────────

function DiscountTable({
  codes,
  onToggle,
  onDelete,
}: {
  codes: DiscountCode[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Code", "Type", "Value", "Usage", "Status", "Expiry", ""].map((h) => (
              <th
                key={h}
                style={{
                  padding: "0.625rem 1.25rem",
                  textAlign: "left",
                  fontSize: "0.62rem",
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "rgba(43,35,32,0.38)",
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(43,35,32,0.06)",
                  whiteSpace: "nowrap",
                  fontFamily: UI,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {codes.map((c, i) => (
            <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.018)" }}>
              <td style={{ padding: "0.75rem 1.25rem" }}>
                <span
                  style={{
                    fontFamily: UI,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: C.charcoal,
                    backgroundColor: "rgba(43,35,32,0.05)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  {c.code}
                </span>
              </td>
              <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.77rem", color: "rgba(43,35,32,0.6)" }}>
                {c.type}
              </td>
              <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.82rem", fontWeight: 600, color: C.charcoal }}>
                {c.value}
              </td>
              <td style={{ padding: "0.75rem 1.25rem" }}>
                <UsageBar used={c.usedCount} limit={c.limitCount} />
              </td>
              <td style={{ padding: "0.75rem 1.25rem" }}>
                <Toggle
                  active={c.active && !c.expired}
                  onChange={() => { if (!c.expired) onToggle(c.id); }}
                />
              </td>
              <td
                style={{
                  padding: "0.75rem 1.25rem",
                  fontSize: "0.77rem",
                  color: c.expired ? C.maroon : "rgba(43,35,32,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.expiry}
              </td>
              <td style={{ padding: "0.75rem 1.25rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    style={{
                      background: "none",
                      border: "1px solid rgba(43,35,32,0.14)",
                      borderRadius: 4,
                      padding: "3px 10px",
                      fontSize: "0.7rem",
                      color: "rgba(43,35,32,0.6)",
                      cursor: "pointer",
                      fontFamily: UI,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    style={{
                      background: "none",
                      border: "1px solid rgba(122,46,56,0.2)",
                      borderRadius: 4,
                      padding: "3px 10px",
                      fontSize: "0.7rem",
                      color: C.maroon,
                      cursor: "pointer",
                      fontFamily: UI,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Homepage banners tab ──────────────────────────────────────────────────────

function BannersTab({ onAdd }: { onAdd: () => void }) {
  const [banners, setBanners] = useState<Banner[]>(INIT_BANNERS);

  if (banners.length === 0) {
    return <EmptyState label="No active banners" onAction={onAdd} actionLabel="+ Add Banner" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {banners.map((b) => (
        <div
          key={b.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            border: "1px solid rgba(43,35,32,0.07)",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.25rem",
          }}
        >
          {/* Mini strip preview */}
          <div
            style={{
              flexShrink: 0,
              width: 200,
              borderRadius: 5,
              overflow: "hidden",
              border: "1px solid rgba(43,35,32,0.1)",
            }}
          >
            <div style={{ backgroundColor: C.maroon, padding: "6px 10px" }}>
              <p
                style={{
                  color: C.cream,
                  fontSize: "0.6rem",
                  fontFamily: UI,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {b.text.length > 60 ? b.text.slice(0, 60) + "…" : b.text}
              </p>
              {b.cta && (
                <span
                  style={{
                    color: C.gold,
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    textDecorationLine: "underline",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {b.cta} →
                </span>
              )}
            </div>
            <div
              style={{
                backgroundColor: C.charcoal,
                padding: "5px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: C.cream, fontSize: "0.55rem", fontFamily: UI, opacity: 0.8 }}>
                Fila Tó Wúyì
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {["Shop", "About"].map((l) => (
                  <span key={l} style={{ color: "rgba(250,246,240,0.45)", fontSize: "0.5rem" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.84rem",
                fontWeight: 500,
                color: C.charcoal,
                lineHeight: 1.4,
                margin: "0 0 0.375rem",
                fontFamily: UI,
              }}
            >
              {b.text}
            </p>
            {b.cta && (
              <p style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.48)", margin: "0 0 0.375rem", fontFamily: UI }}>
                CTA: <span style={{ color: C.charcoal, fontWeight: 500 }}>{b.cta}</span>
              </p>
            )}
            <p style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", margin: 0, fontFamily: UI }}>
              {b.dateRange}
            </p>
          </div>

          {/* Status + actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", flexShrink: 0 }}>
            <BannerStatusBadge status={b.status} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                style={{
                  background: "none",
                  border: "1px solid rgba(43,35,32,0.14)",
                  borderRadius: 4,
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  color: "rgba(43,35,32,0.6)",
                  cursor: "pointer",
                  fontFamily: UI,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => setBanners((prev) => prev.filter((x) => x.id !== b.id))}
                style={{
                  background: "none",
                  border: "1px solid rgba(122,46,56,0.2)",
                  borderRadius: 4,
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  color: C.maroon,
                  cursor: "pointer",
                  fontFamily: UI,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create Discount Code slide-over ───────────────────────────────────────────

function generateCode(): string {
  const prefixes = ["SAVE", "FTW", "STYLE", "GIFT", "GELE", "ASO"];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = Math.floor(Math.random() * 30) + 5;
  return `${p}${n}`;
}

function CreateCodePanel({ onClose }: { onClose: () => void }) {
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [code, setCode] = useState("");
  const [appliesTo, setAppliesTo] = useState<"all" | "categories">("all");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(43,35,32,0.38)" }} />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          backgroundColor: "#fff",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: UI,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: C.charcoal }}>Create Discount Code</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", marginTop: 2 }}>
              Set up a new promotional code for your store
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.35rem", color: "rgba(43,35,32,0.4)", lineHeight: 1, padding: "0 0 0 8px" }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* ── Group 1: Basics */}
          <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
              Basics
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                Code Name
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  style={{
                    flex: 1,
                    padding: "0.5rem 0.75rem",
                    border: "1px solid rgba(43,35,32,0.18)",
                    borderRadius: 6,
                    fontSize: "0.82rem",
                    fontFamily: UI,
                    color: C.charcoal,
                    outline: "none",
                    letterSpacing: "0.05em",
                    backgroundColor: "#fff",
                  }}
                />
                <button
                  onClick={() => setCode(generateCode())}
                  style={{
                    padding: "0.5rem 0.875rem",
                    border: "1px solid rgba(43,35,32,0.16)",
                    borderRadius: 6,
                    background: "rgba(43,35,32,0.04)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: C.charcoal,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: UI,
                  }}
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.5rem" }}>
                Discount Type
              </label>
              <div style={{ display: "flex", gap: "1.25rem" }}>
                {(["Percentage", "Fixed Amount"] as const).map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="discountType"
                      value={t}
                      checked={discountType === t}
                      onChange={() => setDiscountType(t)}
                      style={{ accentColor: C.gold, width: 14, height: 14 }}
                    />
                    <span style={{ fontSize: "0.8rem", color: C.charcoal }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div style={{ height: 1, backgroundColor: "rgba(43,35,32,0.07)" }} />

          {/* ── Group 2: Value & Limits */}
          <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
              Value & Limits
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                  {discountType === "Percentage" ? "Percentage (%)" : "Amount (£)"}
                </label>
                <input
                  type="number"
                  placeholder={discountType === "Percentage" ? "10" : "25.00"}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                  Min. Order Value <OptLabel />
                </label>
                <input
                  type="number"
                  placeholder="£0.00"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                  Usage Limit <OptLabel />
                </label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
                />
              </div>
            </div>
          </section>

          <div style={{ height: 1, backgroundColor: "rgba(43,35,32,0.07)" }} />

          {/* ── Group 3: Scope & Dates */}
          <section style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
              Scope & Dates
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.5rem" }}>
                Applies To
              </label>
              <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.75rem" }}>
                {(["all", "categories"] as const).map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="appliesTo"
                      value={t}
                      checked={appliesTo === t}
                      onChange={() => setAppliesTo(t)}
                      style={{ accentColor: C.gold, width: 14, height: 14 }}
                    />
                    <span style={{ fontSize: "0.8rem", color: C.charcoal }}>
                      {t === "all" ? "All products" : "Specific categories"}
                    </span>
                  </label>
                ))}
              </div>
              {appliesTo === "categories" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {CATEGORIES.map((cat) => {
                    const sel = selectedCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCat(cat)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 100,
                          border: `1px solid ${sel ? C.gold : "rgba(43,35,32,0.18)"}`,
                          backgroundColor: sel ? "rgba(212,169,78,0.12)" : "transparent",
                          color: sel ? "#8A6818" : "rgba(43,35,32,0.65)",
                          fontSize: "0.75rem",
                          fontWeight: sel ? 500 : 400,
                          cursor: "pointer",
                          fontFamily: UI,
                          transition: "all 0.12s",
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>Start Date</label>
                <input type="date" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>End Date</label>
                <input type="date" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }} />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{ padding: "0.5rem 1.25rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, background: "transparent", fontSize: "0.82rem", color: "rgba(43,35,32,0.65)", cursor: "pointer", fontFamily: UI }}
          >
            Cancel
          </button>
          <button
            style={{ padding: "0.5rem 1.5rem", border: "none", borderRadius: 6, backgroundColor: C.gold, color: C.charcoal, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: UI }}
          >
            Create Code
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Banner slide-over ───────────────────────────────────────────────────

function CreateBannerPanel({ onClose }: { onClose: () => void }) {
  const [bannerText, setBannerText] = useState("");
  const [bannerCTA, setBannerCTA] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(43,35,32,0.38)" }} />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          backgroundColor: "#fff",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: UI,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: C.charcoal }}>Add Homepage Banner</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", marginTop: 2 }}>
              Configure a promotional strip for the buyer-facing site
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.35rem", color: "rgba(43,35,32,0.4)", lineHeight: 1, padding: "0 0 0 8px" }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
              Banner Text
            </label>
            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. Free UK shipping on all orders over £150 · Use code FREESHIP25"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid rgba(43,35,32,0.18)",
                borderRadius: 6,
                fontSize: "0.82rem",
                fontFamily: UI,
                color: C.charcoal,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.5,
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
              CTA / Link Text <OptLabel />
            </label>
            <input
              value={bannerCTA}
              onChange={(e) => setBannerCTA(e.target.value)}
              placeholder="e.g. Shop Now"
              style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>Start Date</label>
              <input type="date" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>End Date</label>
              <input type="date" style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, fontSize: "0.82rem", fontFamily: UI, color: C.charcoal, outline: "none", boxSizing: "border-box", backgroundColor: "#fff" }} />
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: "0.625rem" }}>
              Live Preview
            </div>
            <div
              style={{
                border: "1px solid rgba(43,35,32,0.12)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* Fake browser chrome */}
              <div
                style={{
                  backgroundColor: "#f0eeeb",
                  padding: "6px 10px",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(43,35,32,0.1)",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#E88", opacity: 0.7 }} />
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#DB5", opacity: 0.7 }} />
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#8C8", opacity: 0.7 }} />
                <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: 3, height: 11, marginLeft: 6, opacity: 0.8 }} />
              </div>
              {/* Promo strip */}
              <div
                style={{
                  backgroundColor: C.maroon,
                  padding: "7px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: C.cream, fontSize: "0.7rem", fontFamily: UI, textAlign: "center", lineHeight: 1.4 }}>
                  {bannerText || <span style={{ opacity: 0.45, fontStyle: "italic" }}>Your banner text will appear here</span>}
                </span>
                {(bannerCTA || bannerText) && (
                  <span style={{ color: C.gold, fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap", textDecorationLine: "underline" }}>
                    {bannerCTA || "Learn more"} →
                  </span>
                )}
              </div>
              {/* Fake nav */}
              <div
                style={{
                  backgroundColor: C.charcoal,
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: C.cream, fontSize: "0.66rem", fontFamily: UI, opacity: 0.85 }}>
                  Fila Tó Wúyì
                </span>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["Shop", "Lookbook", "About"].map((l) => (
                    <span key={l} style={{ color: "rgba(250,246,240,0.48)", fontSize: "0.58rem" }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{ padding: "0.5rem 1.25rem", border: "1px solid rgba(43,35,32,0.18)", borderRadius: 6, background: "transparent", fontSize: "0.82rem", color: "rgba(43,35,32,0.65)", cursor: "pointer", fontFamily: UI }}
          >
            Cancel
          </button>
          <button
            style={{ padding: "0.5rem 1.5rem", border: "none", borderRadius: 6, backgroundColor: C.gold, color: C.charcoal, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: UI }}
          >
            Add Banner
          </button>
        </div>
      </div>
    </div>
  );
}

function OptLabel() {
  return <span style={{ color: "rgba(43,35,32,0.35)", fontWeight: 400 }}>(optional)</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConsolePromotions() {
  const [tab, setTab] = useState<Tab>("codes");
  const [codes, setCodes] = useState<DiscountCode[]>(INIT_CODES);
  const [showPanel, setShowPanel] = useState(false);

  const toggleCode = (id: string) =>
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const deleteCode = (id: string) =>
    setCodes((prev) => prev.filter((c) => c.id !== id));

  const TAB_LABELS: Record<Tab, string> = { codes: "Discount Codes", banners: "Homepage Banners" };

  return (
    <div style={{ padding: "1.75rem", fontFamily: UI }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: UI,
              fontSize: "1.35rem",
              fontWeight: 600,
              color: C.charcoal,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Promotions & Discounts
          </h1>
          <p style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", margin: "4px 0 0" }}>
            Manage discount codes and homepage promotional banners
          </p>
        </div>
        <button
          onClick={() => setShowPanel(true)}
          style={{
            backgroundColor: C.gold,
            color: C.charcoal,
            border: "none",
            borderRadius: 6,
            padding: "0.575rem 1.125rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontFamily: UI,
            letterSpacing: "0.01em",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>+</span>
          {tab === "codes" ? "Create Promotion" : "Add Banner"}
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(43,35,32,0.1)",
          marginBottom: "1.25rem",
        }}
      >
        {(["codes", "banners"] as Tab[]).map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? C.gold : "transparent"}`,
                padding: "0.5rem 1.125rem",
                marginBottom: "-1px",
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.charcoal : "rgba(43,35,32,0.48)",
                cursor: "pointer",
                fontFamily: UI,
                transition: "color 0.12s",
                whiteSpace: "nowrap",
              }}
            >
              {TAB_LABELS[t]}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "codes" &&
        (codes.length === 0 ? (
          <EmptyState label="No active promotions" onAction={() => setShowPanel(true)} actionLabel="+ Create Promotion" />
        ) : (
          <DiscountTable codes={codes} onToggle={toggleCode} onDelete={deleteCode} />
        ))}
      {tab === "banners" && <BannersTab onAdd={() => setShowPanel(true)} />}

      {/* Slide-over panels */}
      {showPanel && tab === "codes" && <CreateCodePanel onClose={() => setShowPanel(false)} />}
      {showPanel && tab === "banners" && <CreateBannerPanel onClose={() => setShowPanel(false)} />}
    </div>
  );
}
