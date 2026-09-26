import ConsoleTeam from '@/views/console/ConsoleTeam';
import { listTeamMembers } from '@/server/team';

// Team membership is security-sensitive; always read live.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const members = await listTeamMembers();
  return <ConsoleTeam members={members} />;
}
