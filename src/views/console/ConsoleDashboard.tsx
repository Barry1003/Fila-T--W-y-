'use client';

import { useUser } from "@/lib/user";
import { C, UI } from "../../tokens";
import {
  TrendUpIcon,
  TrendDownIcon,
  AlertIcon,
  ShoppingBagIcon,
  StarIcon,
  PenIcon,
  PackageIcon,
} from "../../icons";

// ── Mock data ────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Today's Sales",
    value: "CAD $4,885",
    sub: null,
    trend: "+14%",
    trendUp: true,
    note: "vs yesterday",
    accent: C.teal,
  },
  {
    label: "Pending Orders",
    value: "7",
    sub: null,
    trend: "3 urgent",
    trendUp: false,
    note: "need action",
    accent: C.maroon,
  },
  {
    label: "Total Products",
    value: "142",
    sub: null,
    trend: "5 low stock",
    trendUp: false,
    note: "in catalogue",
    accent: "#2E4A9E",
  },
  {
    label: "Month Revenue",
    value: "CAD $31,734",
    sub: null,
    trend: "+8%",
    trendUp: true,
    note: "vs last month",
    accent: C.gold,
  },
];

const ORDERS = [
  {
    id: "#FTW-2891",
    buyer: "Chiamaka Eze",
    item: "Aso-Oke Gele Set ×2",
    total: "CAD $585",
    status: "Payment Received",
    statusType: "received",
  },
  {
    id: "#FTW-2887",
    buyer: "David Mensah",
    item: "Yoruba Filà (Custom)",
    total: "CAD $490",
    status: "Awaiting Fabric",
    statusType: "waiting",
  },
  {
    id: "#FTW-2882",
    buyer: "Bola Adeyemi",
    item: "Adire Wrapper Set",
    total: "CAD $335",
    status: "Ready to Ship",
    statusType: "ready",
  },
  {
    id: "#FTW-2871",
    buyer: "Ngozi Obi",
    item: "Embroidered Cap (Large)",
    total: "CAD $206",
    status: "Payment Received",
    statusType: "received",
  },
  {
    id: "#FTW-2869",
    buyer: "Kwame Asante",
    item: "Aso-Oke Cap ×3",
    total: "CAD $722",
    status: "In Production",
    statusType: "production",
  },
];

const ACTIVITY = [
  {
    icon: <ShoppingBagIcon size={13} />,
    iconBg: C.teal,
    text: "New order from Temi Adeyemi",
    sub: "Aso-Oke Gele Set · CAD $585",
    time: "2 min ago",
  },
  {
    icon: <AlertIcon size={13} />,
    iconBg: C.maroon,
    text: "Low stock alert",
    sub: "Aso-Oke Gele (White, M) · only 3 left",
    time: "18 min ago",
  },
  {
    icon: <StarIcon size={13} />,
    iconBg: "#2E4A9E",
    text: "New 5★ review — Ola Balogun",
    sub: "Embroidered Cap · \"Beautifully crafted...\"",
    time: "1 hr ago",
  },
  {
    icon: <PenIcon size={13} />,
    iconBg: C.gold,
    text: "New custom order request",
    sub: "Temi Fadare · Gele for wedding (July)",
    time: "2 hrs ago",
  },
  {
    icon: <PackageIcon size={13} />,
    iconBg: "rgba(43,35,32,0.45)",
    text: "Order #FTW-2862 shipped",
    sub: "David Chen · Filà (Large, Maroon)",
    time: "3 hrs ago",
  },
];

// ── Sales chart (7-day bar chart) ────────────────────────────────────────────

const CHART_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CHART_VALS = [3200, 4100, 2800, 5200, 4800, 6100, 2840];

function SalesChart() {
  const W = 600;
  const H = 140;
  const PAD_T = 12;
  const PAD_B = 28;
  const PAD_H = 8;
  const innerW = W - PAD_H * 2;
  const innerH = H - PAD_T - PAD_B;
  const maxVal = Math.max(...CHART_VALS);
  const barW = (innerW / CHART_VALS.length) * 0.52;
  const spacing = innerW / CHART_VALS.length;

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
      {CHART_VALS.map((val, i) => {
        const barH = (val / maxVal) * innerH;
        const x = PAD_H + i * spacing + (spacing - barW) / 2;
        const y = PAD_T + innerH - barH;
        const isToday = i === CHART_VALS.length - 1;
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
              {CHART_DAYS[i]}
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

export default function ConsoleDashboard() {
  const user = useUser();
  const firstName = user?.name ? user.name.trim().split(/\s+/)[0] : "Adunola";

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
            {s.sub && (
              <div
                className="mt-[1px]"
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(43,35,32,0.38)",
                }}
              >
                {s.sub}
              </div>
            )}
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
                      <button
                        className="border-none rounded-[4px] p-[4px_12px] font-semibold cursor-pointer whitespace-nowrap tracking-[0.02em]"
                        style={{
                          backgroundColor: C.gold,
                          color: C.charcoal,
                          fontSize: "0.68rem",
                        }}
                      >
                        Fulfil
                      </button>
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
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className={`flex gap-3 p-[0.75rem_1.25rem] items-start ${i < ACTIVITY.length - 1 ? 'border-b border-solid border-[rgba(43,35,32,0.05)]' : ''}`}
              >
                <div
                  className="w-[26px] h-[26px] rounded-full text-white flex items-center justify-center shrink-0 mt-[1px]"
                  style={{
                    backgroundColor: a.iconBg,
                  }}
                >
                  {a.icon}
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
              CAD $49,691
            </span>
            <span
              className="font-medium flex items-center gap-[3px]"
              style={{
                fontSize: "0.72rem",
                color: C.teal,
              }}
            >
              <TrendUpIcon /> +11% vs prev week
            </span>
          </div>
        </div>
        <SalesChart />
      </div>
    </div>
  );
}
