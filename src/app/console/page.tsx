import ConsoleDashboard from '@/views/console/ConsoleDashboard';
import { getDashboardData } from '@/server/dashboard';

// Always live: the owner must see real, current figures.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getDashboardData();
  return <ConsoleDashboard data={data} />;
}
