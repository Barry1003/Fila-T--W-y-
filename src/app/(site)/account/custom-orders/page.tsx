import { redirect } from 'next/navigation';
import CustomOrders from '@/views/CustomOrders';
import { getCurrentUser } from '@/server/auth';
import { listMyCustomRequests } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/custom-orders');

  const requests = await listMyCustomRequests(user.id);
  return <CustomOrders initialRequests={requests} />;
}
