import { redirect } from 'next/navigation';
import Support from '@/views/Support';
import { getCurrentUser } from '@/server/auth';
import { listMyOrders } from '@/server/account';
import { listMyConversations } from '@/server/support';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/support');

  // Sequential, not Promise.all: Neon opens a socket per query and firing
  // several at a sleeping compute can fail a cold start.
  const orders = await listMyOrders(user.id);
  const conversations = await listMyConversations(user.id);
  const orderNumbers = orders.map(o => `#${o.id}`);
  return <Support orderNumbers={orderNumbers} initialConversations={conversations} />;
}
