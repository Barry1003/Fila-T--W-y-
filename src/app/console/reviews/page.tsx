import ConsoleReviews from '@/views/console/ConsoleReviews';
import { listConsoleReviews } from '@/server/console';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { reviews, stats } = await listConsoleReviews();
  return <ConsoleReviews reviews={reviews} stats={stats} />;
}
