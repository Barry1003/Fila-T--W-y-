'use client';

import { Link } from "@/lib/router";
import { useUser } from "@/lib/user";
import type { DashboardData, DashActivity } from "@/server/dashboard";
import { C, UI } from "../../tokens";
import {
  TrendUpIcon,
  TrendDownIcon,
  AlertIcon,
  ShoppingBagIcon,
} from "../../icons";

const cad = (n: number) => "CAD $" + Math.round(n).toLocaleString("en-CA");

/** The icon + colour each activity kind renders with. */
const ACTIVITY_STYLE: Record<DashActivity["kind"], { icon: React.ReactNode; bg: string }> = {
  order: { icon: <ShoppingBagIcon size={13} />, bg: C.teal },
  lowstock: { icon: <AlertIcon size={13} />, bg: C.maroon },
};

function SalesChart({ points }: { points: DashboardData["chart"] }) {
  const W = 600;
  const H = 140;
  const PAD_T = 12;
  const PAD_B = 28;
  const PAD_H = 8;
  const innerW = W - PAD_H * 2;
  const innerH = H - PAD_T - PAD_B;
  const vals = points.map(p => p.value);
  const maxVal = Math.max(...vals, 1); // avoid divide-by-zero on a quiet week
  const barW = (innerW / points.length) * 0.52;
  const spacing = innerW / points.length;

  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      className="block overflow-visible"
      aria-label="7-day sales chart"
    >
      {/* Grid lines */}
      {gridLines.map((frac) => {
        const y = PAD_T + innerH * (1 - frac);
        return (
          <line
            key={frac}
            x1={PAD_H}
            y1={y}
            x2={W - PAD_H}
            y2={y}
            stroke="rgba(43,35,32,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Bars */}
      {points.map((pt, i) => {
        const barH = (pt.value / maxVal) * innerH;
        const x = PAD_H + i * spacing + (spacing - barW) / 2;
        const y = PAD_T + innerH - barH;
        const isToday = pt.isToday;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={isToday ? C.maroon : C.gold}
              opacity={isToday ? 0.9 : 0.72}
            />
            {/* Day label */}
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fill={isToday ? C.charcoal : "rgba(43,35,32,0.45)"}
              fontSize="10"
              fontFamily={UI}
              fontWeight={isToday ? "600" : "400"}
            >
              {pt.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  received: { bg: "rgba(59,138,147,0.12)", color: C.teal },
  waiting: { bg: "rgba(212,169,78,0.14)", color: "#8A6818" },
  ready: { bg: "rgba(46,74,158,0.1)", color: "#2E4A9E" },
  production: { bg: "rgba(43,35,32,0.08)", color: "rgba(43,35,32,0.6)" },
};

function StatusBadge({ status, type }: { status: string; type: string }) {
  const s = STATUS_STYLES[type] ?? STATUS_STYLES.production;
  return (
    <span
      className="inline-block px-2 py-[2px] rounded-full font-medium whitespace-nowrap"
      style={{
        fontSize: "0.68rem",
        backgroundColor: s.bg,
        color: s.color,
        fontFamily: UI,
      }}
    >
      {status}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ConsoleDashboard({ data }: { data: DashboardData }) {
  const user = useUser();
  const firstName = user?.name ? user.name.trim().split(/\s+/)[0] : "there";

  const pctText = (p: number | null) => (p == null ? "—" : `${p >= 0 ? "+" : ""}${p}%`);
  const STATS = [
    { label: "Today's Sales", value: cad(data.todaySales), trend: pctText(data.todayTrendPct), trendUp: (data.todayTrendPct ?? 0) >= 0, note: "vs yesterday", accent: C.teal },
    { label: "Pending Orders", value: String(data.pendingCount), trend: data.pendingCount > 0 ? `${data.pendingCount} open` : "all clear", trendUp: data.pendingCount === 0, note: "need action", accent: C.maroon },
    { label: "Total Products", value: String(data.totalProducts), trend: data.lowStockCount > 0 ? `${data.lowStockCount} low stock` : "all stocked", trendUp: data.lowStockCount === 0, note: "in catalogue", accent: "#2E4A9E" },
    { label: "Month Revenue", value: cad(data.monthRevenue), trend: pctText(data.monthTrendPct), trendUp: (data.monthTrendPct ?? 0) >= 0, note: "vs last month", accent: C.gold },
  ];
  const ORDERS = data.orders;
  const ACTIVITY = data.activity;

  return (
    <div className="console-page p-7" style={{ fontFamily: UI }}>
      {/* Greeting */}
      <div className="mb-7">
        <p
          className="uppercase mb-1 tracking-[0.1em]"
          style={{
            fontFamily: UI,
            fontSize: "0.7rem",
            color: "rgba(43,35,32,0.4)",
          }}
        >
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1
          className="font-semibold m-0 tracking-[-0.02em]"
          style={{
            fontFamily: UI,
            fontSize: "1.35rem",
            color: C.charcoal,
          }}
        >
          Welcome back, {firstName}
        </h1>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="console-stat-grid grid grid-cols-[repeat(4,1fr)] gap-4 mb-5">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg p-5 flex flex-col gap-1 border border-solid border-[rgba(43,35,32,0.07)]"
            style={{
              borderTop: `3px solid ${s.accent}`,
            }}
          >
            <div
              className="uppercase font-medium mb-[0.375rem] tracking-[0.1em]"
              style={{
                fontSize: "0.63rem",
                color: "rgba(43,35,32,0.45)",
              }}
            >
              {s.label}
            </div>
            <div
              className="font-bold leading-none tracking-[-0.03em]"
              style={{
                fontSize: "1.75rem",
                color: C.charcoal,
              }}
            >
              {s.value}
            </div>
            <div
              className="flex items-center gap-1 mt-2 font-medium"
              style={{
                color: s.trendUp ? C.teal : C.maroon,
                fontSize: "0.72rem",
              }}
            >
              {s.trendUp ? <TrendUpIcon /> : <TrendDownIcon />}
              <span>{s.trend}</span>
              <span style={{ color: "rgba(43,35,32,0.35)", fontWeight: 400 }}>
                {s.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Lower grid: Orders + Activity ──────────────────── */}
      <div className="console-lower-grid grid grid-cols-[1fr_340px] gap-4 mb-4">
        {/* Orders needing action */}
        <div
          className="bg-white rounded-lg overflow-hidden border border-solid border-[rgba(43,35,32,0.07)]"
        >
          <div
            className="flex items-center justify-between p-[1rem_1.25rem_0.875rem] border-b border-solid border-[rgba(43,35,32,0.06)]"
          >
            <span
              className="font-semibold"
              style={{
                fontSize: "0.8rem",
                color: C.charcoal,
              }}
            >
              Orders Needing Action
            </span>
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-white"
              style={{
                backgroundColor: C.maroon,
                fontSize: "0.62rem",
              }}
            >
              {ORDERS.length}
            </span>
          </div>

          <div className="table-scroll">
            <table className="card-table w-full border-collapse min-w-[540px]">
              <thead>
                <tr>
                  {["Order", "Buyer", "Item", "Total", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="p-[0.5rem_1.25rem] text-left uppercase font-medium tracking-[0.09em] border-b border-solid border-[rgba(43,35,32,0.06)]"
                      style={{
                        fontSize: "0.62rem",
                        color: "rgba(43,35,32,0.38)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-[1.5rem_1.25rem] text-center" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
                      No orders need action right now.
                    </td>
                  </tr>
                )}
                {ORDERS.map((o, i) => (
                  <tr
                    key={o.id}
                    className={i % 2 === 0 ? "bg-transparent" : "bg-[rgba(43,35,32,0.018)]"}
                  >
                    <td
                      className="p-[0.7rem_1.25rem] font-semibold whitespace-nowrap"
                      style={{
                        fontSize: "0.77rem",
                        color: C.charcoal,
                      }}
                    >
                      {o.id}
                    </td>
                    <td
                      className="p-[0.7rem_1.25rem] whitespace-nowrap"
                      style={{
                        fontSize: "0.77rem",
                        color: C.charcoal,
                      }}
                    >
                      {o.buyer}
                    </td>
                    <td
                      className="p-[0.7rem_1.25rem]"
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(43,35,32,0.6)",
                      }}
                    >
                      {o.item}
                    </td>
                    <td
                      className="p-[0.7rem_1.25rem] font-semibold whitespace-nowrap"
                      style={{
                        fontSize: "0.77rem",
                        color: C.charcoal,
                      }}
                    >
                      {o.total}
                    </td>
                    <td className="p-[0.7rem_1.25rem]">
                      <StatusBadge status={o.status} type={o.statusType} />
                    </td>
                    <td className="p-[0.7rem_1.25rem]">
                      <Link
                        to="/console/orders"
                        className="inline-block no-underline border-none rounded-[4px] p-[4px_12px] font-semibold cursor-pointer whitespace-nowrap tracking-[0.02em]"
                        style={{
                          backgroundColor: C.gold,
                          color: C.charcoal,
                          fontSize: "0.68rem",
                        }}
                      >
                        Fulfil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div
          className="bg-white rounded-lg overflow-hidden border border-solid border-[rgba(43,35,32,0.07)]"
        >
          <div
            className="p-[1rem_1.25rem_0.875rem] border-b border-solid border-[rgba(43,35,32,0.06)]"
          >
            <span
              className="font-semibold"
              style={{
                fontSize: "0.8rem",
                color: C.charcoal,
              }}
            >
              Recent Activity
            </span>
          </div>
          <div className="py-2">
            {ACTIVITY.length === 0 && (
              <div className="p-[1.25rem]" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
                No recent activity yet.
              </div>
            )}
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className={`flex gap-3 p-[0.75rem_1.25rem] items-start ${i < ACTIVITY.length - 1 ? 'border-b border-solid border-[rgba(43,35,32,0.05)]' : ''}`}
              >
                <div
                  className="w-[26px] h-[26px] rounded-full text-white flex items-center justify-center shrink-0 mt-[1px]"
                  style={{
                    backgroundColor: ACTIVITY_STYLE[a.kind].bg,
                  }}
                >
                  {ACTIVITY_STYLE[a.kind].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium leading-tight"
                    style={{
                      fontSize: "0.78rem",
                      color: C.charcoal,
                    }}
                  >
                    {a.text}
                  </div>
                  <div
                    className="mt-[2px] overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(43,35,32,0.48)",
                    }}
                  >
                    {a.sub}
                  </div>
                  <div
                    className="mt-[3px]"
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(43,35,32,0.32)",
                    }}
                  >
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sales chart ────────────────────────────────────── */}
      <div
        className="bg-white rounded-lg p-5 border border-solid border-[rgba(43,35,32,0.07)]"
      >
        <div
          className="flex items-center justify-between mb-5"
        >
          <div>
            <div
              className="font-semibold mb-[2px]"
              style={{
                fontSize: "0.8rem",
                color: C.charcoal,
              }}
            >
              Sales — Last 7 Days
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "rgba(43,35,32,0.4)",
              }}
            >
              <span style={{ color: C.gold, fontWeight: 600 }}>■</span> Prior days &nbsp;
              <span style={{ color: C.maroon, fontWeight: 600 }}>■</span> Today
            </div>
          </div>
          <div
            className="flex items-baseline gap-[6px]"
          >
            <span
              className="font-bold tracking-[-0.03em]"
              style={{
                fontSize: "1.5rem",
                color: C.charcoal,
              }}
            >
              {cad(data.weekTotal)}
            </span>
            <span
              className="font-medium"
              style={{
                fontSize: "0.72rem",
                color: "rgba(43,35,32,0.4)",
              }}
            >
              7-day total
            </span>
          </div>
        </div>
        <SalesChart points={data.chart} />
      </div>
    </div>
  );
}
