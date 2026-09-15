import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { listProducts } from './catalogue';
import { slugify } from '@/lib/slug';

/**
 * Everything the signed-in shopper sees about *their own* account — orders,
 * wishlist, custom requests, reviews, addresses and cards.
 *
 * The console reads every customer's rows; these readers are always scoped to
 * one `userId`, so a brand-new account comes back empty and the views fall
 * through to their own empty states instead of showing invented sample data.
 *
 * Shapes are chosen to match what each view already renders, so wiring a view
 * to real data is a matter of passing a prop rather than rewriting it.
 */

/* ─── Orders ──────────────────────────────────────────────────── */

export type AccountOrderItem = {
  img: string;
  title: string;
  slug: string;
  variant: string;
  qty: number;
  cad: number;
};

export type AccountTimelineStep = {
  key: string;
  label: string;
  date?: string;
  state: 'done' | 'active' | 'upcoming';
};

export type AccountOrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type AccountOrder = {
  id: string;
  date: string;
  status: AccountOrderStatus;
  items: AccountOrderItem[];
  cadTotal: number;
  address: string;
  tracking?: string;
  timeline: AccountTimelineStep[];
};

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function fmtDay(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' }).format(date);
}

/** Turn a stored status into the five-step delivery timeline the view draws. */
function timelineFor(status: AccountOrderStatus, placedAt: Date): AccountTimelineStep[] {
  const reached: Record<AccountOrderStatus, number> = {
    cancelled: 0, placed: 0, processing: 1, shipped: 2, delivered: 4,
  };
  const steps: { key: string; label: string }[] = [
    { key: 'placed', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];
  const at = reached[status];
  return steps.map((s, i) => ({
    ...s,
    date: i === 0 ? fmtDay(placedAt) : undefined,
    state: i < at ? 'done' : i === at ? 'active' : 'upcoming',
  }));
}

export async function listMyOrders(userId: string): Promise<AccountOrder[]> {
  const rows = await withDbRetry('list my orders', () =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { placedAt: 'desc' },
      include: {
        items: { include: { product: { select: { slug: true, images: { orderBy: { position: 'asc' }, take: 1, select: { url: true } } } } } },
      },
    })
  );

  const statusMap: Record<string, AccountOrderStatus> = {
    NEW: 'placed', PROCESSING: 'processing', SHIPPED: 'shipped', DELIVERED: 'delivered', CANCELLED: 'cancelled',
  };

  return rows.map(o => {
    const status = statusMap[o.status] ?? 'placed';
    const address = [
      o.customerName,
      [o.shippingLine1, o.shippingLine2, o.shippingCity, o.shippingState, o.shippingPostal, o.shippingCountry]
        .filter(Boolean).join(', '),
    ].filter(Boolean).join(' · ');

    return {
      // Stored as "#FTW-2891"; the view re-adds the "#", so hand it the bare number.
      id: o.number.replace(/^#/, ''),
      date: fmtDate(o.placedAt),
      status,
      cadTotal: Number(o.total),
      address,
      tracking: o.trackingNumber ?? undefined,
      timeline: timelineFor(status, o.placedAt),
      items: o.items.map(i => ({
        img: i.product?.images[0]?.url ?? '',
        title: i.name,
        slug: i.product?.slug ?? slugify(i.name),
        variant: i.variant ?? '',
        qty: i.quantity,
        cad: Number(i.unitPrice),
      })),
    };
  });
}

/* ─── Wishlist ────────────────────────────────────────────────── */

export type AccountWishItem = {
  id: string;
  productId: string;
  img: string;
  tag: string;
  title: string;
  slug: string;
  cadNum: number;
  inStock: boolean;
};

export async function listMyWishlist(userId: string): Promise<AccountWishItem[]> {
  const rows = await withDbRetry('list my wishlist', () =>
    prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, productId: true },
    })
  );
  if (rows.length === 0) return [];

  // One cached catalogue read resolves image, price and stock for every row,
  // rather than a query per product against a possibly-cold Neon compute.
  const products = await listProducts();
  const byId = new Map(products.map(p => [p.id, p]));

  return rows.flatMap(row => {
    const p = byId.get(row.productId);
    if (!p) return [];
    return [{
      id: row.id,
      productId: row.productId,
      img: p.imageUrl,
      tag: p.tag,
      title: p.title,
      slug: p.slug,
      cadNum: p.priceCad,
      inStock: p.inStock,
    }];
  });
}

/* ─── Custom requests ─────────────────────────────────────────── */

export type AccountCustomStatus =
  | 'submitted' | 'quoted' | 'approved' | 'in-production' | 'completed' | 'declined';

export type AccountCustomRequest = {
  id: string;
  garmentType: string;
  summary: string;
  submittedDate: string;
  status: AccountCustomStatus;
  occasion: string;
  neededBy: string;
  measurements: { label: string; value: string }[];
  fabricPreference: string;
  colorPreference: string;
  notes: string;
  refImages: { url: string; label: string }[];
  quotedPriceCad?: number;
  estimatedCompletion?: string;
  storeNotes?: string;
  declineReason?: string;
};

export async function listMyCustomRequests(userId: string): Promise<AccountCustomRequest[]> {
  const rows = await withDbRetry('list my custom requests', () =>
    prisma.customRequest.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      include: {
        measurements: { orderBy: { position: 'asc' } },
        referenceImages: true,
      },
    })
  );

  const statusMap: Record<string, AccountCustomStatus> = {
    NEW: 'submitted', QUOTED: 'quoted', APPROVED: 'approved',
    IN_PRODUCTION: 'in-production', COMPLETED: 'completed', DECLINED: 'declined',
  };

  return rows.map(r => {
    const neededBy = r.neededBy ? fmtDate(r.neededBy) : 'Flexible';
    return {
      id: r.reference,
      garmentType: r.garmentType,
      summary: r.neededBy ? `${r.garmentType} — needed by ${neededBy}` : r.garmentType,
      submittedDate: fmtDate(r.submittedAt),
      status: statusMap[r.status] ?? 'submitted',
      occasion: r.occasion ?? '—',
      neededBy,
      measurements: r.measurements.map(m => ({ label: m.label, value: m.value })),
      fabricPreference: r.fabricPreference ?? '—',
      colorPreference: r.colorPreference ?? '—',
      notes: r.notes ?? '',
      refImages: r.referenceImages.map(img => ({ url: img.url, label: img.label ?? 'Reference' })),
      quotedPriceCad: r.quotedPrice != null ? Number(r.quotedPrice) : undefined,
      estimatedCompletion: r.estimatedCompletion ? fmtDate(r.estimatedCompletion) : undefined,
      storeNotes: undefined,
      declineReason: r.declineReason ?? undefined,
    };
  });
}

/* ─── Reviews ─────────────────────────────────────────────────── */

export type AccountReview = {
  id: string;
  product: string;
  slug: string;
  thumbnail: string;
  rating: number;
  date: string;
  body: string;
  photos: string[];
};

export type AccountPendingReview = {
  id: string;
  product: string;
  slug: string;
  thumbnail: string;
  deliveredOn: string;
  orderId: string;
};

export async function listMyReviews(userId: string): Promise<AccountReview[]> {
  const rows = await withDbRetry('list my reviews', () =>
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { title: true, slug: true, images: { orderBy: { position: 'asc' }, take: 1, select: { url: true } } } },
        photos: { select: { url: true } },
      },
    })
  );

  return rows.map(r => ({
    id: r.id,
    product: r.product?.title ?? '',
    slug: r.product?.slug ?? '',
    thumbnail: r.product?.images[0]?.url ?? '',
    rating: r.rating,
    date: fmtDate(r.createdAt),
    body: r.body,
    photos: r.photos.map(p => p.url),
  }));
}

/**
 * Delivered items the shopper has not reviewed yet — one prompt per product,
 * newest delivery first.
 */
export async function listMyPendingReviews(userId: string): Promise<AccountPendingReview[]> {
  // Sequential, not Promise.all: Neon opens a socket per query and firing both
  // at a sleeping compute makes a cold start fail (see catalogue.ts).
  const delivered = await withDbRetry('pending: delivered orders', () =>
    prisma.order.findMany({
      where: { userId, status: 'DELIVERED' },
      orderBy: { placedAt: 'desc' },
      select: {
        number: true, placedAt: true,
        items: { select: { productId: true, name: true, product: { select: { slug: true, images: { orderBy: { position: 'asc' }, take: 1, select: { url: true } } } } } },
      },
    })
  );
  const reviews = await withDbRetry('pending: my reviews', () =>
    prisma.review.findMany({ where: { userId }, select: { productId: true } })
  );

  const reviewed = new Set(reviews.map(r => r.productId));
  const seen = new Set<string>();
  const out: AccountPendingReview[] = [];

  for (const order of delivered) {
    for (const item of order.items) {
      if (!item.productId || reviewed.has(item.productId) || seen.has(item.productId)) continue;
      seen.add(item.productId);
      out.push({
        id: item.productId,
        product: item.name,
        slug: item.product?.slug ?? slugify(item.name),
        thumbnail: item.product?.images[0]?.url ?? '',
        deliveredOn: fmtDate(order.placedAt),
        orderId: order.number,
      });
    }
  }
  return out;
}

/* ─── Addresses & payment ─────────────────────────────────────── */

export type AccountAddress = {
  id: string;
  isDefault: boolean;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone: string;
};

export type AccountPayment = {
  id: string;
  isDefault: boolean;
  brand: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
};

export async function listMyAddresses(userId: string): Promise<AccountAddress[]> {
  const rows = await withDbRetry('list my addresses', () =>
    prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] })
  );
  return rows.map(a => ({
    id: a.id,
    isDefault: a.isDefault,
    name: a.name,
    line1: a.line1,
    line2: a.line2 ?? '',
    city: a.city,
    state: a.state ?? '',
    postal: a.postal,
    country: a.country,
    phone: a.phone ?? '',
  }));
}

export async function listMyPaymentMethods(userId: string): Promise<AccountPayment[]> {
  const rows = await withDbRetry('list my payment methods', () =>
    prisma.paymentMethod.findMany({ where: { userId }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] })
  );
  return rows.map(p => ({
    id: p.id,
    isDefault: p.isDefault,
    brand: p.brand === 'MASTERCARD' ? 'mastercard' : 'visa',
    last4: p.last4,
    expiry: `${String(p.expiryMonth).padStart(2, '0')}/${String(p.expiryYear).slice(-2)}`,
  }));
}

/* ─── Overview snapshot ───────────────────────────────────────── */

export type AccountOverview = {
  activeOrders: number;
  totalOrders: number;
  wishlistCount: number;
  recentOrders: {
    id: string; title: string; date: string; status: AccountOrderStatus; total: string; img: string; slug: string;
  }[];
  wishlistPreview: { id: string; img: string; title: string; slug: string; cadNum: number }[];
};

export function buildOverview(orders: AccountOrder[], wishlist: AccountWishItem[]): AccountOverview {
  const active = orders.filter(o => o.status === 'processing' || o.status === 'shipped' || o.status === 'placed').length;

  return {
    activeOrders: active,
    totalOrders: orders.length,
    wishlistCount: wishlist.length,
    recentOrders: orders.slice(0, 3).map(o => ({
      id: o.id,
      title: o.items[0]?.title ?? 'Order',
      date: o.date,
      status: o.status,
      total: 'CAD $' + o.cadTotal.toLocaleString('en-CA'),
      img: o.items[0]?.img ?? '',
      slug: o.items[0]?.slug ?? '',
    })),
    wishlistPreview: wishlist.slice(0, 4).map(w => ({
      id: w.id, img: w.img, title: w.title, slug: w.slug, cadNum: w.cadNum,
    })),
  };
}
