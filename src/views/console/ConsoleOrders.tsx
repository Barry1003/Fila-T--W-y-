'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
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

type FulfilStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";
type PayStatus = "paid" | "pending";

type Order = {
  id: string;
  num: string;
  date: string;
  customer: string;
  email: string;
  itemCount: number;
  items: string[];
  totalGBP: number;
  totalNGN: number;
  payment: PayStatus;
  status: FulfilStatus;
};

const ORDERS: Order[] = [
  { id: "o1", num: "#FTW-2891", date: "1 Sep 2026", customer: "Chiamaka Eze", email: "chiamaka@email.com", itemCount: 2, items: ["Aso-Oke Gele Set ×2"], totalGBP: 680, totalNGN: 1006480, payment: "paid", status: "new" },
  { id: "o2", num: "#FTW-2887", date: "31 Aug 2026", customer: "David Mensah", email: "david@email.com", itemCount: 1, items: ["Yoruba Filà (Custom)"], totalGBP: 285, totalNGN: 422085, payment: "paid", status: "processing" },
  { id: "o3", num: "#FTW-2882", date: "30 Aug 2026", customer: "Bola Adeyemi", email: "bola@email.com", itemCount: 1, items: ["Adire Wrapper Set"], totalGBP: 195, totalNGN: 288795, payment: "paid", status: "shipped" },
  { id: "o4", num: "#FTW-2871", date: "29 Aug 2026", customer: "Ngozi Obi", email: "ngozi@email.com", itemCount: 1, items: ["Embroidered Cap (Large)"], totalGBP: 120, totalNGN: 177720, payment: "paid", status: "delivered" },
  { id: "o5", num: "#FTW-2869", date: "29 Aug 2026", customer: "Kwame Asante", email: "kwame@email.com", itemCount: 3, items: ["Aso-Oke Cap ×3"], totalGBP: 420, totalNGN: 621620, payment: "paid", status: "new" },
  { id: "o6", num: "#FTW-2860", date: "27 Aug 2026", customer: "Temi Fadare", email: "temi@email.com", itemCount: 1, items: ["Beaded Pam Slippers"], totalGBP: 88, totalNGN: 130328, payment: "pending", status: "cancelled" },
  { id: "o7", num: "#FTW-2856", date: "25 Aug 2026", customer: "Fatima Al-Amin", email: "fatima@email.com", itemCount: 2, items: ["Ankara Roundneck Shirt", "Bead Necklace Set"], totalGBP: 183, totalNGN: 271023, payment: "paid", status: "processing" },
  { id: "o8", num: "#FTW-2848", date: "23 Aug 2026", customer: "Samuel Okonkwo", email: "samuel@email.com", itemCount: 1, items: ["Agbada 3-Piece Set"], totalGBP: 680, totalNGN: 1006480, payment: "paid", status: "shipped" },
  { id: "o9", num: "#FTW-2841", date: "20 Aug 2026", customer: "Ayo Babatunde", email: "ayo@email.com", itemCount: 1, items: ["Ipele Wrap (Silk Blend)"], totalGBP: 245, totalNGN: 362945, payment: "paid", status: "delivered" },
  { id: "o10", num: "#FTW-2838", date: "18 Aug 2026", customer: "Zainab Musa", email: "zainab@email.com", itemCount: 2, items: ["Leather Yoruba Shoes", "Adire Wrapper Set"], totalGBP: 415, totalNGN: 614615, payment: "paid", status: "delivered" },
  { id: "o11", num: "#FTW-2830", date: "15 Aug 2026", customer: "Emmanuel Diop", email: "emma@email.com", itemCount: 1, items: ["Aso-Oke Trousers"], totalGBP: 160, totalNGN: 236960, payment: "pending", status: "new" },
  { id: "o12", num: "#FTW-2822", date: "12 Aug 2026", customer: "Chioma Ibe", email: "chioma@email.com", itemCount: 1, items: ["Embroidered Kaftan (Men)"], totalGBP: 420, totalNGN: 621620, payment: "paid", status: "delivered" },
];

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
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 100,
      fontSize: "0.67rem", fontWeight: 500, backgroundColor: bg, color,
      whiteSpace: "nowrap", fontFamily: UI, letterSpacing: "0.01em",
    }}>
      {label}
    </span>
  );
}

// ── SelectField ───────────────────────────────────────────────────────────────

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
          backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.14)",
          borderRadius: 6, padding: "0.45rem 2rem 0.45rem 0.75rem",
          appearance: "none", cursor: "pointer", outline: "none",
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <span style={{ position: "absolute", right: "0.5rem", pointerEvents: "none", color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
        <ChevronDown />
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ConsoleOrders() {
  const [activeTab, setActiveTab] = useState<"all" | FulfilStatus>("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);

  const tabCounts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? ORDERS.length : ORDERS.filter(o => o.status === t.key).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = ORDERS.filter(o => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || o.num.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    return matchTab && matchSearch;
  }).sort((a, b) => {
    if (sort === "Oldest") return a.num.localeCompare(b.num);
    if (sort === "Highest Total") return b.totalGBP - a.totalGBP;
    return b.num.localeCompare(a.num);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeTab(key: "all" | FulfilStatus) {
    setActiveTab(key);
    setPage(1);
    setSearch("");
  }

  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI, minHeight: "100%" }}>

      {/* ── Top row ──────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.4)", marginBottom: "0.2rem" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""}
          </p>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.02em", margin: 0 }}>
            Orders
          </h1>
        </div>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          backgroundColor: "transparent", color: C.charcoal,
          border: "1px solid rgba(43,35,32,0.18)", borderRadius: 7,
          padding: "0.5rem 1rem", fontSize: "0.78rem", fontWeight: 500,
          cursor: "pointer", fontFamily: UI, letterSpacing: "0.01em",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          <DownloadIcon size={14} /> Export CSV
        </button>
      </div>

      {/* ── Status tabs ───────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 0, borderBottom: "1px solid rgba(43,35,32,0.1)",
        marginBottom: "1rem", overflowX: "auto",
      }}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => changeTab(t.key)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "0.6rem 0.875rem",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: UI, fontSize: "0.78rem", fontWeight: active ? 600 : 400,
                color: active ? C.charcoal : "rgba(43,35,32,0.48)",
                borderBottom: active ? `2px solid ${C.gold}` : "2px solid transparent",
                marginBottom: "-1px",
                whiteSpace: "nowrap",
                transition: "color 0.12s",
              }}
            >
              {t.label}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 18, height: 18, borderRadius: 9,
                backgroundColor: active ? C.maroon : "rgba(43,35,32,0.08)",
                color: active ? "#fff" : "rgba(43,35,32,0.5)",
                fontSize: "0.6rem", fontWeight: 700, padding: "0 4px",
              }}>
                {tabCounts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Filters row ───────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff", borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        padding: "0.875rem 1.125rem", marginBottom: "1rem",
        display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px", minWidth: 200 }}>
          <span style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "rgba(43,35,32,0.35)", lineHeight: 0 }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by order # or customer name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
              backgroundColor: "rgba(43,35,32,0.03)",
              border: "1px solid rgba(43,35,32,0.12)", borderRadius: 6,
              padding: "0.45rem 0.75rem 0.45rem 2.1rem",
              width: "100%", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Date range */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: "0.625rem", color: "rgba(43,35,32,0.4)", lineHeight: 0, pointerEvents: "none" }}>
            <CalendarIcon />
          </span>
          <input
            type="text"
            placeholder="Date range"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{
              fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
              backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.14)",
              borderRadius: 6, padding: "0.45rem 0.75rem 0.45rem 2.1rem",
              width: 150, outline: "none",
            }}
          />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.4)", whiteSpace: "nowrap" }}>Sort:</span>
          <SelectField value={sort} onChange={setSort} options={SORTS} />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: "#fff", borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)", overflow: "hidden",
      }}>
        {paginated.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <>
            <div className="table-scroll">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(43,35,32,0.07)" }}>
                    {["Order #", "Date", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
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
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(43,35,32,0.06)",
            }}>
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
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

function OrderRow({ order: o, alt }: { order: Order; alt: boolean }) {
  const [hovering, setHovering] = useState(false);
  const fulfil = FULFIL_STYLE[o.status];
  const pay = PAY_STYLE[o.payment];
  const canShip = o.status === "processing";

  return (
    <tr
      style={{
        backgroundColor: hovering ? "rgba(212,169,78,0.04)" : alt ? "rgba(43,35,32,0.015)" : "transparent",
        cursor: "pointer",
        transition: "background-color 0.1s",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Order # */}
      <td style={td}>
        <Link
          to={`/console/orders/${o.id}`}
          style={{ fontSize: "0.8rem", fontWeight: 700, color: C.maroon, textDecorationLine: "none", fontFamily: UI }}
        >
          {o.num}
        </Link>
      </td>

      {/* Date */}
      <td style={td}>
        <span style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.55)", whiteSpace: "nowrap" }}>{o.date}</span>
      </td>

      {/* Customer */}
      <td style={td}>
        <div style={{ fontSize: "0.8rem", fontWeight: 500, color: C.charcoal }}>{o.customer}</div>
        <div style={{ fontSize: "0.67rem", color: "rgba(43,35,32,0.4)", marginTop: "1px" }}>{o.email}</div>
      </td>

      {/* Items */}
      <td style={td}>
        <div style={{ fontSize: "0.77rem", color: C.charcoal }}>
          {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}
        </div>
        <div style={{ fontSize: "0.67rem", color: "rgba(43,35,32,0.4)", marginTop: "1px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {o.items.join(", ")}
        </div>
      </td>

      {/* Total */}
      <td style={td}>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.charcoal }}>£{o.totalGBP.toLocaleString()}</div>
        <div style={{ fontSize: "0.67rem", color: "rgba(43,35,32,0.38)", marginTop: "1px" }}>₦{o.totalNGN.toLocaleString()}</div>
      </td>

      {/* Payment */}
      <td style={td}>
        <Badge bg={pay.bg} color={pay.color} label={pay.label} />
      </td>

      {/* Status */}
      <td style={td}>
        <Badge bg={fulfil.bg} color={fulfil.color} label={fulfil.label} />
      </td>

      {/* Actions */}
      <td style={{ ...td, whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
          <Link
            to={`/console/orders/${o.id}`}
            title="View order"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 5,
              border: "1px solid rgba(43,35,32,0.14)", backgroundColor: "transparent",
              color: "rgba(43,35,32,0.5)", textDecorationLine: "none", lineHeight: 0,
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
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                padding: "0 0.5rem", height: 28, borderRadius: 5,
                backgroundColor: "rgba(212,169,78,0.12)", color: "#8A6818",
                border: "1px solid rgba(212,169,78,0.25)", fontSize: "0.68rem",
                fontWeight: 600, fontFamily: UI, textDecorationLine: "none",
                whiteSpace: "nowrap", letterSpacing: "0.01em",
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
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 28, height: 28, borderRadius: 5,
        border: "1px solid rgba(43,35,32,0.1)",
        backgroundColor: active ? C.maroon : "transparent",
        color: disabled ? "rgba(43,35,32,0.2)" : active ? "#fff" : C.charcoal,
        cursor: disabled ? "default" : "pointer",
        fontFamily: UI, fontSize: "0.75rem", lineHeight: 0,
        fontWeight: active ? 600 : 400, padding: "0 4px",
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
    <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(43,35,32,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(43,35,32,0.25)", lineHeight: 0, marginBottom: "0.25rem" }}>
        <TruckIcon size={20} />
      </div>
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: C.charcoal }}>{TAB_COPY[tab] ?? "No orders"}</p>
      <p style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.42)", textAlign: "center", maxWidth: 280 }}>
        Orders placed in your store will appear here.
      </p>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

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
