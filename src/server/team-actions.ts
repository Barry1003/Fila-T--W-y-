'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser, ownerEmails } from './auth';

/**
 * Add or remove console admins. Owner-gated.
 *
 * Adding pre-authorises an email: it upserts a `User` row with `role: OWNER`. On
 * that person's next sign-in `getCurrentUser` adopts the row by email and — via
 * "promote, never demote" — keeps them OWNER, so the console unlocks for them.
 */

export type TeamResult =
  | { ok: true; alreadyHadAccount: boolean }
  | { ok: false; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireOwner() {
  const user = await getCurrentUser().catch(() => null);
  return user?.role === 'OWNER' ? user : null;
}

export async function addTeamMember(emailInput: string): Promise<TeamResult> {
  const me = await requireOwner();
  if (!me) return { ok: false, message: 'You do not have permission to manage the team.' };

  const email = emailInput.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email address.' };

  try {
    const existing = await withDbRetry('team: find by email', () =>
      prisma.user.findUnique({ where: { email }, select: { id: true, role: true } })
    );

    if (existing) {
      if (existing.role === 'OWNER') {
        return { ok: false, message: 'That email is already an admin.' };
      }
      await withDbRetry('team: promote', () =>
        prisma.user.update({ where: { id: existing.id }, data: { role: 'OWNER' } })
      );
      revalidatePath('/console/team');
      return { ok: true, alreadyHadAccount: true };
    }

    // No account yet — create a pending owner row they will adopt on sign-in.
    await withDbRetry('team: create pending owner', () =>
      prisma.user.create({
        data: { email, name: email.split('@')[0], role: 'OWNER' },
      })
    );
    revalidatePath('/console/team');
    return { ok: true, alreadyHadAccount: false };
  } catch (error) {
    console.error('[team] add member failed', error);
    return { ok: false, message: 'Could not add that admin just now. Please try again.' };
  }
}

export async function removeTeamMember(userId: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const me = await requireOwner();
  if (!me) return { ok: false, message: 'You do not have permission to manage the team.' };
  if (userId === me.id) return { ok: false, message: 'You cannot remove your own access.' };

  try {
    const target = await withDbRetry('team: load target', () =>
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true } })
    );
    if (!target || target.role !== 'OWNER') return { ok: false, message: 'That person is not an admin.' };

    // Owners set in OWNER_EMAIL are re-promoted on every sign-in, so removing
    // them here would not stick — block it and point at the environment.
    if (ownerEmails().includes(target.email.toLowerCase())) {
      return { ok: false, message: 'This owner is configured in OWNER_EMAIL — remove it there instead.' };
    }

    // Demote rather than delete: they keep their account and any order history.
    await withDbRetry('team: demote', () =>
      prisma.user.update({ where: { id: userId }, data: { role: 'CUSTOMER' } })
    );
    revalidatePath('/console/team');
    return { ok: true };
  } catch (error) {
    console.error('[team] remove member failed', error);
    return { ok: false, message: 'Could not remove that admin just now. Please try again.' };
  }
}
