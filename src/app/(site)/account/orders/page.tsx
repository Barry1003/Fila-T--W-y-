import { redirect } from 'next/navigation';
import Orders from '@/views/Orders';
import { getCurrentUser } from '@/server/auth';
import { listMyOrders } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/orders');

  const orders = await listMyOrders(user.id);
  return <Orders orders={orders} />;
}
