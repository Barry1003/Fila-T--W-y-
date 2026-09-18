import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from '@/server/db';
import { getCurrentUser } from '@/server/auth';
import { CATALOGUE_TAG } from '@/server/catalogue';

/**
 * One-time cleanup: remove the seeded sample orders so the console dashboard
 * and Orders page reflect real activity (none, pre-launch) instead of demo
 * data. Owner-gated and requires ?confirm=yes so it can't fire by accident.
 * Order items cascade; conversations linked to an order keep their row (the FK
 * is set null). Delete this route after running it.
 */

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return NextResponse.json({ ok: false, message: 'Owner only.' }, { status: 403 });
  }

  const url = new URL(req.url);
  const count = await withDbRetry('count orders', () => prisma.order.count());

  if (url.searchParams.get('confirm') !== 'yes') {
    return NextResponse.json({
      ok: false,
      message: `This will permanently delete ALL ${count} order(s) — the seeded samples. Re-open this URL with ?confirm=yes to proceed.`,
      orderCount: count,
    });
  }

  try {
    const result = await withDbRetry('clear orders', () => prisma.order.deleteMany({}));
    revalidateTag(CATALOGUE_TAG);
    ['/console', '/console/orders', '/account', '/account/orders'].forEach(p => revalidatePath(p));
    return NextResponse.json({ ok: true, deleted: result.count });
  } catch (error) {
    console.error('[clear-sample-orders] failed', error);
    return NextResponse.json({ ok: false, message: 'Could not clear orders. Please try again.' }, { status: 500 });
  }
}
