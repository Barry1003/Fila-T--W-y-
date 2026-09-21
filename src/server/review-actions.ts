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
