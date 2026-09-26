import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { auth } from '@/lib/auth/server';

/**
 * Bridges Neon Auth (Better Auth) identity to the shop's own records.
 *
 * Neon Auth knows who someone is; this database knows their orders, wishlist and
 * addresses. The auth account id is the join, deliberately not email — people
 * change their email address, and matching on it would hand one person's order
 * history to another.
 *
 * The join is stored in `User.appwriteId`. The column keeps its old name (a
 * rename would need a migration), but it now holds the Neon Auth user id — it is
 * simply "the external auth account this row belongs to".
 */

/**
 * The bootstrap owner addresses, from OWNER_EMAIL.
 *
 * Accepts more than one, separated by commas/semicolons/whitespace, so a
 * two-person business can seed both owners from the environment. Any of these
 * gets console access on sign-in; additional admins are added at runtime from
 * the console (see `src/server/team-actions.ts`), which sets `role: OWNER` on
 * their row directly.
 */
export function ownerEmails(): string[] {
  return (process.env.OWNER_EMAIL ?? '')
    .split(/[,;\s]+/)
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Whether an address is one of the environment-configured store owners. */
function isOwnerEmail(email: string): boolean {
  return ownerEmails().includes(email.trim().toLowerCase());
}

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'OWNER';
};

/**
 * The signed-in visitor as a local row, creating it on first sign-in.
 *
 * A seeded row (or a row from the previous auth provider) with the same email is
 * adopted rather than duplicated, so history lines up with the real account
 * instead of leaving an orphan.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!auth) return null; // env not configured — read as signed out
  const session = await auth.getSession().catch(() => null);
  const account = session?.data?.user;
  if (!account?.id || !account.email) return null;

  const email = account.email.toLowerCase();
  const displayName = account.name || email.split('@')[0];

  const user = await withDbRetry('resolve current user', async () => {
    const byAuthId = await prisma.user.findUnique({ where: { appwriteId: account.id } });
    if (byAuthId) return byAuthId;

    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      return prisma.user.update({
        where: { id: byEmail.id },
        data: {
          appwriteId: account.id,
          name: byEmail.name || displayName,
          // Promote, never demote: a role set by hand in the database is not
          // undone just because OWNER_EMAIL changed.
          ...(isOwnerEmail(email) ? { role: 'OWNER' as const } : {}),
        },
      });
    }

    return prisma.user.create({
      data: {
        appwriteId: account.id,
        email,
        name: displayName,
        role: isOwnerEmail(email) ? 'OWNER' : 'CUSTOMER',
      },
    });
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
});

/** True when the current visitor may open the owner console. */
export async function isOwner(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'OWNER';
}
