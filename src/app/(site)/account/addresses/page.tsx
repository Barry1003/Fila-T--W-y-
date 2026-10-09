import { redirect } from 'next/navigation';
import AddressesPayment from '@/views/AddressesPayment';
import { getCurrentUser } from '@/server/auth';
import { listMyAddresses } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/addresses');

  const addresses = await listMyAddresses(user.id);
  return <AddressesPayment initialAddresses={addresses} />;
}
