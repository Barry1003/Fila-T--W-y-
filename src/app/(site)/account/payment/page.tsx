import { redirect } from 'next/navigation';
import AddressesPayment from '@/views/AddressesPayment';
import { getCurrentUser } from '@/server/auth';
import { listMyAddresses, listMyPaymentMethods } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/payment');

  const addresses = await listMyAddresses(user.id);
  const payments = await listMyPaymentMethods(user.id);
  return <AddressesPayment initialAddresses={addresses} initialPayments={payments} />;
}
