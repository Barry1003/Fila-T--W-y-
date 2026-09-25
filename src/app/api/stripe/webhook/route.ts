import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from '@/server/db';
import { revalidatePath } from 'next/cache';

/**
 * Stripe webhook. Stripe calls this after a payment; it is the authoritative
 * signal that an order is paid (never trust the browser's redirect for that).
 *
 * The signature is verified against STRIPE_WEBHOOK_SECRET, so only genuine
 * Stripe events are honoured. Marking an order paid is idempotent, so a retried
 * event is harmless.
 *
 * Runs on the Node runtime (default) and needs the raw request body, so the
 * body is read with `req.text()` before parsing.
 */

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('[stripe webhook] signature verification failed', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Only mark paid when Stripe confirms the money is in.
      if (session.payment_status === 'paid') {
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await withDbRetry('mark order paid', () =>
            prisma.order.update({
              where: { id: orderId },
              data: { paymentStatus: 'PAID', paymentMethod: 'Stripe' },
            })
          );
          revalidatePath(`/console/orders/${orderId}`);
          revalidatePath('/console/orders');
        }
      }
    }
  } catch (error) {
    // Log and 500 so Stripe retries — better than silently dropping a payment.
    console.error('[stripe webhook] handler failed', error);
    return NextResponse.json({ error: 'Handler error.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
