import ConsoleAnalytics from '@/views/console/ConsoleAnalytics';
import { getAnalytics } from '@/server/analytics';

// Analytics reflect live orders; never serve a snapshot.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getAnalytics();
  return <ConsoleAnalytics data={data} />;
}
