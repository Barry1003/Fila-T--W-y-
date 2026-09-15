import { redirect } from 'next/navigation';
import Support from '@/views/Support';
import { getCurrentUser } from '@/server/auth';
import { listMyOrders } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/support');

  // The support inbox itself has no persistence yet, so it opens empty; the
  // "new message" order picker is seeded from the account's real orders.
  const orders = await listMyOrders(user.id);
  const orderNumbers = orders.map(o => `#${o.id}`);
  return <Support orderNumbers={orderNumbers} />;
}
