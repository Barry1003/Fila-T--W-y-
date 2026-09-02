import { redirect } from 'next/navigation';
import Account from '@/views/Account';
import { getCurrentUser } from '@/server/auth';

// Resolves the Appwrite session to a local row, creating it on first sign-in.
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth');
  return <Account user={user} />;
}
