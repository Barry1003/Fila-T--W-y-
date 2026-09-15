import { redirect } from 'next/navigation';
import Reviews from '@/views/Reviews';
import { getCurrentUser } from '@/server/auth';
import { listMyReviews, listMyPendingReviews } from '@/server/account';

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?next=/account/reviews');

  const reviews = await listMyReviews(user.id);
  const pending = await listMyPendingReviews(user.id);
  return <Reviews reviews={reviews} pending={pending} />;
}
