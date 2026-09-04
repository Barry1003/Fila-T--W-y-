import { redirect } from 'next/navigation';
import OrderConfirmation from '@/views/OrderConfirmation';
import { getOrderByNumber } from '@/server/orders';

// The order is looked up per request — a confirmation must never be served
// from a cache, or one shopper would be shown another's order.
export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: number } = await searchParams;

  // Landing here without an order number means a stale bookmark or a shared
  // link, not a completed checkout. Send them somewhere useful rather than
  // showing a confirmation for nothing.
  if (!number) redirect('/shop');

  const order = await getOrderByNumber(number);
  if (!order) redirect('/shop');

  return <OrderConfirmation order={order} />;
}
