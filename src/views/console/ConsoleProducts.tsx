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
    <span className="inline-block px-[9px] py-[2px] rounded-full font-medium whitespace-nowrap tracking-[0.01em]" style={{
      fontSize: "0.67rem",
      backgroundColor: s.bg,
      color: s.color,
      fontFamily: UI,
    }}>
      {s.label}
    </span>
  );
}

// ── Product thumbnail placeholder ─────────────────────────────────────────────

// ── Select / Input helpers ────────────────────────────────────────────────────

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white rounded-md cursor-pointer outline-none appearance-none min-w-[140px] border border-solid border-[rgba(43,35,32,0.14)] py-[0.45rem] pl-[0.75rem] pr-[2rem]"
        style={{
          fontFamily: UI,
          fontSize: "0.78rem",
          color: C.charcoal,
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-2 pointer-events-none leading-none" style={{ color: "rgba(43,35,32,0.4)" }}>
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
    <div className="console-page p-7 min-h-full" style={{ fontFamily: UI }}>

      {/* ── Top action row ────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="uppercase mb-[0.2rem] m-[0_0_0.2rem] tracking-[0.1em]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-semibold m-0 tracking-[-0.02em]" style={{ fontSize: "1.35rem", color: C.charcoal }}>
            Products
          </h1>
        </div>
        <Link
          to="/console/products/new"
          className="inline-flex items-center gap-[6px] rounded-[7px] px-[1.125rem] py-[0.55rem] font-semibold cursor-pointer no-underline whitespace-nowrap tracking-[0.01em]"
          style={{
            backgroundColor: C.gold,
            color: C.charcoal,
            fontSize: "0.8rem",
          }}
        >
          <span className="leading-none" style={{ fontSize: "1.05rem" }}>+</span>
          Add Product
        </Link>
      </div>

      {/* ── Filters row ───────────────────────────────────── */}
      <div className="bg-white rounded-lg p-[0.875rem_1.125rem] mb-4 flex gap-3 items-center flex-wrap border border-solid border-[rgba(43,35,32,0.07)]">
        {/* Search */}
        <div className="relative min-w-[180px]" style={{ flex: "1 1 220px" }}>
          <span className="absolute left-[0.625rem] top-1/2 -translate-y-1/2 leading-none" style={{ color: "rgba(43,35,32,0.35)" }}>
            <SearchInputIcon />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-md outline-none box-border bg-[rgba(43,35,32,0.03)] border border-solid border-[rgba(43,35,32,0.12)] py-[0.45rem] pr-[0.75rem] pl-[2.1rem]"
            style={{
              fontFamily: UI,
              fontSize: "0.78rem",
              color: C.charcoal,
            }}
          />
        </div>

        <SelectField value={category} onChange={v => { setCategory(v); setPage(1); }} options={CATEGORIES} />
        <SelectField value={status} onChange={v => { setStatus(v); setPage(1); }} options={STATUSES} />

        <div className="ml-auto flex items-center gap-2">
          <span className="whitespace-nowrap" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.4)" }}>Sort:</span>
          <SelectField value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>

      {/* ── Bulk action bar ───────────────────────────────── */}
      {hasBulk && (
        <div className="rounded-[7px] p-[0.6rem_1.125rem] mb-3 flex items-center gap-4" style={{
          backgroundColor: C.charcoal,
        }}>
          <span className="font-medium text-white" style={{ fontSize: "0.78rem" }}>
            {selected.size} item{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex-1" />
          {["Publish", "Unpublish", "Delete"].map(action => (
            <button
              key={action}
              onClick={() => setSelected(new Set())}
              className="bg-[rgba(255,255,255,0.1)] border-none rounded-[5px] px-[0.875rem] py-[0.35rem] font-medium cursor-pointer tracking-[0.01em]"
              style={{
                fontFamily: UI,
                fontSize: "0.72rem",
                color: action === "Delete" ? "#f87171" : "#fff",
              }}
            >
              {action}
            </button>
          ))}
          <button
            onClick={() => setSelected(new Set())}
            className="bg-none border-none cursor-pointer p-0"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.72rem",
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="bg-white rounded-lg overflow-hidden border border-solid border-[rgba(43,35,32,0.07)]">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="table-scroll">
              <table className="card-table w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-solid border-[rgba(43,35,32,0.07)]">
                    <th className="p-[0.5rem_1rem] text-left uppercase font-medium whitespace-nowrap tracking-[0.09em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.38)", fontFamily: UI }}>
                      <input
                        type="checkbox"
                        checked={allOnPageSelected}
                        onChange={toggleAll}
                        className="cursor-pointer"
                        style={{ accentColor: C.maroon }}
                      />
                    </th>
                    {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                      <th key={h} className="p-[0.5rem_1rem] text-left uppercase font-medium whitespace-nowrap tracking-[0.09em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.38)", fontFamily: UI }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, i) => {
                    const isSelected = selected.has(p.id);
                    return (
                      <tr
                        key={p.id}
                        className="transition-colors duration-100"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(212,169,78,0.06)"
                            : i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.015)",
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(212,169,78,0.04)";
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.015)";
                        }}
                      >
                        {/* Checkbox */}
                        <td className="p-[0.75rem_1rem] align-middle text-center" style={{ fontFamily: UI }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOne(p.id)}
                            className="cursor-pointer"
                            style={{ accentColor: C.maroon }}
                          />
                        </td>

                        {/* Product */}
                        <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt=""
                              width={38}
                              height={38}
                              className="w-[38px] h-[38px] object-cover rounded-[5px] shrink-0"
                            />
                            <div>
                              <div className="font-semibold leading-snug" style={{ fontSize: "0.8rem", color: C.charcoal }}>
                                {p.title}
                              </div>
                              <div className="mt-[2px]" style={{ fontSize: "0.68rem", color: "rgba(43,35,32,0.4)" }}>
                                #{p.id.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
                          <span style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.65)" }}>{p.category}</span>
                        </td>

                        {/* Price */}
                        <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
                          <div className="font-semibold" style={{ fontSize: "0.8rem", color: C.charcoal }}>CAD ${p.priceCad.toLocaleString()}</div>
                        </td>

                        {/* Stock */}
                        <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
                          <span style={{
                            fontSize: "0.8rem",
                            fontWeight: p.stock === 0 ? 600 : 400,
                            color: p.stock === 0 ? C.maroon : p.stock <= 3 ? "#8A6818" : C.charcoal,
                          }}>
                            {p.stock === 0 ? "—" : p.stock}
                          </span>
                          {p.stock > 0 && p.stock <= 3 && (
                            <span className="ml-[5px] font-medium" style={{ fontSize: "0.63rem", color: "#8A6818" }}>low</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
                          <StatusBadge status={statusOf(p)} />
                        </td>

                        {/* Actions */}
                        <td className="p-[0.75rem_1rem] align-middle text-center" style={{ fontFamily: UI }}>
                          <div className="flex gap-[0.375rem] items-center justify-center">
                            <Link
                              to={`/console/products/${p.id}/edit`}
                              title="Edit"
                              className="flex no-underline leading-none transition-colors duration-100"
                              style={{ color: "rgba(43,35,32,0.45)" }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
                            >
                              <PenIcon size={14} />
                            </Link>
                            <button
                              title="Duplicate"
                              className="bg-none border-none cursor-pointer p-[3px] leading-none flex items-center transition-colors duration-100"
                              style={{ color: "rgba(43,35,32,0.45)" }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
                            >
                              <DuplicateIcon size={14} />
                            </button>
                            <button
                              title="Delete"
                              className="bg-none border-none cursor-pointer p-[3px] leading-none flex items-center transition-colors duration-100"
                              style={{ color: "rgba(43,35,32,0.45)" }}
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
            <div className="flex items-center justify-between p-[0.875rem_1.25rem] border-t border-solid border-[rgba(43,35,32,0.06)]">
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-[0.375rem] items-center">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] bg-transparent leading-none border border-solid border-[rgba(43,35,32,0.1)]"
                  style={{
                    color: page === 1 ? "rgba(43,35,32,0.2)" : C.charcoal,
                    cursor: page === 1 ? "default" : "pointer",
                    fontFamily: UI, fontSize: "0.75rem",
                  }}
                >
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-[5px] leading-none border border-solid border-[rgba(43,35,32,0.1)]"
                    style={{
                      backgroundColor: n === page ? C.maroon : "transparent",
                      color: n === page ? "#fff" : C.charcoal,
                      fontWeight: n === page ? 600 : 400,
                      cursor: "pointer",
                      fontFamily: UI, fontSize: "0.75rem",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] bg-transparent leading-none border border-solid border-[rgba(43,35,32,0.1)]"
                  style={{
                    color: page === totalPages ? "rgba(43,35,32,0.2)" : C.charcoal,
                    cursor: page === totalPages ? "default" : "pointer",
                    fontFamily: UI, fontSize: "0.75rem",
                  }}
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
    <div className="flex flex-col items-center justify-center p-[5rem_2rem] gap-4">
      <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-1" style={{
        backgroundColor: "rgba(212,169,78,0.12)",
        color: C.gold,
      }}>
        <TagIcon size={22} />
      </div>
      <div className="text-center">
        <p className="font-semibold mb-[0.375rem] m-[0_0_0.375rem]" style={{ fontSize: "0.95rem", color: C.charcoal }}>
          You haven&apos;t added any products yet
        </p>
        <p className="m-0" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
          Start building your catalogue — products you add will appear here.
        </p>
      </div>
      <Link
        to="/console/products/new"
        className="mt-1 inline-flex items-center gap-[6px] rounded-[7px] px-5 py-[0.6rem] font-semibold cursor-pointer no-underline tracking-[0.01em]"
        style={{
          backgroundColor: C.gold,
          color: C.charcoal,
          fontSize: "0.8rem",
        }}
      >
        <span className="leading-none" style={{ fontSize: "1.05rem" }}>+</span>
        Add Your First Product
      </Link>
    </div>
  );
}

