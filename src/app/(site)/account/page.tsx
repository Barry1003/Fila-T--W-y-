import { redirect } from 'next/navigation';
import Account from '@/views/Account';
import { getCurrentUser } from '@/server/auth';
import { listMyOrders, listMyWishlist, buildOverview } from '@/server/account';

// Resolves the Appwrite session to a local row, creating it on first sign-in,
// then loads that account's own orders and wishlist for the overview.
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account');

  const orders = await listMyOrders(user.id);
  const wishlist = await listMyWishlist(user.id);
  const overview = buildOverview(orders, wishlist);

  return <Account user={user} overview={overview} />;
}
