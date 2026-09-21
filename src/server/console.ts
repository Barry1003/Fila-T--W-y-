import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/**
 * Read models for the owner console's Reviews, Custom Orders and Messages tabs.
 * Shaped to match what those views already render, so wiring a tab to real data
 * is a prop swap. Uncached like the rest of the console — the owner must see the
 * current state, not a snapshot.
 */

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

function fmtDateTime(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ─── Reviews ─────────────────────────────────────────────────── */

export type ConsoleReview = {
  id: string;
  customer: { name: string; initials: string; location: string };
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  product: { name: string; img: string };
  text: string;
  photos: string[];
  reply: string | null;
  repliedAt?: string;
  flagged: boolean;
};

export type ReviewStats = {
  average: number;
  total: number;
  breakdown: { stars: number; count: number; pct: number }[];
  responseRate: number;
  responded: number;
};

export async function listConsoleReviews(): Promise<{ reviews: ConsoleReview[]; stats: ReviewStats }> {
  const rows = await withDbRetry('console: reviews', () =>
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { title: true, images: { orderBy: { position: 'asc' }, take: 1, select: { url: true } } } },
        photos: { select: { url: true } },
      },
    })
  );

  const reviews: ConsoleReview[] = rows.map(r => ({
    id: r.id,
    customer: {
      name: r.authorName,
      initials: initialsOf(r.authorName),
      location: r.authorLocation ?? '',
    },
    rating: (Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5),
    date: fmtDate(r.createdAt),
    product: { name: r.product?.title ?? 'Product', img: r.product?.images[0]?.url ?? '' },
    text: r.body,
    photos: r.photos.map(p => p.url),
    reply: r.reply ?? null,
    repliedAt: r.repliedAt ? fmtDate(r.repliedAt) : undefined,
    flagged: r.flagged,
  }));

  const total = reviews.length;
  const responded = reviews.filter(r => r.reply !== null).length;
  const breakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    return { stars, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
  const average = total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;

  return {
    reviews,
    stats: {
      average,
      total,
      breakdown,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
      responded,
    },
  };
}

/* ─── Custom requests ─────────────────────────────────────────── */

export type ConsoleCustomStatus = 'new' | 'quoted' | 'approved' | 'in-production' | 'completed' | 'declined';

export type ConsoleCustomRequest = {
  id: string;
  garmentType: string;
  submittedDate: string;
  status: ConsoleCustomStatus;
  customer: { name: string; email: string; phone: string; location: string };
  occasion: string;
  neededBy: string;
  measurements: { label: string; value: string }[];
  fabricPreference: string;
  colorPreference: string;
  additionalNotes: string;
  refImages: { url: string; label: string }[];
  quotedPrice?: number;
  estimatedCompletion?: string;
  declineReason?: string;
};

const CUSTOM_STATUS: Record<string, ConsoleCustomStatus> = {
  NEW: 'new', QUOTED: 'quoted', APPROVED: 'approved',
  IN_PRODUCTION: 'in-production', COMPLETED: 'completed', DECLINED: 'declined',
};

export async function listConsoleCustomRequests(): Promise<ConsoleCustomRequest[]> {
  const rows = await withDbRetry('console: custom requests', () =>
    prisma.customRequest.findMany({
      orderBy: { submittedAt: 'desc' },
      include: { measurements: { orderBy: { position: 'asc' } }, referenceImages: true },
    })
  );

  return rows.map(r => ({
    id: r.reference,
    garmentType: r.garmentType,
    submittedDate: fmtDate(r.submittedAt),
    status: CUSTOM_STATUS[r.status] ?? 'new',
    customer: {
      name: r.customerName,
      email: r.customerEmail,
      phone: r.customerPhone ?? '',
      location: r.customerLocation ?? '',
    },
    occasion: r.occasion ?? '—',
    neededBy: r.neededBy ? fmtDate(r.neededBy) : 'Flexible',
    measurements: r.measurements.map(m => ({ label: m.label, value: m.value })),
    fabricPreference: r.fabricPreference ?? '—',
    colorPreference: r.colorPreference ?? '—',
    additionalNotes: r.notes ?? '',
    refImages: r.referenceImages.map(img => ({ url: img.url, label: img.label ?? 'Reference' })),
    quotedPrice: r.quotedPrice != null ? Number(r.quotedPrice) : undefined,
    estimatedCompletion: r.estimatedCompletion ? fmtDate(r.estimatedCompletion) : undefined,
    declineReason: r.declineReason ?? undefined,
  }));
}

/* ─── Conversations (Messages) ────────────────────────────────── */

export type ConsoleMessage = { id: string; sender: 'customer' | 'owner'; text: string; timestamp: string };

export type ConsoleConversation = {
  id: string;
  customerName: string;
  subject: string;
  tag: 'order' | 'custom' | null;
  tagLabel?: string;
  preview: string;
  date: string;
  unread: boolean;
  resolved: boolean;
  messages: ConsoleMessage[];
};

export async function listConsoleConversations(): Promise<ConsoleConversation[]> {
  const rows = await withDbRetry('console: conversations', () =>
    prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        order: { select: { number: true } },
        messages: { orderBy: { sentAt: 'asc' } },
      },
    })
  );

  return rows.map(c => {
    const tag = c.tag === 'ORDER' ? 'order' : c.tag === 'CUSTOM_REQUEST' ? 'custom' : null;
    const tagLabel = tag === 'order' ? (c.order?.number ?? undefined) : tag === 'custom' ? 'Custom Request' : undefined;
    const last = c.messages[c.messages.length - 1];
    return {
      id: c.id,
      customerName: c.customerName,
      subject: c.subject,
      tag,
      tagLabel,
      preview: last ? last.body.slice(0, 72) : '',
      date: fmtDateTime(c.updatedAt),
      unread: c.unread,
      resolved: c.resolved,
      messages: c.messages.map(m => ({
        id: m.id,
        sender: m.sender === 'CUSTOMER' ? 'customer' : 'owner',
        text: m.body,
        timestamp: fmtDateTime(m.sentAt),
      })),
    };
  });
}

/* ─── Promotions & Banners ────────────────────────────────────── */

export type ConsoleDiscountCode = {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount';
  value: string;
  usedCount: number;
  limitCount: number | null;
  active: boolean;
  expiry: string;
  expired: boolean;
};

export async function listDiscountCodes(): Promise<ConsoleDiscountCode[]> {
  const rows = await withDbRetry('console: discount codes', () =>
    prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })
  );

  const now = new Date();
  return rows.map(r => {
    const expired = !!r.expiresAt && r.expiresAt < now;
    return {
      id: r.id,
      code: r.code,
      type: r.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount',
      value: r.type === 'PERCENTAGE' ? `${Number(r.value)}%` : `CAD $${Number(r.value)}`,
      usedCount: r.usedCount,
      limitCount: r.usageLimit ?? null,
      active: r.active,
      expiry: r.expiresAt ? fmtDate(r.expiresAt) : 'No expiry',
      expired,
    };
  });
}

export type ConsoleBanner = {
  id: string;
  text: string;
  cta: string;
  dateRange: string;
  status: 'Live' | 'Scheduled' | 'Expired';
};

export async function listBanners(): Promise<ConsoleBanner[]> {
  const rows = await withDbRetry('console: banners', () =>
    prisma.banner.findMany({ orderBy: { position: 'asc' } })
  );

  return rows.map(r => {
    let status: 'Live' | 'Scheduled' | 'Expired' = 'Scheduled';
    if (r.status === 'LIVE') status = 'Live';
    else if (r.status === 'EXPIRED') status = 'Expired';
    return {
      id: r.id,
      text: r.text,
      cta: r.ctaLabel ?? '',
      dateRange: `${fmtDate(r.startsAt)} – ${fmtDate(r.endsAt)}`,
      status,
    };
  });
}
