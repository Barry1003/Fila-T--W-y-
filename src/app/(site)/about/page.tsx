import About from '@/views/About';
import { getPageContent } from '@/server/content';

export default async function Page() {
  const content = await getPageContent('about');
  return <About content={content} />;
}
