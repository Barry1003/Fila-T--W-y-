import ConsoleSettings from '@/views/console/ConsoleSettings';
import { getPageContent } from '@/server/content';
import { getStripePayoutSummary } from '@/server/stripe-payouts';

// The editor must always open on what is currently live, so this route is never
// prerendered — a build-time snapshot would show the owner stale copy.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const [homeContent, aboutContent] = await Promise.all([
    getPageContent('home'),
    getPageContent('about'),
  ]);
  const payouts = await getStripePayoutSummary();
  return <ConsoleSettings homeContent={homeContent} aboutContent={aboutContent} payouts={payouts} />;
}
