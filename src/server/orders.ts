import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/**
 * Reading orders for the console.
 *
 * Deliberately uncached, like the rest of the console: an owner deciding
 * whether to ship something must not be looking at a minute-old snapshot.
 *
 * Statuses come back lowercased because that is what the views already use for
 * their badge colours and tab filters. Money arrives as whole dollars, matching
 * how it is stored.
 */

export type FulfilStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PayStatus = 'paid' | 'pending' | 'refunded';

export type OrderListRow = {
  id: string;
  number: string;
  placedAt: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  itemLabels: string[];
  totalCad: number;
  payment: PayStatus;
  status: FulfilStatus;
};

export type OrderDetail = OrderListRow & {
  customerPhone: string | null;
  address: string;
  paymentMethod: string | null;
  carrier: string | null;
  tracking: string | null;
  items: { name: string; variant: string | null; qty: number; unitCad: number }[];
  subtotalCad: number;
  shippingCad: number;
  discountCad: number;
};

const lower = <T extends string>(value: string) => value.toLowerCase() as T;

/** "1 Sep 2026" — the format the console already renders. */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function addressOf(o: {
  shippingLine1: string; shippingCity: string; shippingState: string | null;
  shippingPostal: string; shippingCountry: string;
}): string {
  return [o.shippingLine1, o.shippingCity, o.shippingState, o.shippingPostal, o.shippingCountry]
    .filter(Boolean)
    .join(', ');
}

export async function listOrders(): Promise<OrderListRow[]> {
  const rows = await withDbRetry('list orders', () =>
    prisma.order.findMany({
      orderBy: { placedAt: 'desc' },
      select: {
        id: true, number: true, placedAt: true,
        customerName: true, customerEmail: true,
        status: true, paymentStatus: true, total: true,
        items: { select: { name: true, quantity: true } },
      },
    })
  );

  return rows.map(o => ({
    id: o.id,
    number: o.number,
    placedAt: formatDate(o.placedAt),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    itemLabels: o.items.map(i => (i.quantity > 1 ? `${i.name} ×${i.quantity}` : i.name)),
    totalCad: Number(o.total),
    payment: lower<PayStatus>(o.paymentStatus),
    status: lower<FulfilStatus>(o.status),
  }));
}

export async function getOrder(id: string): Promise<OrderDetail | null> {
  const o = await withDbRetry('get order', () =>
    prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
  );

  if (!o) return null;

  return {
    id: o.id,
    number: o.number,
    placedAt: formatDate(o.placedAt),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    address: addressOf(o),
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    itemLabels: o.items.map(i => i.name),
    totalCad: Number(o.total),
    payment: lower<PayStatus>(o.paymentStatus),
    status: lower<FulfilStatus>(o.status),
    paymentMethod: o.paymentMethod,
    carrier: o.carrier,
    tracking: o.trackingNumber,
    items: o.items.map(i => ({
      name: i.name,
      variant: i.variant,
      qty: i.quantity,
      unitCad: Number(i.unitPrice),
    })),
    subtotalCad: Number(o.subtotal),
    shippingCad: Number(o.shipping),
    discountCad: Number(o.discount),
  };
}
