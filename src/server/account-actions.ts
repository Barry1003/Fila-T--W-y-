'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/** Signed-in customer edits their own profile. Email is not editable here (it is
 *  the auth identity); password changes go through the auth client. */

export type ProfileResult = { ok: true } | { ok: false; message: string };

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
