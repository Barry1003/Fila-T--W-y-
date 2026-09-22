import { redirect } from 'next/navigation';
import Checkout from '@/views/Checkout';
import { getCurrentUser } from '@/server/auth';

/**
 * Checkout requires an account, so every order has an owner who can track it and
 * reorder. A signed-out visitor is sent to sign in and returned straight here.
 */
// Reads the session (cookies) to gate access, so it is never prerendered.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/checkout');
  return <Checkout />;
}
