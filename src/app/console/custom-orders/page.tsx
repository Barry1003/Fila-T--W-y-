import ConsoleCustomOrders from '@/views/console/ConsoleCustomOrders';
import { listConsoleCustomRequests } from '@/server/console';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const requests = await listConsoleCustomRequests();
  return <ConsoleCustomOrders requests={requests} />;
}
