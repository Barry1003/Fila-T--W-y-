'use server';

import 'server-only';
import { revalidateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { CATALOGUE_TAG } from './catalogue';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { formatCad, orderTotals, type Discount } from './pricing';
import { placeOrderSchema } from './order-schema';

/**
 * Placing an order.
 *
 * This is the only place in the storefront that takes money, so it trusts the
 * browser for nothing but identity of choice: which product, which size, how
 * many. Prices, discounts and stock are all read from the database here.
 *
 * Payment is not wired yet — a provider has not been chosen — so orders land as
 * PENDING for the owner to reconcile. Everything else about them is real.
 */

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/** Storefront orders have always read "#FTW-2891"; keep new ones in the series. */
const NUMBER_PREFIX = '#FTW-';
const FIRST_NUMBER = 1000;

/**
 * Money is cents everywhere in the pricing module, and Decimal(10,2) in the
 * database. Convert at the boundary, once.
 */
function centsToDecimal(cents: number): Prisma.Decimal {
  return new Prisma.Decimal(cents).dividedBy(100);
}

function decimalToCents(value: Prisma.Decimal | number | string): number {
  return Math.round(Number(value) * 100);
}

/**
 * The next order number.
 *
 * Sorting by the numeric part rather than the string, because "#FTW-999" sorts
 * after "#FTW-1000" alphabetically and would hand out a number already taken.
 */
async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const rows = await tx.$queryRaw<{ highest: number | null }[]>`
    select max(nullif(regexp_replace(number, '\\D', '', 'g'), '')::bigint) as highest
    from "Order"
  `;

  const highest = rows[0]?.highest ?? null;
  const next = highest === null ? FIRST_NUMBER : Number(highest) + 1;
  return `${NUMBER_PREFIX}${next}`;
}

/**
 * A promo code, if it is real and still usable.
 *
 * An unknown or expired code is not an error that stops the sale — it comes
 * back as `null` and the order is priced without it, which is what the cart
 * already told the shopper would happen.
 */
function usableDiscount(
  code: { type: 'PERCENTAGE' | 'FIXED_AMOUNT'; value: Prisma.Decimal; usageLimit: number | null; usedCount: number; active: boolean; expiresAt: Date | null } | null,
): Discount | null {
  if (!code || !code.active) return null;
  if (code.expiresAt && code.expiresAt.getTime() < Date.now()) return null;
  if (code.usageLimit !== null && code.usedCount >= code.usageLimit) return null;

  return code.type === 'PERCENTAGE'
    ? { kind: 'percentage', value: Number(code.value) }
    : { kind: 'fixed', value: decimalToCents(code.value) };
}

export type PromoCheck =
  | { ok: true; code: string; discount: Discount; description: string }
  | { ok: false; message: string };

/**
 * Checks a promo code for the cart.
 *
 * The cart used to accept the string "FILA10" — a code that exists nowhere in
 * the database — and quietly took 10% off. This asks the real table. What comes
 * back is only for display: `placeOrder` looks the code up again before pricing
 * anything, so an answer forged here buys nothing.
 */
export async function checkPromoCode(rawCode: unknown): Promise<PromoCheck> {
  const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';
  if (!code) return { ok: false, message: 'Enter a promo code.' };

  try {
    const row = await withDbRetry('check promo code', () =>
      prisma.discountCode.findUnique({ where: { code } }),
    );

    const discount = usableDiscount(row);
    if (!discount) {
      // Deliberately one message for unknown, inactive, expired and used-up.
      // Distinguishing them would let anyone map out the live codes.
      return { ok: false, message: "That code isn't valid." };
    }

    return {
      ok: true,
      code,
      discount,
      description: discount.kind === 'percentage'
        ? `${discount.value}% off`
        : `${formatCad(discount.value)} off`,
    };
  } catch (error) {
    console.error('[check promo code] failed', error);
    return { ok: false, message: 'We could not check that code just now.' };
  }
}

export async function placeOrder(raw: unknown): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some details need another look.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  // Signed in or not — guests can buy. The order keeps its own copy of the
  // contact details either way, so it stays a faithful record.
  const user = await getCurrentUser().catch(() => null);

  try {
    const orderNumber = await withDbRetry('place order', async () => {
      // Look up what these actually cost. Deliberately outside the transaction:
      // it is a read, and keeping the transaction short matters more.
      const products = await prisma.product.findMany({
        where: { id: { in: input.lines.map(line => line.productId) } },
        select: {
          id: true,
          title: true,
          status: true,
          priceCad: true,
          variants: { select: { id: true, size: true, stock: true } },
        },
      });

      const byId = new Map(products.map(product => [product.id, product]));

      // Resolve every line before writing anything, so a cart with one bad item
      // fails cleanly instead of half-placing an order.
      const resolved = input.lines.map(line => {
        const product = byId.get(line.productId);
        if (!product || product.status !== 'PUBLISHED') {
          throw new OrderProblem('One of the pieces in your cart is no longer available. Please remove it and try again.');
        }

        const variant = product.variants.find(v => v.size === line.size);
        if (!variant) {
          throw new OrderProblem(`${product.title} is no longer made in size ${line.size}.`);
        }
        if (variant.stock < line.quantity) {
          throw new OrderProblem(
            variant.stock === 0
              ? `${product.title} (${line.size}) has just sold out.`
              : `Only ${variant.stock} left of ${product.title} in size ${line.size}.`,
          );
        }

        return {
          productId: product.id,
          variantId: variant.id,
          name: product.title,
          variant: line.size,
          quantity: line.quantity,
          unitPriceCents: decimalToCents(product.priceCad),
        };
      });

      const promoCode = input.promoCode?.trim().toUpperCase();
      const discountRow = promoCode
        ? await prisma.discountCode.findUnique({ where: { code: promoCode } })
        : null;

      const discount = usableDiscount(discountRow);
      const totals = orderTotals(
        resolved.map(line => ({ unitPriceCents: line.unitPriceCents, quantity: line.quantity })),
        discount,
        input.shippingZone,
        input.shippingSpeed,
      );

      // Two orders placed in the same instant can pick the same number. The
      // unique constraint rejects the loser, and because the whole thing is one
      // transaction its stock decrements roll back with it — so simply trying
      // again is safe, and cheaper than serialising every checkout.
      return runWithNumberRetry(async tx => {
        // Decrement with the quantity as a guard rather than reading then
        // writing. Two shoppers taking the last cap at the same moment both
        // pass the check above; only one can pass this.
        for (const line of resolved) {
          const claimed = await tx.productVariant.updateMany({
            where: { id: line.variantId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          });

          if (claimed.count === 0) {
            throw new OrderProblem(`${line.name} (${line.variant}) sold out while you were checking out.`);
          }
        }

        if (discountRow && discount) {
          await tx.discountCode.update({
            where: { id: discountRow.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        const order = await tx.order.create({
          data: {
            number: await nextOrderNumber(tx),
            userId: user?.id ?? null,

            customerName: input.fullName,
            customerEmail: input.email,
            customerPhone: input.phone || null,

            shippingLine1: input.line1,
            shippingLine2: input.line2 || null,
            shippingCity: input.city,
            shippingState: input.state || null,
            shippingPostal: input.postal,
            shippingCountry: input.country,

            // No payment provider yet, so nothing has been charged. The owner
            // reconciles by hand until one is wired.
            paymentStatus: 'PENDING',

            subtotal: centsToDecimal(totals.subtotalCents),
            shipping: centsToDecimal(totals.shippingCents),
            discount: centsToDecimal(totals.discountCents),
            total: centsToDecimal(totals.totalCents),

            discountCodeId: discount ? discountRow!.id : null,

            items: {
              create: resolved.map(line => ({
                productId: line.productId,
                name: line.name,
                variant: line.variant,
                quantity: line.quantity,
                unitPrice: centsToDecimal(line.unitPriceCents),
              })),
            },
          },
          select: { number: true },
        });

        return order.number;
      });
    });

    // Stock moved, so anything showing availability is now stale.
    revalidateTag(CATALOGUE_TAG);

    return { ok: true, orderNumber };
  } catch (error) {
    if (error instanceof OrderProblem) {
      return { ok: false, message: error.message };
    }

    console.error('[place order] failed', error);
    return {
      ok: false,
      message: 'We could not place your order just now. Nothing has been charged — please try again in a moment.',
    };
  }
}

/**
 * Something the shopper can act on — sold out, unavailable — as opposed to a
 * fault on our side. Carries a message written for them, not for a log.
 */
class OrderProblem extends Error {}

/** Prisma's code for a unique constraint violation. */
const UNIQUE_VIOLATION = 'P2002';

async function runWithNumberRetry(
  work: (tx: Prisma.TransactionClient) => Promise<string>,
  attempts = 3,
): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction(work);
    } catch (error) {
      const collided =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_VIOLATION &&
        (error.meta?.target as string[] | undefined)?.includes('number');

      if (!collided || attempt >= attempts) throw error;
      console.warn(`[place order] order number collided, retrying (${attempt}/${attempts})`);
    }
  }
}
