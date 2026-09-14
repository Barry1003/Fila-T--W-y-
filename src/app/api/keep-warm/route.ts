import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Keeps the Neon compute awake.
 *
 * Neon suspends an idle database after a few minutes; the next visitor then
 * pays a cold start of up to ~20s (see the catalogue notes). A scheduled ping
 * to this route runs a trivial query so the compute stays warm and shoppers
 * never hit that wait. Deliberately uncached — a cached response would never
 * touch the database, which is the whole point.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (error) {
    console.error('[keep-warm] ping failed', error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
