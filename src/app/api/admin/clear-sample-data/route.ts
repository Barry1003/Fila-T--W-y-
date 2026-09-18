import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from '@/server/db';
import { getCurrentUser } from '@/server/auth';
import { CATALOGUE_TAG } from '@/server/catalogue';

/**
 * One-time cleanup: remove the seeded sample activity — orders, custom requests,
 * reviews and conversations — so the console (dashboard + all tabs) reflects
 * real, current data instead of demo content. Products are NOT touched.
 *
 * Owner-gated and requires ?confirm=yes so it can't fire by accident. Related
 * child rows (order items, measurements, reference images, review photos,
 * messages) cascade. Delete this route after running it.
 */

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return NextResponse.json({ ok: false, message: 'Owner only.' }, { status: 403 });
  }

  const counts = await withDbRetry('count sample data', async () => ({
    orders: await prisma.order.count(),
    customRequests: await prisma.customRequest.count(),
    reviews: await prisma.review.count(),
    conversations: await prisma.conversation.count(),
  }));

  if (new URL(req.url).searchParams.get('confirm') !== 'yes') {
    return NextResponse.json({
      ok: false,
      message: 'This permanently deletes the seeded sample orders, custom requests, reviews and conversations (products are kept). Re-open with ?confirm=yes to proceed.',
      counts,
    });
  }

  try {
    const deleted = await withDbRetry('clear sample data', async () => ({
      orders: (await prisma.order.deleteMany({})).count,
      customRequests: (await prisma.customRequest.deleteMany({})).count,
      reviews: (await prisma.review.deleteMany({})).count,
      conversations: (await prisma.conversation.deleteMany({})).count,
    }));

    revalidateTag(CATALOGUE_TAG);
    ['/console', '/console/orders', '/console/reviews', '/console/custom-orders', '/console/messages', '/account', '/account/orders']
      .forEach(p => revalidatePath(p));

    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    console.error('[clear-sample-data] failed', error);
    return NextResponse.json({ ok: false, message: 'Could not clear sample data. Please try again.' }, { status: 500 });
  }
}
