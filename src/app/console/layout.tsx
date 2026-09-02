import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import ConsoleShell from '@/components/ConsoleShell';
import { getCurrentUser } from '@/server/auth';

/**
 * The console is owner-only.
 *
 * Checked on the server for every console route, so it cannot be bypassed by
 * hiding the link — a signed-out visitor goes to sign in, and a signed-in
 * customer is sent back to the storefront rather than shown a locked door.
 */
export default async function ConsoleLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect('/auth?next=/console');
  if (user.role !== 'OWNER') redirect('/');

  return <ConsoleShell>{children}</ConsoleShell>;
}
