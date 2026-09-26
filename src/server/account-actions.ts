'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/** Signed-in customer edits their own profile. Email is not editable here (it is
 *  the auth identity); password changes go through the auth client. */

export type ProfileResult = { ok: true } | { ok: false; message: string };

/**
 * Permanently deletes the signed-in customer's account.
 *
 * The `User` row is removed — which cascades their addresses, saved cards and
 * wishlist, and sets `userId` to null on orders/reviews/custom-requests so the
 * store's business records survive as anonymised history. The linked Neon Auth
 * identity (session/account/user rows in the `neon_auth` schema, keyed by the
 * auth id we hold in `User.appwriteId`) is deleted too, so the login is gone,
 * not just the shop data. The owner account is protected from this flow.
 */
export async function deleteMyAccount(): Promise<ProfileResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in first.' };

  const row = await withDbRetry('account: load for delete', () =>
    prisma.user.findUnique({ where: { id: user.id }, select: { appwriteId: true, role: true } })
  ).catch(() => null);

  if (row?.role === 'OWNER') {
    return { ok: false, message: 'The store owner account cannot be deleted here.' };
  }

  try {
    // Remove the shop-side record first (cascades personal data, anonymises orders).
    await withDbRetry('account: delete user', () => prisma.user.delete({ where: { id: user.id } }));

    // Then the auth identity, child rows before the parent. Each is best-effort:
    // the shop data is already gone, so a stray auth row must not fail the flow.
    const authId = row?.appwriteId;
    if (authId) {
      const statements = [
        `DELETE FROM neon_auth."session" WHERE "userId" = $1`,
        `DELETE FROM neon_auth."account" WHERE "userId" = $1`,
        `DELETE FROM neon_auth."member" WHERE "userId" = $1`,
        `DELETE FROM neon_auth."user" WHERE "id" = $1`,
      ];
      for (const sql of statements) {
        try {
          await withDbRetry('account: delete auth row', () => prisma.$executeRawUnsafe(sql, authId));
        } catch (e) {
          console.error('[account] auth row delete failed', sql, e);
        }
      }
    }

    return { ok: true };
  } catch (error) {
    console.error('[account] delete account failed', error);
    return { ok: false, message: 'Could not delete your account just now. Please try again.' };
  }
}

export async function updateProfile(input: { name: string; phone?: string }): Promise<ProfileResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to update your profile.' };

  const name = input.name.trim();
  if (name.length < 2) return { ok: false, message: 'Please enter your name.' };
  const phone = input.phone?.trim().slice(0, 40) || null;

  try {
    await withDbRetry('account: update profile', () =>
      prisma.user.update({ where: { id: user.id }, data: { name, phone } })
    );
    revalidatePath('/account/settings');
    revalidatePath('/account');
    return { ok: true };
  } catch (error) {
    console.error('[account] update profile failed', error);
    return { ok: false, message: 'Could not save your profile just now. Please try again.' };
  }
}
