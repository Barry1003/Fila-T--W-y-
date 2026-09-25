'use server';

import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { siteUrl } from '@/lib/site';

/**
 * Starts a hosted Stripe Checkout for an already-placed (PENDING) order.
 *
 * The order — and every price on it — is created server-side by `placeOrder`
 * first, so the amount charged is built from the database, never from anything
 * the browser sent. On success Stripe redirects to the confirmation page; the
 * webhook (`/api/stripe/webhook`) is what actually marks the order paid.
 */
export type CheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; reason: 'unconfigured' | 'error'; message?: string };

export async function createStripeCheckoutSession(orderNumber: string): Promise<CheckoutSessionResult> {
  if (!stripe) return { ok: false, reason: 'unconfigured' };

  try {
    const order = await withDbRetry('load order for stripe', () =>
      prisma.order.findUnique({ where: { number: orderNumber }, include: { items: true } })
    );
    if (!order) return { ok: false, reason: 'error', message: 'Order not found.' };
    if (order.paymentStatus === 'PAID') return { ok: false, reason: 'error', message: 'This order is already paid.' };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(i => ({
      quantity: i.quantity,
      price_data: {
        currency: 'cad',
        product_data: { name: i.variant ? `${i.name} — ${i.variant}` : i.name },
        unit_amount: Math.round(Number(i.unitPrice) * 100),
      },
    }));

    const shipping = Number(order.shipping);
    if (shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: 'cad', product_data: { name: 'Shipping' }, unit_amount: Math.round(shipping * 100) },
      });
    }

    // Stripe has no negative line items, so a discount is applied as a one-off
    // coupon — this keeps the itemised total matching order.total exactly.
    const discount = Number(order.discount);
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: 'cad',
        duration: 'once',
        name: 'Discount',
      });
      discounts = [{ coupon: coupon.id }];
    }

    const base = siteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      discounts,
      customer_email: order.customerEmail,
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.number },
      payment_intent_data: { metadata: { orderId: order.id, orderNumber: order.number } },
      success_url: `${base}/order-confirmation?order=${encodeURIComponent(order.number)}`,
      cancel_url: `${base}/checkout?canceled=1`,
    });

    if (!session.url) return { ok: false, reason: 'error', message: 'Could not start payment.' };
    return { ok: true, url: session.url };
  } catch (error) {
    console.error('[stripe checkout] failed', error);
    return { ok: false, reason: 'error', message: 'Could not start payment. Please try again.' };
  }
}
