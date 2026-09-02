import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getAppwriteAccount } from './appwrite-server';

/**
 * Bridges Appwrite identity to the shop's own records.
 *
 * Appwrite knows who someone is; this database knows their orders, wishlist and
 * addresses. `appwriteId` is the join, deliberately not email — people change
 * their email address, and matching on it would hand one person's order history
 * to another.
 */

/**
 * Whether an address owns the store.
 *
 * Set OWNER_EMAIL in .env and that account gets console access on sign-in.
 * Without it there would be no way to reach the console at all: the seeded
 * owner row has no Appwrite account behind it.
 */
function isOwnerEmail(email: string): boolean {
  const owner = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return !!owner && owner === email.trim().toLowerCase();
}

export type CurrentUser = {
  id: string;
  appwriteId: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'OWNER';
};

/**
 * The signed-in visitor as a local row, creating it on first sign-in.
 *
 * A seeded row with the same email is adopted rather than duplicated, so the
 * sample data lines up with a real account instead of leaving an orphan.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const account = await getAppwriteAccount();
  if (!account) return null;

  const user = await withDbRetry('resolve current user', async () => {
    const byAppwriteId = await prisma.user.findUnique({ where: { appwriteId: account.$id } });
    if (byAppwriteId) return byAppwriteId;

    const byEmail = await prisma.user.findUnique({ where: { email: account.email } });
    if (byEmail) {
      return prisma.user.update({
        where: { id: byEmail.id },
        data: {
          appwriteId: account.$id,
          name: byEmail.name || account.name,
          // Promote, never demote: a role set by hand in the database is not
          // undone just because OWNER_EMAIL changed.
          ...(isOwnerEmail(account.email) ? { role: 'OWNER' as const } : {}),
        },
      });
    }

    return prisma.user.create({
      data: {
        appwriteId: account.$id,
        email: account.email,
        name: account.name || account.email.split('@')[0],
        role: isOwnerEmail(account.email) ? 'OWNER' : 'CUSTOMER',
      },
    });
  });

  return {
    id: user.id,
    appwriteId: account.$id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

/** True when the current visitor may open the owner console. */
export async function isOwner(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'OWNER';
}
