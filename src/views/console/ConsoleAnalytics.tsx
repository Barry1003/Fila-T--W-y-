'use client';

import { useState } from "react";
import { C, UI } from "../../tokens";

// ── Types ──────────────────────────────────────────────────────────────────────

type DateRange = "7d" | "30d" | "90d";

interface StatSet {
  revenue: number;
  orders: number;
  aov: number;
  convRate: number;
  revTrend: number;
  orderTrend: number;
  aovTrend: number;
  convTrend: number;
  newCustomers: number;
  returningCustomers: number;
  returningPct: number;
  abandonRate: number;
  topSource: string;
}

interface ChartPoint { label: string; value: number }

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS: Record<DateRange, StatSet> = {
  "7d": {
    revenue: 31734, orders: 47,
    aov: 674, convRate: 3.2,
    revTrend: 11.4, orderTrend: 8.7, aovTrend: 2.1, convTrend: -0.4,
    newCustomers: 34, returningCustomers: 13, returningPct: 28, abandonRate: 67, topSource: "Instagram",
  },
  "30d": {
    revenue: 117304, orders: 174,
    aov: 674, convRate: 3.8,
    revTrend: 19.2, orderTrend: 22.1, aovTrend: -3.5, convTrend: 0.9,
    newCustomers: 118, returningCustomers: 56, returningPct: 32, abandonRate: 64, topSource: "Instagram",
  },
  "90d": {
    revenue: 341850, orders: 512,
    aov: 667, convRate: 4.1,
    revTrend: 28.7, orderTrend: 31.0, aovTrend: 1.4, convTrend: 1.2,
    newCustomers: 348, returningCustomers: 164, returningPct: 32, abandonRate: 61, topSource: "Instagram",
  },
};

const CHART_DATA: Record<DateRange, ChartPoint[]> = {
  "7d": [
    { label: "Mon", value: 5504 }, { label: "Tue", value: 7052 },
    { label: "Wed", value: 4816 }, { label: "Thu", value: 8944 },
    { label: "Fri", value: 8256 }, { label: "Sat", value: 10492 },
    { label: "Sun", value: 4885 },
  ],
  "30d": [2800,3400,2200,4100,3600,5200,2800,3900,4400,2600,3100,4800,
          3200,2900,5600,4200,3800,2500,4600,5100,3400,2900,4800,5500,
          3200,4100,2800,5800,4400,2840].map((v, i) => ({ label: String(i + 1), value: v })),
  "90d": [
    { label: "Wk 1", value: 24424 }, { label: "Wk 2", value: 31820 },
    { label: "Wk 3", value: 28896 }, { label: "Wk 4", value: 38012 },
    { label: "Wk 5", value: 33368 }, { label: "Wk 6", value: 42312 },
    { label: "Wk 7", value: 36120 }, { label: "Wk 8", value: 30616 },
    { label: "Wk 9", value: 43344 }, { label: "Wk 10", value: 38528 },
    { label: "Wk 11", value: 48332 }, { label: "Wk 12", value: 42656 },
    { label: "Wk 13", value: 45666 },
  ],
};

const TOP_PRODUCTS = [
  { name: "3-Piece Agbada Set", category: "Agbada", units: 24, revenue: 28070 },
  { name: "Aso-Oke Gele Set", category: "Gele", units: 38, revenue: 23203 },
  { name: "Yoruba Filà (Custom)", category: "Filà", units: 31, revenue: 15196 },
  { name: "Embroidered Cap", category: "Caps", units: 42, revenue: 8669 },
  { name: "Adire Wrapper Set", category: "Wrapper", units: 19, revenue: 6373 },
  { name: "Ipele Wrap (Silk)", category: "Ipele", units: 12, revenue: 5057 },
];

const CATEGORIES = [
  { name: "Agbada Sets", pct: 34, color: C.maroon },
  { name: "Gele / Aso-Oke", pct: 28, color: C.teal },
  { name: "Filà / Caps", pct: 18, color: "#2E4A9E" },
  { name: "Kaftan", pct: 12, color: C.gold },
  { name: "Accessories", pct: 8, color: "#8A6818" },
];

const REGIONS = [
  { name: "United Kingdom", flag: "🇬🇧", orders: 28, revenue: 19264 },
  { name: "Nigeria", flag: "🇳🇬", orders: 9, revenue: 6192 },
  { name: "United States", flag: "🇺🇸", orders: 5, revenue: 3612 },
  { name: "Canada", flag: "🇨🇦", orders: 3, revenue: 2064 },
  { name: "Other", flag: "🌍", orders: 2, revenue: 602 },
];

const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days",
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function fmtCad(n: number): string {
  if (n >= 1_000_000) return `CAD $${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `CAD $${(n / 1_000).toFixed(0)}k`;
  return `CAD $${n.toLocaleString()}`;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], c = pts[i];
    const mx = ((p.x + c.x) / 2).toFixed(1);
    d += ` C ${mx} ${p.y.toFixed(1)} ${mx} ${c.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  }
  return d;
}

// ── Trend indicator ───────────────────────────────────────────────────────────

function Trend({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  const col = up ? C.teal : "#B03A3A";
  return (
    <span
      className="inline-flex items-center gap-[3px] font-medium"
      style={{
        fontSize: "0.72rem",
        color: col
      }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {up
          ? <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
          : <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>}
      </svg>
      {up ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, primary, secondary, trend, trendSuffix = "%", accentColor,
}: {
  label: string;
  primary: string;
  secondary?: string;
  trend: number;
  trendSuffix?: string;
  accentColor: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-5 rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.07)]"
      style={{
        borderTop: `3px solid ${accentColor}`,
      }}>
      <div className="uppercase font-medium mb-1 tracking-[0.1em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.42)" }}>
        {label}
      </div>
      <div className="font-bold leading-none tracking-[-0.03em]" style={{ fontSize: "1.75rem", color: C.charcoal }}>
        {primary}
      </div>
      {secondary && (
        <div className="mt-[1px]" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.38)" }}>{secondary}</div>
      )}
      <div className="flex items-center gap-[6px] mt-2">
        <Trend value={trend} suffix={trendSuffix} />
        <span style={{ fontSize: "0.68rem", color: "rgba(43,35,32,0.35)" }}>vs previous period</span>
      </div>
    </div>
  );
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

function RevenueChart({ data, range }: { data: ChartPoint[]; range: DateRange }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const W = 900, H = 200;
  const PL = 54, PR = 16, PT = 16, PB = 30;
  const iW = W - PL - PR, iH = H - PT - PB;

  const maxVal = Math.max(...data.map((d) => d.value));
  const gridTop = Math.ceil(maxVal / 1000) * 1000;
  const gridFracs = [0, 0.25, 0.5, 0.75, 1];

  const pts = data.map((d, i) => ({
    x: PL + (data.length === 1 ? iW / 2 : (i / (data.length - 1)) * iW),
    y: PT + iH - (d.value / gridTop) * iH,
  }));

  const linePath = smoothPath(pts);
  const areaPath = pts.length > 0
    ? `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(PT + iH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(PT + iH).toFixed(1)} Z`
    : "";

  const maxLabels = 10;
  const labelFreq = Math.max(1, Math.ceil(data.length / maxLabels));

  const colW = iW / data.length;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      className="block overflow-visible"
      aria-label={`Revenue chart — ${RANGE_LABELS[range]}`}
    >
      <defs>
        <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y-axis labels */}
      {gridFracs.map((frac) => {
        const y = PT + iH * (1 - frac);
        const val = gridTop * frac;
        return (
          <g key={frac}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="rgba(43,35,32,0.06)" strokeWidth="1" />
            <text x={PL - 6} y={y + 3.5} textAnchor="end" fontSize="9" fill="rgba(43,35,32,0.35)" fontFamily={UI}>
              {val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#rev-grad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots (only for 7d — sparse data) */}
      {data.length <= 7 && pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={hoveredIdx === i ? 5 : 3} fill={C.gold} stroke="#fff" strokeWidth="2" style={{ transition: "r 0.1s" }} />
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => {
        if (i % labelFreq !== 0 && i !== data.length - 1) return null;
        return (
          <text key={i} x={pts[i].x} y={H - 7} textAnchor="middle" fontSize="9" fill="rgba(43,35,32,0.38)" fontFamily={UI}>
            {d.label}
          </text>
        );
      })}

      {/* Transparent hover columns */}
      {data.map((_, i) => (
        <rect
          key={i}
          x={PL + i * colW}
          y={PT}
          width={colW}
          height={iH}
          fill="transparent"
          style={{ cursor: "crosshair" }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        />
      ))}

      {/* Hover state */}
      {hoveredIdx !== null && (() => {
        const p = pts[hoveredIdx];
        const d = data[hoveredIdx];
        const valStr = d.value >= 1000 ? `$${(d.value / 1000).toFixed(1)}k` : `$${d.value}`;
        const tipW = 62, tipH = 22;
        const tipX = Math.min(Math.max(p.x - tipW / 2, PL), W - PR - tipW);
        const tipY = p.y - tipH - 8;
        return (
          <>
            <line x1={p.x} y1={PT} x2={p.x} y2={PT + iH} stroke="rgba(43,35,32,0.14)" strokeWidth="1" strokeDasharray="4 3" />
            <circle cx={p.x} cy={p.y} r={5} fill={C.gold} stroke="#fff" strokeWidth="2.5" />
            <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={4} fill={C.charcoal} />
            <text x={tipX + tipW / 2} y={tipY + 14.5} textAnchor="middle" fontSize="10" fill="#fff" fontFamily={UI} fontWeight="600">
              {valStr}
            </text>
          </>
        );
      })()}
    </svg>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────

function DonutChart({ segments }: { segments: typeof CATEGORIES }) {
  const r = 62, cx = 80, cy = 80, sw = 24;
  const circ = 2 * Math.PI * r;
  let accDeg = -90;

  return (
    <svg viewBox="0 0 160 160" width="160" height="160" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(43,35,32,0.05)" strokeWidth={sw} />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ - 2;
        const gap = circ - dash;
        const rot = accDeg;
        accDeg += (seg.pct / 100) * 360;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={sw}
            strokeDasharray={`${dash.toFixed(2)} ${gap.toFixed(2)}`}
            transform={`rotate(${rot} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill={C.charcoal} fontFamily={UI}>
        {segments.length}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="8.5" fill="rgba(43,35,32,0.4)" fontFamily={UI}>
        categories
      </text>
    </svg>
  );
}

// ── Insight card ──────────────────────────────────────────────────────────────

function InsightCard({ label, value, sub, accentColor }: { label: string; value: string; sub?: string; accentColor: string }) {
  return (
    <div
      className="p-[1rem_1.125rem] rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.07)]"
      style={{
        borderLeft: `3px solid ${accentColor}`,
      }}>
      <div className="uppercase font-medium mb-1 tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "rgba(43,35,32,0.4)" }}>
        {label}
      </div>
      <div className="font-bold leading-[1.1] tracking-[-0.025em]" style={{ fontSize: "1.4rem", color: C.charcoal }}>
        {value}
      </div>
      {sub && <div className="mt-[3px]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.42)" }}>{sub}</div>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-semibold mb-4" style={{ fontSize: "0.8rem", color: C.charcoal }}>
      {children}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={["rounded-lg overflow-hidden bg-white border border-solid border-[rgba(43,35,32,0.07)]", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}

function CardBody({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={["p-5", className].filter(Boolean).join(" ")} style={style}>{children}</div>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsoleAnalytics() {
  const [range, setRange] = useState<DateRange>("30d");
  const stats = STATS[range];
  const chartData = CHART_DATA[range];
  const maxRevenue = Math.max(...TOP_PRODUCTS.map((p) => p.revenue));
  const maxRegionOrders = Math.max(...REGIONS.map((r) => r.orders));

  return (
    <div className="console-page flex flex-col gap-5 p-7" style={{ fontFamily: UI }}>

      {/* ── Page header row ──────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-semibold m-0 tracking-[-0.02em]" style={{ fontFamily: UI, fontSize: "1.35rem", color: C.charcoal }}>
            Analytics
          </h1>
          <p className="m-[4px_0_0]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
            Store performance overview
          </p>
        </div>
        {/* Date range selector */}
        <div className="relative inline-flex items-center">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="appearance-none cursor-pointer outline-none font-medium bg-white rounded-md border border-solid border-[rgba(43,35,32,0.16)] py-2 pl-[0.875rem] pr-9"
            style={{
              fontFamily: UI,
              fontSize: "0.8rem",
              color: C.charcoal,
            }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <span className="absolute right-[0.625rem] pointer-events-none leading-none" style={{ color: "rgba(43,35,32,0.4)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Top stat cards ────────────────────────────────── */}
      <div className="rg-4 grid grid-cols-[repeat(4,1fr)] gap-4">
        <StatCard
          label="Total Revenue"
          primary={fmtCad(stats.revenue)}
          trend={stats.revTrend}
          accentColor={C.gold}
        />
        <StatCard
          label="Total Orders"
          primary={String(stats.orders)}
          trend={stats.orderTrend}
          accentColor={C.teal}
        />
        <StatCard
          label="Avg. Order Value"
          primary={`CAD $${stats.aov}`}
          trend={stats.aovTrend}
          accentColor={C.maroon}
        />
        <StatCard
          label="Conversion Rate"
          primary={`${stats.convRate}%`}
          trend={stats.convTrend}
          trendSuffix=" pts"
          accentColor="#2E4A9E"
        />
      </div>

      {/* ── Revenue trend chart ───────────────────────────── */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-semibold mb-[2px]" style={{ fontSize: "0.8rem", color: C.charcoal }}>
                Revenue Trend
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>
                {RANGE_LABELS[range]}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold tracking-[-0.03em]" style={{ fontSize: "1.5rem", color: C.charcoal }}>
                {fmtCad(stats.revenue)}
              </span>
              <Trend value={stats.revTrend} />
            </div>
          </div>
          <RevenueChart data={chartData} range={range} />
        </CardBody>
      </Card>

      {/* ── Two-column: Products + Categories ─────────────── */}
      <div className="rg-split grid grid-cols-[1fr_360px] gap-4">

        {/* Top Products */}
        <Card>
          <CardBody>
            <SectionHead>Top Products</SectionHead>
            <div className="flex flex-col gap-[0.125rem]">
              {TOP_PRODUCTS.map((p, i) => {
                const barPct = (p.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={p.name}
                    className={`flex items-center gap-[0.875rem] py-[0.625rem] px-3 rounded-[6px] ${i % 2 === 0 ? 'bg-transparent' : 'bg-[rgba(43,35,32,0.018)]'}`}
                  >
                    {/* Rank */}
                    <span className="font-semibold text-center shrink-0 w-4" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.3)" }}>
                      {i + 1}
                    </span>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: "0.82rem", color: C.charcoal }}>
                        {p.name}
                      </div>
                      <div className="mt-[1px]" style={{ fontSize: "0.66rem", color: "rgba(43,35,32,0.4)" }}>{p.category}</div>
                    </div>

                    {/* Bar */}
                    <div className="w-[100px] shrink-0">
                      <div className="h-[5px] rounded-[3px] overflow-hidden bg-[rgba(43,35,32,0.08)]">
                        <div className="h-full rounded-[3px]" style={{ width: `${barPct}%`, backgroundColor: C.gold }} />
                      </div>
                    </div>

                    {/* Units */}
                    <div className="w-[52px] text-right shrink-0">
                      <div style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.5)" }}>{p.units} sold</div>
                    </div>

                    {/* Revenue */}
                    <div className="w-[64px] text-right shrink-0">
                      <div className="font-semibold" style={{ fontSize: "0.82rem", color: C.charcoal }}>
                        {fmtCad(p.revenue)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardBody className="flex flex-col h-full box-border">
            <SectionHead>Sales by Category</SectionHead>
            <div className="flex flex-col items-center gap-5">
              {/* Donut */}
              <DonutChart segments={CATEGORIES} />

              {/* Legend */}
              <div className="w-full flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-[0.625rem]">
                    <span className="w-[10px] h-[10px] rounded-[2px] shrink-0 block" style={{ backgroundColor: cat.color }} />
                    <span className="flex-1" style={{ fontSize: "0.77rem", color: C.charcoal }}>{cat.name}</span>
                    <span className="font-semibold" style={{ fontSize: "0.77rem", color: C.charcoal }}>{cat.pct}%</span>
                    {/* Mini bar */}
                    <div className="w-[50px] h-1 rounded-[2px] overflow-hidden bg-[rgba(43,35,32,0.07)]">
                      <div className="h-full rounded-[2px]" style={{ width: `${cat.pct * (100 / 34)}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Traffic & customer insight cards ──────────────── */}
      <div>
        <div className="uppercase font-medium mb-3 tracking-[0.1em]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.38)" }}>
          Traffic & Customers
        </div>
        <div className="rg-4 grid grid-cols-[repeat(4,1fr)] gap-[0.875rem]">
          <InsightCard
            label="New Customers"
            value={String(stats.newCustomers)}
            sub={`${RANGE_LABELS[range]}`}
            accentColor={C.teal}
          />
          <InsightCard
            label="Returning Customers"
            value={String(stats.returningCustomers)}
            sub={`${stats.returningPct}% of total buyers`}
            accentColor="#2E4A9E"
          />
          <InsightCard
            label="Top Traffic Source"
            value={stats.topSource}
            sub="Social — organic & paid"
            accentColor={C.gold}
          />
          <InsightCard
            label="Cart Abandonment"
            value={`${stats.abandonRate}%`}
            sub="Industry avg ~69%"
            accentColor={C.maroon}
          />
        </div>
      </div>

      {/* ── Orders by region ──────────────────────────────── */}
      <Card>
        <CardBody>
          <SectionHead>Orders by Region</SectionHead>
          <div className="flex flex-col gap-[0.625rem]">
            {REGIONS.map((reg) => {
              const barPct = (reg.orders / maxRegionOrders) * 100;
              return (
                <div key={reg.name} className="flex items-center gap-4">
                  {/* Flag + name */}
                  <div className="flex items-center gap-2 w-[180px] shrink-0">
                    <span style={{ fontSize: "1rem" }}>{reg.flag}</span>
                    <span className="font-medium" style={{ fontSize: "0.8rem", color: C.charcoal }}>{reg.name}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1">
                    <div className="h-2 rounded-[4px] overflow-hidden bg-[rgba(43,35,32,0.07)]">
                      <div
                        className="h-full rounded-[4px]"
                        style={{
                          width: `${barPct}%`,
                          backgroundColor: C.maroon,
                          opacity: 0.75 + (barPct / 100) * 0.25,
                        }}
                      />
                    </div>
                  </div>

                  {/* Orders count */}
                  <div className="w-[70px] text-right shrink-0">
                    <span style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.5)" }}>
                      {reg.orders} order{reg.orders !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="w-[72px] text-right shrink-0">
                    <span className="font-semibold" style={{ fontSize: "0.82rem", color: C.charcoal }}>
                      {fmtCad(reg.revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

    </div>
  );
}
