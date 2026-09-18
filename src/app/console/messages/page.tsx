import ConsoleMessages from '@/views/console/ConsoleMessages';
import { listConsoleConversations } from '@/server/console';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const conversations = await listConsoleConversations();
  return <ConsoleMessages conversations={conversations} />;
}
