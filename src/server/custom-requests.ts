'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { customRequestSchema } from './custom-request-schema';

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * A human-readable reference like CR-2026-014.
 *
 * Counts this year's requests rather than using the row id, because the owner
 * and the customer quote this number to each other and a cuid is unusable in a
 * phone call. Two requests submitted in the same instant could collide, which
 * the unique constraint would reject — acceptable for the volume here, and
 * worth revisiting if it ever gets busy.
 */
async function nextReference(): Promise<string> {
  const year = new Date().getFullYear();
  const startOfYear = new Date(`${year}-01-01T00:00:00Z`);

  const count = await prisma.customRequest.count({ where: { submittedAt: { gte: startOfYear } } });
  return `CR-${year}-${String(count + 1).padStart(3, '0')}`;
}

export async function submitCustomRequest(raw: unknown): Promise<SubmitResult> {
  const parsed = customRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some details need another look.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  // Attach to the account when there is one, so it shows up under My Custom
  // Orders — but never require it, since most enquiries come before signing up.
  const user = await getCurrentUser().catch(() => null);

  try {
    const created = await withDbRetry('submit custom request', async () => {
      const reference = await nextReference();

      return prisma.customRequest.create({
        data: {
          reference,
          userId: user?.id ?? null,
          customerName: input.name,
          customerEmail: input.email,
          customerPhone: input.phone || null,
          customerLocation: input.location || null,
          garmentType: input.garmentType,
          occasion: input.occasion || null,
          neededBy: input.neededBy ? new Date(input.neededBy) : null,
          fabricPreference: input.fabricPreference || null,
          colorPreference: input.colorPreference || null,
          notes: input.notes || null,
          measurements: {
            create: input.measurements
              .filter(m => m.value.trim() !== '')
              .map((m, i) => ({ label: m.label, value: m.value, position: i })),
          },
        },
        select: { reference: true },
      });
    });

    revalidatePath('/console/custom-orders');
    revalidatePath('/account/custom-orders');

    return { ok: true, reference: created.reference };
  } catch (error) {
    console.error('[custom-request] could not save:', error);
    return { ok: false, message: 'We could not save your request just now. Please try again in a moment.' };
  }
}

/* ─── Owner-side workflow ─────────────────────────────────────── */

export type RequestStatusResult = { ok: true } | { ok: false; message: string };

const REQUEST_STATUS_TO_DB: Record<
  'new' | 'quoted' | 'approved' | 'in-production' | 'completed' | 'declined',
  'NEW' | 'QUOTED' | 'APPROVED' | 'IN_PRODUCTION' | 'COMPLETED' | 'DECLINED'
> = {
  new: 'NEW',
  quoted: 'QUOTED',
  approved: 'APPROVED',
  'in-production': 'IN_PRODUCTION',
  completed: 'COMPLETED',
  declined: 'DECLINED',
};

/**
 * Moves a custom request through its workflow. Owner-gated. Addressed by the
 * human reference (e.g. CR-2026-014), which is what the console holds.
 */
export async function setCustomRequestStatus(
  reference: string,
  status: 'new' | 'quoted' | 'approved' | 'in-production' | 'completed' | 'declined',
  extras?: { quotedPrice?: number | null; estimatedCompletion?: string | null; declineReason?: string | null; note?: string | null }
): Promise<RequestStatusResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'You do not have permission to do that.' };

  const data: Record<string, unknown> = { status: REQUEST_STATUS_TO_DB[status] };
  if (extras) {
    if (extras.quotedPrice !== undefined) data.quotedPrice = extras.quotedPrice;
    if (extras.estimatedCompletion !== undefined)
      data.estimatedCompletion = extras.estimatedCompletion ? new Date(extras.estimatedCompletion) : null;
    if (extras.declineReason !== undefined) data.declineReason = extras.declineReason;
    if (extras.note !== undefined && extras.note !== null) data.notes = extras.note;
  }

  try {
    await withDbRetry('set custom request status', () =>
      prisma.customRequest.update({ where: { reference }, data })
    );
    revalidatePath('/console/custom-orders');
    return { ok: true };
  } catch (error) {
    console.error('[custom-request status] failed', error);
    return { ok: false, message: 'Could not update the request just now. Please try again.' };
  }
}
