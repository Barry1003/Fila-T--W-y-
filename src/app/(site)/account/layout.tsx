import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';

/**
 * Everything under /account is personal, so the whole section requires a
 * signed-in visitor. Gating here rather than per page means a signed-out visitor
 * to any account page — orders, addresses, settings — is sent to sign in and
 * returned to their account. getCurrentUser is request-cached, so this does not
 * add a database round trip on top of the page's own lookup.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account');
  return <>{children}</>;
}
