'use client';

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
    value: "£2,840",
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
    value: "£18,450",
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
    total: "£340",
    status: "Payment Received",
    statusType: "received",
  },
  {
    id: "#FTW-2887",
    buyer: "David Mensah",
    item: "Yoruba Filà (Custom)",
    total: "£285",
    status: "Awaiting Fabric",
    statusType: "waiting",
  },
  {
    id: "#FTW-2882",
    buyer: "Bola Adeyemi",
    item: "Adire Wrapper Set",
    total: "£195",
    status: "Ready to Ship",
    statusType: "ready",
  },
  {
    id: "#FTW-2871",
    buyer: "Ngozi Obi",
    item: "Embroidered Cap (Large)",
    total: "£120",
    status: "Payment Received",
    statusType: "received",
  },
  {
    id: "#FTW-2869",
    buyer: "Kwame Asante",
    item: "Aso-Oke Cap ×3",
    total: "£420",
    status: "In Production",
    statusType: "production",
  },
];

const ACTIVITY = [
  {
    icon: <ShoppingBagIcon size={13} />,
    iconBg: C.teal,
    text: "New order from Temi Adeyemi",
    sub: "Aso-Oke Gele Set · £340",
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
      style={{ display: "block", overflow: "visible" }}
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ConsoleDashboard() {
  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI }}>
      {/* Greeting */}
      <div style={{ marginBottom: "1.75rem" }}>
        <p
          style={{
            fontFamily: UI,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(43,35,32,0.4)",
            marginBottom: "0.25rem",
          }}
        >
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
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
          Welcome back, Adunola
        </h1>
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="console-stat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: "1.25rem",
              border: "1px solid rgba(43,35,32,0.07)",
              borderTop: `3px solid ${s.accent}`,
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.63rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(43,35,32,0.45)",
                fontWeight: 500,
                marginBottom: "0.375rem",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: C.charcoal,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            {s.sub && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(43,35,32,0.38)",
                  marginTop: "1px",
                }}
              >
                {s.sub}
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "0.5rem",
                color: s.trendUp ? C.teal : C.maroon,
                fontSize: "0.72rem",
                fontWeight: 500,
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
      <div className="console-lower-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* Orders needing action */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            border: "1px solid rgba(43,35,32,0.07)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem 0.875rem",
              borderBottom: "1px solid rgba(43,35,32,0.06)",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: C.charcoal,
              }}
            >
              Orders Needing Action
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: C.maroon,
                color: "#fff",
                fontSize: "0.62rem",
                fontWeight: 700,
              }}
            >
              {ORDERS.length}
            </span>
          </div>

          <div className="table-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
              <thead>
                <tr>
                  {["Order", "Buyer", "Item", "Total", "Status", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.5rem 1.25rem",
                        textAlign: "left",
                        fontSize: "0.62rem",
                        letterSpacing: "0.09em",
                        textTransform: "uppercase",
                        color: "rgba(43,35,32,0.38)",
                        fontWeight: 500,
                        borderBottom: "1px solid rgba(43,35,32,0.06)",
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
                    style={{
                      backgroundColor: i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.018)",
                    }}
                  >
                    <td
                      style={{
                        padding: "0.7rem 1.25rem",
                        fontSize: "0.77rem",
                        fontWeight: 600,
                        color: C.charcoal,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.id}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.25rem",
                        fontSize: "0.77rem",
                        color: C.charcoal,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.buyer}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.25rem",
                        fontSize: "0.75rem",
                        color: "rgba(43,35,32,0.6)",
                      }}
                    >
                      {o.item}
                    </td>
                    <td
                      style={{
                        padding: "0.7rem 1.25rem",
                        fontSize: "0.77rem",
                        fontWeight: 600,
                        color: C.charcoal,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {o.total}
                    </td>
                    <td style={{ padding: "0.7rem 1.25rem" }}>
                      <StatusBadge status={o.status} type={o.statusType} />
                    </td>
                    <td style={{ padding: "0.7rem 1.25rem" }}>
                      <button
                        style={{
                          backgroundColor: C.gold,
                          color: C.charcoal,
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 12px",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          letterSpacing: "0.02em",
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
          style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            border: "1px solid rgba(43,35,32,0.07)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.25rem 0.875rem",
              borderBottom: "1px solid rgba(43,35,32,0.06)",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: C.charcoal,
              }}
            >
              Recent Activity
            </span>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "0.75rem 1.25rem",
                  alignItems: "flex-start",
                  borderBottom:
                    i < ACTIVITY.length - 1
                      ? "1px solid rgba(43,35,32,0.05)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: a.iconBg,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      color: C.charcoal,
                      lineHeight: 1.3,
                    }}
                  >
                    {a.text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(43,35,32,0.48)",
                      marginTop: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.sub}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(43,35,32,0.32)",
                      marginTop: "3px",
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
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          border: "1px solid rgba(43,35,32,0.07)",
          padding: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: C.charcoal,
                marginBottom: "2px",
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
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: C.charcoal,
                letterSpacing: "-0.03em",
              }}
            >
              £28,890
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                color: C.teal,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "3px",
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
