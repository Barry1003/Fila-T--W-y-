import { notFound } from 'next/navigation';
import ConsoleOrderDetail from '@/views/console/ConsoleOrderDetail';
import { getOrder } from '@/server/orders';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  // A stale bookmark or a deleted order lands on the 404 page rather than
  // silently showing someone else's order, which the fixture version did.
  if (!order) notFound();

  return <ConsoleOrderDetail order={order} />;
}
