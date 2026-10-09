import { redirect } from 'next/navigation';
import AddressesPayment from '@/views/AddressesPayment';
import { getCurrentUser } from '@/server/auth';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/payment');

  return <AddressesPayment />;
}
