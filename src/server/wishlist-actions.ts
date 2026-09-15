'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/**
 * Wishlist writes. Every action is scoped to the signed-in user — a productId
 * is all the browser sends; who it belongs to comes from the session, never the
 * request — so one shopper can never touch another's saved items.
 */

export type WishlistResult =
  | { ok: true; inWishlist: boolean }
  | { ok: false; message: string };

/** Add the product to the wishlist if absent, remove it if present. */
export async function toggleWishlist(productId: string): Promise<WishlistResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to save items.' };
  if (!productId) return { ok: false, message: 'Missing product.' };

  try {
    const inWishlist = await withDbRetry('toggle wishlist', async () => {
      const existing = await prisma.wishlistItem.findUnique({
        where: { userId_productId: { userId: user.id, productId } },
        select: { id: true },
      });
      if (existing) {
        await prisma.wishlistItem.delete({ where: { id: existing.id } });
        return false;
      }
      await prisma.wishlistItem.create({ data: { userId: user.id, productId } });
      return true;
    });

    revalidatePath('/account/wishlist');
    revalidatePath('/account');
    return { ok: true, inWishlist };
  } catch (error) {
    console.error('[wishlist] toggle failed:', error);
    return { ok: false, message: 'Could not update your wishlist just now. Please try again.' };
  }
}

/** Remove a product from the wishlist. Idempotent — already-gone is success. */
export async function removeFromWishlist(productId: string): Promise<WishlistResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to manage your wishlist.' };

  try {
    await withDbRetry('remove from wishlist', () =>
      prisma.wishlistItem.deleteMany({ where: { userId: user.id, productId } })
    );
    revalidatePath('/account/wishlist');
    revalidatePath('/account');
    return { ok: true, inWishlist: false };
  } catch (error) {
    console.error('[wishlist] remove failed:', error);
    return { ok: false, message: 'Could not update your wishlist just now. Please try again.' };
  }
}
