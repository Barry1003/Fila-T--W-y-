'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/** Owner replies to / moderates customer reviews. Owner-gated. */

export type ReviewActionResult = { ok: true } | { ok: false; message: string };

async function requireOwner() {
  const user = await getCurrentUser().catch(() => null);
  return user?.role === 'OWNER';
}

/**
 * A signed-in customer submits a review for a product. Owner reply/flag stay
 * below and are owner-gated; this one only needs a signed-in user.
 */
export async function submitReview(
  productId: string,
  rating: number,
  body: string
): Promise<ReviewActionResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to write a review.' };

  const r = Math.round(rating);
  if (!(r >= 1 && r <= 5)) return { ok: false, message: 'Choose a rating from 1 to 5 stars.' };
  const text = body.trim().slice(0, 2000);
  if (text.length < 3) return { ok: false, message: 'Please write a few words about the product.' };

  try {
    const product = await withDbRetry('review: check product', () =>
      prisma.product.findUnique({ where: { id: productId }, select: { id: true } })
    );
    if (!product) return { ok: false, message: 'Product not found.' };

    // One review per customer per product — update it if they review again.
    const existing = await withDbRetry('review: find existing', () =>
      prisma.review.findFirst({ where: { productId, userId: user.id }, select: { id: true } })
    );

    if (existing) {
      await withDbRetry('review: update', () =>
        prisma.review.update({ where: { id: existing.id }, data: { rating: r, body: text, authorName: user.name } })
      );
    } else {
      await withDbRetry('review: create', () =>
        prisma.review.create({
          data: { productId, userId: user.id, authorName: user.name, rating: r, body: text },
        })
      );
    }

    revalidatePath('/console/reviews');
    return { ok: true };
  } catch (error) {
    console.error('[review submit] failed', error);
    return { ok: false, message: 'Could not save your review just now. Please try again.' };
  }
}

export async function replyToReview(id: string, text: string): Promise<ReviewActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to reply.' };
  const body = text.trim();
  if (!body) return { ok: false, message: 'Reply cannot be empty.' };

  try {
    await withDbRetry('reply to review', () =>
      prisma.review.update({ where: { id }, data: { reply: body, repliedAt: new Date() } })
    );
    revalidatePath('/console/reviews');
    return { ok: true };
  } catch (error) {
    console.error('[review reply] failed', error);
    return { ok: false, message: 'Could not post your reply just now. Please try again.' };
  }
}

export async function setReviewFlagged(id: string, flagged: boolean): Promise<ReviewActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to moderate reviews.' };

  try {
    await withDbRetry('flag review', () => prisma.review.update({ where: { id }, data: { flagged } }));
    revalidatePath('/console/reviews');
    return { ok: true };
  } catch (error) {
    console.error('[review flag] failed', error);
    return { ok: false, message: 'Could not update this review just now. Please try again.' };
  }
}
