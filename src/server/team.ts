import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser, ownerEmails } from './auth';

/**
 * Console team = every `User` with the OWNER role. Two ways in:
 *  - configured in OWNER_EMAIL (bootstrap owners), or
 *  - added from the Team page, which sets `role: OWNER` on their row.
 *
 * A member is "active" once they have signed in at least once (they have an auth
 * id); until then they are "invited" — the row exists and grants access the
 * moment they sign in with that email.
 */

export type TeamMember = {
  id: string;
  email: string;
  name: string;
  /** Configured in OWNER_EMAIL — cannot be removed from the console. */
  isEnvOwner: boolean;
  /** Has signed in at least once. */
  active: boolean;
  /** The currently signed-in owner. */
  you: boolean;
};

export async function listTeamMembers(): Promise<TeamMember[]> {
  const me = await getCurrentUser().catch(() => null);
  const envSet = new Set(ownerEmails());

  const rows = await withDbRetry('team: list owners', () =>
    prisma.user.findMany({
      where: { role: 'OWNER' },
      orderBy: { createdAt: 'asc' },
      select: { id: true, email: true, name: true, appwriteId: true },
    })
  );

  return rows.map(r => ({
    id: r.id,
    email: r.email,
    name: r.name,
    isEnvOwner: envSet.has(r.email.toLowerCase()),
    active: !!r.appwriteId,
    you: !!me && r.id === me.id,
  }));
}
