import Home from '@/views/Home';
import { getPageContent } from '@/server/content';

// Content-driven pages fetch on the server and hand the result to their view,
// so this route file is not the usual one-line re-export.
export default async function Page() {
  const content = await getPageContent('home');
  return <Home content={content} />;
}
