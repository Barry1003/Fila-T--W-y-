import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/**
 * The owner console's home dashboard, from real orders and catalogue — no more
 * invented figures. Everything derives from one orders read (since the start of
 * last month, enough for today / week / month / prior-month comparisons) plus a
 * product count and a low-stock check.
 */

export type DashOrder = { id: string; buyer: string; item: string; total: string; status: string; statusType: string };
export type DashActivity = { kind: 'order' | 'lowstock'; text: string; sub: string; time: string };
export type DashChartPoint = { label: string; value: number; isToday: boolean };

export type DashboardData = {
  todaySales: number;
  todayTrendPct: number | null;
  pendingCount: number;
  totalProducts: number;
  lowStockCount: number;
  monthRevenue: number;
  monthTrendPct: number | null;
  orders: DashOrder[];
  activity: DashActivity[];
  chart: DashChartPoint[];
  weekTotal: number;
};

function relTime(d: Date): string {
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? 's' : ''} ago`;
  const days = Math.floor(h / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday); startYesterday.setDate(startYesterday.getDate() - 1);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const upperNow = new Date(now.getTime() + 1);

  const orders = await withDbRetry('dashboard: orders', () =>
    prisma.order.findMany({
      where: { placedAt: { gte: startPrevMonth } },
      orderBy: { placedAt: 'desc' },
      select: {
        number: true, placedAt: true, status: true, total: true, customerName: true,
        items: { select: { name: true, quantity: true } },
      },
    })
  );

  const totalProducts = await withDbRetry('dashboard: product count', () => prisma.product.count());

  const lowStockRows = await withDbRetry('dashboard: low stock', () =>
    prisma.productVariant.findMany({ where: { stock: { lte: 3, gt: 0 } }, select: { productId: true } })
  );
  const lowStockCount = new Set(lowStockRows.map(r => r.productId)).size;

  const num = (d: unknown) => Number(d);
  const sumBetween = (from: Date, to: Date) =>
    orders
      .filter(o => o.status !== 'CANCELLED' && o.placedAt >= from && o.placedAt < to)
      .reduce((s, o) => s + num(o.total), 0);

  const todaySales = sumBetween(startToday, upperNow);
  const yesterdaySales = sumBetween(startYesterday, startToday);
  const monthRevenue = sumBetween(startMonth, upperNow);
  const prevMonthRevenue = sumBetween(startPrevMonth, startMonth);

  const pct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null);
  const cad = (n: number) => 'CAD $' + Math.round(n).toLocaleString('en-CA');

  const STATUS: Record<string, { label: string; type: string }> = {
    NEW: { label: 'New Order', type: 'received' },
    PROCESSING: { label: 'In Production', type: 'production' },
  };
  const actionable = orders.filter(o => o.status === 'NEW' || o.status === 'PROCESSING');
  const dashOrders: DashOrder[] = actionable.slice(0, 6).map(o => {
    const first = o.items[0];
    const item = first
      ? (o.items.length > 1 ? `${first.name} +${o.items.length - 1} more` : (first.quantity > 1 ? `${first.name} ×${first.quantity}` : first.name))
      : 'Order';
    const st = STATUS[o.status] ?? { label: o.status, type: 'received' };
    return { id: o.number, buyer: o.customerName, item, total: cad(num(o.total)), status: st.label, statusType: st.type };
  });

  const activity: DashActivity[] = orders.slice(0, 4).map(o => ({
    kind: 'order' as const,
    text: `New order from ${o.customerName}`,
    sub: `${o.items[0]?.name ?? 'Order'} · ${cad(num(o.total))}`,
    time: relTime(o.placedAt),
  }));
  if (lowStockCount > 0) {
    activity.push({ kind: 'lowstock', text: 'Low stock alert', sub: `${lowStockCount} product${lowStockCount !== 1 ? 's' : ''} running low`, time: '' });
  }

  const chart: DashChartPoint[] = [];
  let weekTotal = 0;
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(startToday); dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
    const value = sumBetween(dayStart, dayEnd);
    weekTotal += value;
    chart.push({ label: dayStart.toLocaleDateString('en-GB', { weekday: 'short' }), value, isToday: i === 0 });
  }

  return {
    todaySales,
    todayTrendPct: pct(todaySales, yesterdaySales),
    pendingCount: actionable.length,
    totalProducts,
    lowStockCount,
    monthRevenue,
    monthTrendPct: pct(monthRevenue, prevMonthRevenue),
    orders: dashOrders,
    activity,
    chart,
    weekTotal,
  };
}
