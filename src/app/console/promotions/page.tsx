import ConsolePromotions from '@/views/console/ConsolePromotions';
import { listDiscountCodes, listBanners } from '@/server/console';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const codes = await listDiscountCodes();
  const banners = await listBanners();

  return <ConsolePromotions initialCodes={codes} initialBanners={banners} />;
}
