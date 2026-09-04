import ConsoleOrders from '@/views/console/ConsoleOrders';
import { listOrders } from '@/server/orders';

// Orders change constantly and the owner acts on them; never serve a snapshot.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const orders = await listOrders();
  return <ConsoleOrders orders={orders} />;
}
