'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
import { C, UI } from "../../tokens";
import type { ConsoleProduct } from "@/server/catalogue";

/** Out of stock is derived, never stored, so it cannot contradict the count. */
type Status = "published" | "draft" | "outofstock";

function statusOf(p: ConsoleProduct): Status {
  if (p.status === "DRAFT") return "draft";
  return p.stock === 0 ? "outofstock" : "published";
}
import { TagIcon, PenIcon, GridIcon } from "../../icons";

// ── Icons ─────────────────────────────────────────────────────────────────────

function DuplicateIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function TrashIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function ChevronIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchInputIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const STATUSES = ["All Status", "Published", "Draft", "Out of Stock"];
const SORTS = ["Newest", "Name A–Z", "Price ↑", "Stock Level"];

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP: Record<Status, { label: string; bg: string; color: string }> = {
  published: { label: "Published", bg: "rgba(59,138,147,0.12)", color: C.teal },
  draft: { label: "Draft", bg: "rgba(43,35,32,0.07)", color: "rgba(43,35,32,0.5)" },
  outofstock: { label: "Out of Stock", bg: "rgba(122,46,56,0.1)", color: C.maroon },
};

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_MAP[status];
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 100,
      fontSize: "0.67rem",
      fontWeight: 500,
      backgroundColor: s.bg,
      color: s.color,
      whiteSpace: "nowrap",
      fontFamily: UI,
      letterSpacing: "0.01em",
    }}>
      {s.label}
    </span>
  );
}

// ── Product thumbnail placeholder ─────────────────────────────────────────────

// ── Select / Input helpers ────────────────────────────────────────────────────

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontFamily: UI,
          fontSize: "0.78rem",
          color: C.charcoal,
          backgroundColor: "#fff",
          border: "1px solid rgba(43,35,32,0.14)",
          borderRadius: 6,
          padding: "0.45rem 2rem 0.45rem 0.75rem",
          appearance: "none",
          cursor: "pointer",
          outline: "none",
          minWidth: 140,
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: "absolute", right: "0.5rem", pointerEvents: "none", color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
        <ChevronIcon />
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConsoleProducts({ products, categories }: { products: ConsoleProduct[]; categories: string[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [sort, setSort] = useState("Newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const CATEGORIES = ["All Categories", ...categories];

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = category === "All Categories" || p.category === category;
    const derived = statusOf(p);
    const matchStatus = status === "All Status" ||
      (status === "Published" && derived === "published") ||
      (status === "Draft" && derived === "draft") ||
      (status === "Out of Stock" && derived === "outofstock");
    return matchSearch && matchCat && matchStatus;
  }).sort((a, b) => {
    if (sort === "Name A–Z") return a.title.localeCompare(b.title);
    if (sort === "Price ↑") return a.priceCad - b.priceCad;
    if (sort === "Stock Level") return a.stock - b.stock;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const allOnPageSelected = paginated.length > 0 && paginated.every(p => selected.has(p.id));

  function toggleAll() {
    if (allOnPageSelected) {
      const next = new Set(selected);
      paginated.forEach(p => next.delete(p.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      paginated.forEach(p => next.add(p.id));
      setSelected(next);
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  const hasBulk = selected.size > 0;

  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI, minHeight: "100%" }}>

      {/* ── Top action row ────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.4)", marginBottom: "0.2rem" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.02em", margin: 0 }}>
            Products
          </h1>
        </div>
        <Link
          to="/console/products/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: C.gold,
            color: C.charcoal,
            border: "none",
            borderRadius: 7,
            padding: "0.55rem 1.125rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            textDecorationLine: "none",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>+</span>
          Add Product
        </Link>
      </div>

      {/* ── Filters row ───────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        padding: "0.875rem 1.125rem",
        marginBottom: "1rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <span style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "rgba(43,35,32,0.35)", lineHeight: 0 }}>
            <SearchInputIcon />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              fontFamily: UI,
              fontSize: "0.78rem",
              color: C.charcoal,
              backgroundColor: "rgba(43,35,32,0.03)",
              border: "1px solid rgba(43,35,32,0.12)",
              borderRadius: 6,
              padding: "0.45rem 0.75rem 0.45rem 2.1rem",
              width: "100%",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <SelectField value={category} onChange={v => { setCategory(v); setPage(1); }} options={CATEGORIES} />
        <SelectField value={status} onChange={v => { setStatus(v); setPage(1); }} options={STATUSES} />

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.4)", whiteSpace: "nowrap" }}>Sort:</span>
          <SelectField value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>

      {/* ── Bulk action bar ───────────────────────────────── */}
      {hasBulk && (
        <div style={{
          backgroundColor: C.charcoal,
          borderRadius: 7,
          padding: "0.6rem 1.125rem",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>
          <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 500 }}>
            {selected.size} item{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div style={{ flex: 1 }} />
          {["Publish", "Unpublish", "Delete"].map(action => (
            <button
              key={action}
              onClick={() => setSelected(new Set())}
              style={{
                fontFamily: UI,
                fontSize: "0.72rem",
                fontWeight: 500,
                color: action === "Delete" ? "#f87171" : "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 5,
                padding: "0.35rem 0.875rem",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              {action}
            </button>
          ))}
          <button
            onClick={() => setSelected(new Set())}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "0.72rem",
              padding: 0,
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        overflow: "hidden",
      }}>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="table-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(43,35,32,0.07)" }}>
                    <th style={thStyle}>
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleAll}
                        style={{ accentColor: C.maroon, cursor: "pointer" }}
                      />
                    </th>
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, i) => {
                    const isSelected = selected.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(212,169,78,0.06)"
                            : i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.015)",
                          transition: "background-color 0.1s",
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(212,169,78,0.04)";
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.015)";
                        }}
                      >
                        {/* Checkbox */}
                        <td style={tdCentered}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(p.id)}
                            style={{ accentColor: C.maroon, cursor: "pointer" }}
                          />
                        </td>

                        {/* Product */}
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img
                              src={p.imageUrl}
                              alt=""
                              width={38}
                              height={38}
                              style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 5, flexShrink: 0 }}
                            />
                            <div>
                              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.charcoal, lineHeight: 1.2 }}>
                                {p.title}
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "rgba(43,35,32,0.4)", marginTop: "2px" }}>
                                #{p.id.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={td}>
                          <span style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.65)" }}>{p.category}</span>
                        </td>

                        {/* Price */}
                        <td style={td}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.charcoal }}>CAD ${p.priceCad.toLocaleString()}</div>
                        </td>

                        {/* Stock */}
                        <td style={td}>
                          <span style={{
                            fontSize: "0.8rem",
                            fontWeight: p.stock === 0 ? 600 : 400,
                            color: p.stock === 0 ? C.maroon : p.stock <= 3 ? "#8A6818" : C.charcoal,
                          }}>
                            {p.stock === 0 ? "—" : p.stock}
                          </span>
                          {p.stock > 0 && p.stock <= 3 && (
                            <span style={{ marginLeft: 5, fontSize: "0.63rem", color: "#8A6818", fontWeight: 500 }}>low</span>
                          )}
                        </td>

                        {/* Status */}
                        <td style={td}>
                          <StatusBadge status={statusOf(p)} />
                        </td>

                        {/* Actions */}
                        <td style={tdCentered}>
                          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                            <Link
                              to={`/console/products/${p.id}/edit`}
                              title="Edit"
                              style={{ color: "rgba(43,35,32,0.45)", lineHeight: 0, display: "flex", textDecorationLine: "none" }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
                            >
                              <PenIcon size={14} />
                            </Link>
                            <button
                              title="Duplicate"
                              style={actionBtn}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
                            >
                              <DuplicateIcon size={14} />
                            </button>
                            <button
                              title="Delete"
                              style={{ ...actionBtn }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.maroon}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1.25rem",
              borderTop: "1px solid rgba(43,35,32,0.06)",
            }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={pagBtn(page === 1)}
                >
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      ...pagBtn(false),
                      backgroundColor: n === page ? C.maroon : "transparent",
                      color: n === page ? "#fff" : C.charcoal,
                      fontWeight: n === page ? 600 : 400,
                      minWidth: 28,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={pagBtn(page === totalPages)}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "5rem 2rem",
      gap: "1rem",
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        backgroundColor: "rgba(212,169,78,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.gold,
        marginBottom: "0.25rem",
      }}>
        <TagIcon size={22} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.95rem", fontWeight: 600, color: C.charcoal, marginBottom: "0.375rem" }}>
          You haven&apos;t added any products yet
        </p>
        <p style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
          Start building your catalogue — products you add will appear here.
        </p>
      </div>
      <Link
        to="/console/products/new"
        style={{
          marginTop: "0.25rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: C.gold,
          color: C.charcoal,
          border: "none",
          borderRadius: 7,
          padding: "0.6rem 1.25rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: "pointer",
          textDecorationLine: "none",
          letterSpacing: "0.01em",
        }}
      >
        <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>+</span>
        Add Your First Product
      </Link>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  textAlign: "left",
  fontSize: "0.62rem",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "rgba(43,35,32,0.38)",
  fontWeight: 500,
  fontFamily: UI,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontFamily: UI,
  verticalAlign: "middle",
};

const tdCentered: React.CSSProperties = {
  ...td,
  textAlign: "center",
};

const actionBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "rgba(43,35,32,0.45)",
  padding: 3,
  lineHeight: 0,
  display: "flex",
  alignItems: "center",
  transition: "color 0.12s",
};

function pagBtn(disabled: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 5,
    border: "1px solid rgba(43,35,32,0.1)",
    backgroundColor: "transparent",
    color: disabled ? "rgba(43,35,32,0.2)" : C.charcoal,
    cursor: disabled ? "default" : "pointer",
    fontFamily: UI,
    fontSize: "0.75rem",
    lineHeight: 0,
  };
}
