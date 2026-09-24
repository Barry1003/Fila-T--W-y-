'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import type { FulfilStatus } from './orders';

/** Owner actions on an order. Owner-gated. */

export type OrderActionResult = { ok: true } | { ok: false; message: string };

async function requireOwner() {
  const user = await getCurrentUser().catch(() => null);
  return user?.role === 'OWNER';
}

const STATUS_TO_DB: Record<FulfilStatus, 'NEW' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'> = {
  new: 'NEW',
  processing: 'PROCESSING',
  shipped: 'SHIPPED',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
};

/** Moves an order to a new fulfilment status. */
export async function updateOrderStatus(id: string, status: FulfilStatus): Promise<OrderActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to edit this order.' };

  try {
    await withDbRetry('update order status', () =>
      prisma.order.update({ where: { id }, data: { status: STATUS_TO_DB[status] } })
    );
    revalidatePath(`/console/orders/${id}`);
    revalidatePath('/console/orders');
    return { ok: true };
  } catch (error) {
    console.error('[order status] failed', error);
    return { ok: false, message: 'Could not update the status just now. Please try again.' };
  }
}

/** Saves the carrier and tracking number on an order. */
export async function saveOrderTracking(
  id: string,
  carrier: string,
  tracking: string
): Promise<OrderActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to edit this order.' };

  try {
    await withDbRetry('save order tracking', () =>
      prisma.order.update({
        where: { id },
        data: { carrier: carrier.trim() || null, trackingNumber: tracking.trim() || null },
      })
    );
    revalidatePath(`/console/orders/${id}`);
    return { ok: true };
  } catch (error) {
    console.error('[order tracking] failed', error);
    return { ok: false, message: 'Could not save tracking just now. Please try again.' };
  }
}

/** Saves (or clears) the private internal note on an order. */
export async function saveOrderNote(id: string, note: string): Promise<OrderActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to edit this order.' };

  try {
    await withDbRetry('save order note', () =>
      prisma.order.update({
        where: { id },
        data: { internalNote: note.trim() || null },
      })
    );
    revalidatePath(`/console/orders/${id}`);
    return { ok: true };
  } catch (error) {
    console.error('[order note] failed', error);
    return { ok: false, message: 'Could not save the note just now. Please try again.' };
  }
}
