import type { ReactNode } from 'react';
import Root from '@/components/Root';
import { getCurrentUser } from '@/server/auth';

// Resolves the session once per request and hands it to the shell, so the nav
// knows whether to offer "Sign in" or the account menu.
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <Root user={user}>{children}</Root>;
}
