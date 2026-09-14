'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
import type { FulfilStatus, OrderListRow, PayStatus } from "@/server/orders";
import { C, UI } from "../../tokens";

// ── Icons ─────────────────────────────────────────────────────────────────────

function DownloadIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CalendarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronDown({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function EyeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TruckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ChevronLeft({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Types & data ──────────────────────────────────────────────────────────────


// ── Status config ─────────────────────────────────────────────────────────────

const FULFIL_STYLE: Record<FulfilStatus, { label: string; bg: string; color: string }> = {
  new:        { label: "New",        bg: "rgba(43,35,32,0.07)",   color: "rgba(43,35,32,0.55)" },
  processing: { label: "Processing", bg: "rgba(46,74,158,0.1)",   color: C.indigo ?? "#2E4A9E" },
  shipped:    { label: "Shipped",    bg: "rgba(212,169,78,0.14)", color: "#8A6818" },
  delivered:  { label: "Delivered",  bg: "rgba(59,138,147,0.12)", color: C.teal },
  cancelled:  { label: "Cancelled",  bg: "rgba(122,46,56,0.1)",   color: C.maroon },
};

const PAY_STYLE: Record<PayStatus, { label: string; bg: string; color: string }> = {
  paid:    { label: "Paid",    bg: "rgba(59,138,147,0.12)", color: C.teal },
  pending: { label: "Pending", bg: "rgba(43,35,32,0.07)",   color: "rgba(43,35,32,0.5)" },
  refunded: { label: "Refunded", bg: "rgba(122,46,56,0.1)", color: C.maroon },
};

const TABS: { key: "all" | FulfilStatus; label: string }[] = [
  { key: "all",        label: "All" },
  { key: "new",        label: "New" },
  { key: "processing", label: "Processing" },
  { key: "shipped",    label: "Shipped" },
  { key: "delivered",  label: "Delivered" },
  { key: "cancelled",  label: "Cancelled" },
];

const SORTS = ["Newest", "Oldest", "Highest Total"];
const PER_PAGE = 8;

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ bg, color, label }: { bg: string; color: string; label: string }) {
  return (
    <span className="inline-block px-[9px] py-[2px] rounded-full font-medium whitespace-nowrap tracking-[0.01em]" style={{
      fontSize: "0.67rem", backgroundColor: bg, color,
      fontFamily: UI,
    }}>
      {label}
    </span>
  );
}

// ── SelectField ───────────────────────────────────────────────────────────────

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white rounded-md cursor-pointer outline-none appearance-none border border-solid border-[rgba(43,35,32,0.14)] py-[0.45rem] pl-[0.75rem] pr-[2rem]"
        style={{
          fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <span className="absolute right-2 pointer-events-none leading-none" style={{ color: "rgba(43,35,32,0.4)" }}>
        <ChevronDown />
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConsoleOrders({ orders }: { orders: OrderListRow[] }) {
  const [activeTab, setActiveTab] = useState<"all" | FulfilStatus>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  const tabCounts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? orders.length : orders.filter(o => o.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = orders.filter(o => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || o.number.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
    return matchTab && matchSearch;
  }).sort((a, b) => {
    if (sort === "Oldest") return a.number.localeCompare(b.number);
    if (sort === "Highest Total") return b.totalCad - a.totalCad;
    return b.number.localeCompare(a.number);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeTab(key: "all" | FulfilStatus) {
    setActiveTab(key);
    setPage(1);
    setSearch("");
  }

  return (
    <div className="console-page p-7 min-h-full" style={{ fontFamily: UI }}>

      {/* ── Top row ──────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="uppercase mb-[0.2rem] m-[0_0_0.2rem] tracking-[0.1em]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </p>
          <h1 className="font-semibold m-0 tracking-[-0.02em]" style={{ fontSize: "1.35rem", color: C.charcoal }}>
            Orders
          </h1>
        </div>
        <button
          className="inline-flex items-center gap-[6px] bg-transparent rounded-[7px] px-4 py-2 font-medium cursor-pointer transition-colors duration-150 tracking-[0.01em] border border-solid border-[rgba(43,35,32,0.18)]"
          style={{
            color: C.charcoal,
            fontSize: "0.78rem",
            fontFamily: UI,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          <DownloadIcon size={14} /> Export CSV
        </button>
      </div>

      {/* ── Status tabs ───────────────────────────────────── */}
      <div className="flex gap-0 mb-4 overflow-x-auto border-b border-solid border-[rgba(43,35,32,0.1)]">
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              className="inline-flex items-center gap-[6px] px-[0.875rem] py-[0.6rem] bg-none border-none cursor-pointer whitespace-nowrap transition-colors duration-120 mb-[-1px] border-b-2 border-solid"
              style={{
                fontFamily: UI, fontSize: "0.78rem", fontWeight: active ? 600 : 400,
                color: active ? C.charcoal : "rgba(43,35,32,0.48)",
                borderBottomColor: active ? C.gold : "transparent",
              }}
            >
              {t.label}
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full font-bold px-1" style={{
                backgroundColor: active ? C.maroon : "rgba(43,35,32,0.08)",
                color: active ? "#fff" : "rgba(43,35,32,0.5)",
                fontSize: "0.6rem",
              }}>
                {tabCounts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Filters row ───────────────────────────────────── */}
      <div className="bg-white rounded-lg p-[0.875rem_1.125rem] mb-4 flex gap-3 items-center flex-wrap border border-solid border-[rgba(43,35,32,0.07)]">
        {/* Search */}
        <div className="relative min-w-[200px]" style={{ flex: "1 1 260px" }}>
          <span className="absolute left-[0.625rem] top-1/2 -translate-y-1/2 leading-none" style={{ color: "rgba(43,35,32,0.35)" }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by order # or customer name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-md outline-none box-border bg-[rgba(43,35,32,0.03)] border border-solid border-[rgba(43,35,32,0.12)] py-[0.45rem] pr-[0.75rem] pl-[2.1rem]"
            style={{
              fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
            }}
          />
        </div>

        {/* Date range */}
        <div className="relative inline-flex items-center">
          <span className="absolute left-[0.625rem] leading-none pointer-events-none" style={{ color: "rgba(43,35,32,0.4)" }}>
            <CalendarIcon />
          </span>
          <input
            type="text"
            placeholder="Date range"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="w-[150px] bg-white rounded-md outline-none border border-solid border-[rgba(43,35,32,0.14)] py-[0.45rem] pr-[0.75rem] pl-[2.1rem]"
            style={{
              fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
            }}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="whitespace-nowrap" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.4)" }}>Sort:</span>
          <SelectField value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div className="bg-white rounded-lg overflow-hidden border border-solid border-[rgba(43,35,32,0.07)]">
        {paginated.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <>
            <div className="table-scroll">
              <table className="card-table w-full border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-solid border-[rgba(43,35,32,0.07)]">
                    {["Order #", "Date", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
                      <th key={h} className="p-[0.5rem_1rem] text-left uppercase font-medium whitespace-nowrap tracking-[0.09em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.38)", fontFamily: UI }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((o, i) => (
                    <OrderRow key={o.id} order={o} alt={i % 2 !== 0} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-[0.875rem_1.25rem] border-t border-solid border-[rgba(43,35,32,0.06)]">
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-[0.375rem] items-center">
                <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft />
                </PagBtn>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <PagBtn key={n} onClick={() => setPage(n)} active={n === page}>{n}</PagBtn>
                ))}
                <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight />
                </PagBtn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Order row ─────────────────────────────────────────────────────────────────

function OrderRow({ order: o, alt }: { order: OrderListRow; alt: boolean }) {
  const [hovering, setHovering] = useState(false);
  const fulfil = FULFIL_STYLE[o.status];
  const pay = PAY_STYLE[o.payment];
  const canShip = o.status === "processing";

  return (
    <tr
      className="cursor-pointer transition-colors duration-100"
      style={{
        backgroundColor: hovering ? "rgba(212,169,78,0.04)" : alt ? "rgba(43,35,32,0.015)" : "transparent",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Order # */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <Link
          to={`/console/orders/${o.id}`}
          className="font-bold no-underline"
          style={{ fontSize: "0.8rem", color: C.maroon, fontFamily: UI }}
        >
          {o.number}
        </Link>
      </td>

      {/* Date */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <span className="whitespace-nowrap" style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.55)" }}>{o.placedAt}</span>
      </td>

      {/* Customer */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <div className="font-medium" style={{ fontSize: "0.8rem", color: C.charcoal }}>{o.customerName}</div>
        <div className="mt-[1px]" style={{ fontSize: "0.67rem", color: "rgba(43,35,32,0.4)" }}>{o.customerEmail}</div>
      </td>

      {/* Items */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <div style={{ fontSize: "0.77rem", color: C.charcoal }}>
          {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}
        </div>
        <div className="mt-[1px] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: "0.67rem", color: "rgba(43,35,32,0.4)" }}>
          {o.itemLabels.join(", ")}
        </div>
      </td>

      {/* Total */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <div className="font-semibold" style={{ fontSize: "0.8rem", color: C.charcoal }}>CAD ${o.totalCad.toLocaleString()}</div>
      </td>

      {/* Payment */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <Badge bg={pay.bg} color={pay.color} label={pay.label} />
      </td>

      {/* Status */}
      <td className="p-[0.75rem_1rem] align-middle" style={{ fontFamily: UI }}>
        <Badge bg={fulfil.bg} color={fulfil.color} label={fulfil.label} />
      </td>

      {/* Actions */}
      <td className="p-[0.75rem_1rem] align-middle whitespace-nowrap" style={{ fontFamily: UI }}>
        <div className="flex gap-[0.375rem] items-center">
          <Link
            to={`/console/orders/${o.id}`}
            title="View order"
            className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] bg-transparent no-underline leading-none transition-colors duration-150 border border-solid border-[rgba(43,35,32,0.14)]"
            style={{
              color: "rgba(43,35,32,0.5)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.04)"; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.5)"; }}
          >
            <EyeIcon />
          </Link>
          {canShip && (
            <Link
              to={`/console/orders/${o.id}`}
              title="Mark as Shipped"
              className="inline-flex items-center gap-1 px-2 h-7 rounded-[5px] font-semibold no-underline whitespace-nowrap transition-colors duration-150 tracking-[0.01em] border border-solid border-[rgba(212,169,78,0.25)] bg-[rgba(212,169,78,0.12)]"
              style={{
                color: "#8A6818",
                fontSize: "0.68rem",
                fontFamily: UI,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = C.gold; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(212,169,78,0.12)"; (e.currentTarget as HTMLElement).style.color = "#8A6818"; }}
            >
              <TruckIcon /> Ship
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Pagination button ─────────────────────────────────────────────────────────

function PagBtn({ children, onClick, disabled = false, active = false }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-[5px] leading-none px-1 transition-colors duration-150 border border-solid border-[rgba(43,35,32,0.1)]"
      style={{
        backgroundColor: active ? C.maroon : "transparent",
        color: disabled ? "rgba(43,35,32,0.2)" : active ? "#fff" : C.charcoal,
        cursor: disabled ? "default" : "pointer",
        fontFamily: UI, fontSize: "0.75rem",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

const TAB_COPY: Record<string, string> = {
  all:        "No orders yet",
  new:        "No new orders right now",
  processing: "Nothing in processing",
  shipped:    "No orders in transit",
  delivered:  "No delivered orders",
  cancelled:  "No cancelled orders",
};

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="p-[4rem_2rem] flex flex-col items-center gap-[0.625rem]">
      <div className="w-11 h-11 rounded-full flex items-center justify-center leading-none mb-1" style={{ backgroundColor: "rgba(43,35,32,0.05)", color: "rgba(43,35,32,0.25)" }}>
        <TruckIcon size={20} />
      </div>
      <p className="font-semibold m-0" style={{ fontSize: "0.9rem", color: C.charcoal }}>{TAB_COPY[tab] ?? "No orders"}</p>
      <p className="text-center max-w-[280px] m-0" style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.42)" }}>
        Orders placed in your store will appear here.
      </p>
    </div>
  );
}

