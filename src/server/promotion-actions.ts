'use server';

import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createDiscountCode(data: {
  code: string;
  type: 'Percentage' | 'Fixed Amount';
  value: number;
  usageLimit: number | null;
  expiresAt: string | null;
}) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'Unauthorized' };

  if (!data.code.trim()) {
    return { ok: false, message: 'Code cannot be empty' };
  }

  const existing = await withDbRetry('check existing code', () =>
    prisma.discountCode.findUnique({ where: { code: data.code.trim() } })
  );
  if (existing) {
    return { ok: false, message: 'A discount code with this name already exists' };
  }

  await withDbRetry('create discount code', () =>
    prisma.discountCode.create({
      data: {
        code: data.code.trim(),
        type: data.type === 'Percentage' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        value: data.value,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })
  );

  revalidatePath('/console/promotions');
  return { ok: true };
}

export async function toggleDiscountCode(id: string, active: boolean) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'Unauthorized' };

  await withDbRetry('toggle discount code', () =>
    prisma.discountCode.update({
      where: { id },
      data: { active },
    })
  );

  revalidatePath('/console/promotions');
  return { ok: true };
}

export async function deleteDiscountCode(id: string) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'Unauthorized' };

  await withDbRetry('delete discount code', () =>
    prisma.discountCode.delete({
      where: { id },
    })
  );

  revalidatePath('/console/promotions');
  return { ok: true };
}

export async function createBanner(data: {
  text: string;
  ctaLabel?: string;
  startsAt: string;
  endsAt: string;
  status: 'LIVE' | 'SCHEDULED' | 'EXPIRED';
}) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'Unauthorized' };

  await withDbRetry('create banner', () =>
    prisma.banner.create({
      data: {
        text: data.text,
        ctaLabel: data.ctaLabel || null,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        status: data.status,
      },
    })
  );

  revalidatePath('/console/promotions');
  return { ok: true };
}

export async function deleteBanner(id: string) {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') return { ok: false, message: 'Unauthorized' };

  await withDbRetry('delete banner', () =>
    prisma.banner.delete({
      where: { id },
    })
  );

  revalidatePath('/console/promotions');
  return { ok: true };
}
