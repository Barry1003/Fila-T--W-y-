'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/**
 * Saved-address writes, always scoped to the signed-in user.
 *
 * An `id` from the browser is only ever used inside a `where` that also pins
 * `userId`, so passing someone else's address id updates nothing. Setting a new
 * default clears the old one in the same transaction, so a shopper never ends
 * up with two defaults or none.
 */

const addressSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Name is required.'),
  line1: z.string().trim().min(1, 'Address is required.'),
  line2: z.string().trim().optional().default(''),
  city: z.string().trim().min(1, 'City is required.'),
  state: z.string().trim().optional().default(''),
  postal: z.string().trim().min(1, 'Postal / ZIP is required.'),
  country: z.string().trim().min(1, 'Country is required.'),
  phone: z.string().trim().optional().default(''),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.input<typeof addressSchema>;

export type AddressResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function saveAddress(raw: AddressInput): Promise<AddressResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to save an address.' };

  const parsed = addressSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some details need another look.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const d = parsed.data;

  try {
    await withDbRetry('save address', () =>
      prisma.$transaction(async tx => {
        // Making this one the default demotes the others first.
        if (d.isDefault) {
          await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
        }

        const data = {
          name: d.name,
          line1: d.line1,
          line2: d.line2 || null,
          city: d.city,
          state: d.state || null,
          postal: d.postal,
          country: d.country,
          phone: d.phone || null,
          isDefault: d.isDefault,
        };

        if (d.id) {
          // Scoped update: nothing happens if the id isn't this user's.
          await tx.address.updateMany({ where: { id: d.id, userId: user.id }, data });
        } else {
          // A shopper's very first address becomes their default automatically.
          const count = await tx.address.count({ where: { userId: user.id } });
          await tx.address.create({ data: { ...data, isDefault: d.isDefault || count === 0, userId: user.id } });
        }
      })
    );

    revalidatePath('/account/addresses');
    return { ok: true };
  } catch (error) {
    console.error('[address] save failed:', error);
    return { ok: false, message: 'Could not save your address just now. Please try again.' };
  }
}

export async function deleteAddress(id: string): Promise<AddressResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to manage addresses.' };

  try {
    await withDbRetry('delete address', () =>
      prisma.address.deleteMany({ where: { id, userId: user.id } })
    );
    revalidatePath('/account/addresses');
    return { ok: true };
  } catch (error) {
    console.error('[address] delete failed:', error);
    return { ok: false, message: 'Could not remove that address just now. Please try again.' };
  }
}

export async function setDefaultAddress(id: string): Promise<AddressResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to manage addresses.' };

  try {
    await withDbRetry('set default address', () =>
      prisma.$transaction(async tx => {
        await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
        await tx.address.updateMany({ where: { id, userId: user.id }, data: { isDefault: true } });
      })
    );
    revalidatePath('/account/addresses');
    return { ok: true };
  } catch (error) {
    console.error('[address] set default failed:', error);
    return { ok: false, message: 'Could not update your default address just now. Please try again.' };
  }
}
