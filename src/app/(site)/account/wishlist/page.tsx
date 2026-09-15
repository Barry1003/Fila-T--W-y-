import { redirect } from 'next/navigation';
import Wishlist from '@/views/Wishlist';
import { getCurrentUser } from '@/server/auth';
import { listMyWishlist } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/wishlist');

  const items = await listMyWishlist(user.id);
  return <Wishlist initialItems={items} />;
}
