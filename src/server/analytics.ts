import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/**
 * Store analytics, computed from real orders — no fixtures. Everything is
 * derived from the `Order` / `OrderItem` tables so the console reflects what has
 * actually happened. Metrics that would need traffic tracking we do not collect
 * (conversion rate, traffic source, cart abandonment) are deliberately absent
 * rather than faked.
 *
 * One query pulls the last 180 days of orders; each range (7/30/90 days) and its
 * previous-period comparison are derived from that set in memory, so the client
 * can switch ranges without another round-trip.
 */

export type RangeKey = '7d' | '30d' | '90d';

export type AnalyticsStats = {
  revenue: number;
  orders: number;
  aov: number;
  itemsSold: number;
  revTrend: number;
  orderTrend: number;
  aovTrend: number;
  itemsTrend: number;
  newCustomers: number;
  returningCustomers: number;
  returningPct: number;
  pendingOrders: number;
};

export type ChartPoint = { label: string; value: number };
export type ProductRow = { name: string; category: string; units: number; revenue: number };
export type CategoryRow = { name: string; pct: number; revenue: number };
export type RegionRow = { name: string; flag: string; orders: number; revenue: number };

export type RangeData = {
  stats: AnalyticsStats;
  chart: ChartPoint[];
  topProducts: ProductRow[];
  categories: CategoryRow[];
  regions: RegionRow[];
};

export type AnalyticsData = {
  ranges: Record<RangeKey, RangeData>;
  hasAnyOrders: boolean;
};

const DAY = 86_400_000;
const RANGE_DAYS: Record<RangeKey, number> = { '7d': 7, '30d': 30, '90d': 90 };

type OrderRow = {
  placedAt: Date;
  total: number;
  paymentStatus: string;
  email: string;
  country: string;
  items: { quantity: number; unitPrice: number; name: string; category: string }[];
};

function pctChange(cur: number, prev: number): number {
  if (prev <= 0) return cur > 0 ? 100 : 0;
  return ((cur - prev) / prev) * 100;
}

/** ISO-ish country name / 2-letter code → flag emoji. Falls back to a globe. */
const FLAGS: Record<string, string> = {
  canada: '🇨🇦', ca: '🇨🇦',
  nigeria: '🇳🇬', ng: '🇳🇬',
  'united kingdom': '🇬🇧', uk: '🇬🇧', gb: '🇬🇧', 'great britain': '🇬🇧',
  'united states': '🇺🇸', usa: '🇺🇸', us: '🇺🇸', 'united states of america': '🇺🇸',
  ghana: '🇬🇭', gh: '🇬🇭',
  ireland: '🇮🇪', ie: '🇮🇪',
  germany: '🇩🇪', de: '🇩🇪',
  france: '🇫🇷', fr: '🇫🇷',
  australia: '🇦🇺', au: '🇦🇺',
};

function flagFor(country: string): string {
  return FLAGS[country.trim().toLowerCase()] ?? '🌍';
}

function computeRange(orders: OrderRow[], key: RangeKey, now: number): RangeData {
  const days = RANGE_DAYS[key];
  const start = now - days * DAY;
  const prevStart = now - 2 * days * DAY;

  const cur = orders.filter(o => o.placedAt.getTime() >= start);
  const prev = orders.filter(o => {
    const t = o.placedAt.getTime();
    return t >= prevStart && t < start;
  });

  const sum = (rows: OrderRow[]) => rows.reduce((s, o) => s + o.total, 0);
  const items = (rows: OrderRow[]) => rows.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0);

  const revenue = sum(cur);
  const orderCount = cur.length;
  const aov = orderCount ? revenue / orderCount : 0;
  const itemsSold = items(cur);

  const prevRevenue = sum(prev);
  const prevOrders = prev.length;
  const prevAov = prevOrders ? prevRevenue / prevOrders : 0;

  // New vs returning: a buyer is "returning" for this range if they placed an
  // order before the range started (within the fetched window); otherwise new.
  const earliestByEmail = new Map<string, number>();
  for (const o of orders) {
    const t = o.placedAt.getTime();
    const prevT = earliestByEmail.get(o.email);
    if (prevT === undefined || t < prevT) earliestByEmail.set(o.email, t);
  }
  const buyers = new Set(cur.map(o => o.email));
  let newCustomers = 0;
  let returningCustomers = 0;
  for (const email of buyers) {
    if ((earliestByEmail.get(email) ?? Infinity) >= start) newCustomers++;
    else returningCustomers++;
  }
  const totalBuyers = newCustomers + returningCustomers;
  const returningPct = totalBuyers ? Math.round((returningCustomers / totalBuyers) * 100) : 0;

  const pendingOrders = cur.filter(o => o.paymentStatus === 'PENDING').length;

  // Chart: daily buckets for 7/30 days, weekly buckets for 90.
  const chart: ChartPoint[] = [];
  if (key === '90d') {
    const weeks = 13;
    for (let w = weeks - 1; w >= 0; w--) {
      const bStart = now - (w + 1) * 7 * DAY;
      const bEnd = now - w * 7 * DAY;
      const value = cur
        .filter(o => o.placedAt.getTime() >= bStart && o.placedAt.getTime() < bEnd)
        .reduce((s, o) => s + o.total, 0);
      chart.push({ label: `Wk ${weeks - w}`, value });
    }
  } else {
    for (let d = days - 1; d >= 0; d--) {
      const bStart = now - (d + 1) * DAY;
      const bEnd = now - d * DAY;
      const value = cur
        .filter(o => o.placedAt.getTime() >= bStart && o.placedAt.getTime() < bEnd)
        .reduce((s, o) => s + o.total, 0);
      const label = key === '7d'
        ? new Intl.DateTimeFormat('en-CA', { weekday: 'short' }).format(new Date(bEnd - DAY / 2))
        : String(days - d);
      chart.push({ label, value });
    }
  }

  // Top products (by revenue) from the line items.
  const prodMap = new Map<string, ProductRow>();
  for (const o of cur) {
    for (const it of o.items) {
      const key2 = `${it.name}|||${it.category}`;
      const row = prodMap.get(key2) ?? { name: it.name, category: it.category, units: 0, revenue: 0 };
      row.units += it.quantity;
      row.revenue += it.quantity * it.unitPrice;
      prodMap.set(key2, row);
    }
  }
  const topProducts = [...prodMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  // Sales by category (by revenue), top 5 + Other.
  const catMap = new Map<string, number>();
  for (const o of cur) {
    for (const it of o.items) {
      catMap.set(it.category, (catMap.get(it.category) ?? 0) + it.quantity * it.unitPrice);
    }
  }
  const catTotal = [...catMap.values()].reduce((s, v) => s + v, 0);
  const sortedCats = [...catMap.entries()].sort((a, b) => b[1] - a[1]);
  const topCats = sortedCats.slice(0, 5);
  const otherRev = sortedCats.slice(5).reduce((s, [, v]) => s + v, 0);
  const categories: CategoryRow[] = topCats.map(([name, rev]) => ({
    name,
    revenue: rev,
    pct: catTotal ? Math.round((rev / catTotal) * 100) : 0,
  }));
  if (otherRev > 0) {
    categories.push({ name: 'Other', revenue: otherRev, pct: catTotal ? Math.round((otherRev / catTotal) * 100) : 0 });
  }

  // Orders by region (shipping country).
  const regMap = new Map<string, { orders: number; revenue: number }>();
  for (const o of cur) {
    const name = o.country.trim() || 'Unknown';
    const row = regMap.get(name) ?? { orders: 0, revenue: 0 };
    row.orders += 1;
    row.revenue += o.total;
    regMap.set(name, row);
  }
  const regions: RegionRow[] = [...regMap.entries()]
    .map(([name, v]) => ({ name, flag: flagFor(name), orders: v.orders, revenue: v.revenue }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 6);

  return {
    stats: {
      revenue,
      orders: orderCount,
      aov,
      itemsSold,
      revTrend: pctChange(revenue, prevRevenue),
      orderTrend: pctChange(orderCount, prevOrders),
      aovTrend: pctChange(aov, prevAov),
      itemsTrend: pctChange(itemsSold, items(prev)),
      newCustomers,
      returningCustomers,
      returningPct,
      pendingOrders,
    },
    chart,
    topProducts,
    categories,
    regions,
  };
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const now = Date.now();
  const windowStart = new Date(now - 180 * DAY);

  const rows = await withDbRetry('analytics: orders', () =>
    prisma.order.findMany({
      where: { placedAt: { gte: windowStart } },
      select: {
        placedAt: true,
        total: true,
        paymentStatus: true,
        customerEmail: true,
        shippingCountry: true,
        items: {
          select: {
            quantity: true,
            unitPrice: true,
            name: true,
            product: { select: { category: { select: { name: true } } } },
          },
        },
      },
    })
  );

  const orders: OrderRow[] = rows.map(o => ({
    placedAt: o.placedAt,
    total: Number(o.total),
    paymentStatus: String(o.paymentStatus),
    email: o.customerEmail.trim().toLowerCase(),
    country: o.shippingCountry ?? '',
    items: o.items.map(i => ({
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      name: i.name,
      category: i.product?.category?.name ?? 'Uncategorised',
    })),
  }));

  return {
    hasAnyOrders: orders.length > 0,
    ranges: {
      '7d': computeRange(orders, '7d', now),
      '30d': computeRange(orders, '30d', now),
      '90d': computeRange(orders, '90d', now),
    },
  };
}
