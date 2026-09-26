import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/** Public product reviews for the product page. Flagged reviews are hidden. */

export type ProductReview = {
  id: string;
  authorName: string;
  authorLocation: string | null;
  rating: number; // 1–5
  body: string;
  date: string;
  reply: string | null;
  repliedAt: string | null;
};

export type ProductReviews = {
  reviews: ProductReview[];
  average: number; // 0 when none
  count: number;
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

export async function listProductReviews(productId: string): Promise<ProductReviews> {
  const rows = await withDbRetry('reviews: list for product', () =>
    prisma.review.findMany({
      where: { productId, flagged: false },
      orderBy: { createdAt: 'desc' },
    })
  );

  const reviews: ProductReview[] = rows.map(r => ({
    id: r.id,
    authorName: r.authorName,
    authorLocation: r.authorLocation ?? null,
    rating: Math.min(5, Math.max(1, r.rating)),
    body: r.body,
    date: fmtDate(r.createdAt),
    reply: r.reply ?? null,
    repliedAt: r.repliedAt ? fmtDate(r.repliedAt) : null,
  }));

  const count = reviews.length;
  const average = count > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  return { reviews, average, count };
}
