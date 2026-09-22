import type { ReactNode } from 'react';
import Root from '@/components/Root';
import { getCurrentUser } from '@/server/auth';

// The shell reads the session (cookies) for every storefront page, so the whole
// group is server-rendered per request rather than statically prerendered.
export const dynamic = 'force-dynamic';

// Resolves the session once per request and hands it to the shell, so the nav
// knows whether to offer "Sign in" or the account menu.
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <Root user={user}>{children}</Root>;
}
