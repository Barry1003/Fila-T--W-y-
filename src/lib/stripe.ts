import 'server-only';
import Stripe from 'stripe';

/**
 * Server-side Stripe client, or null when STRIPE_SECRET_KEY is not set.
 *
 * Null-safe like the rest of the integrations: without a key the app still
 * builds and runs, and checkout falls back to the "a payment link will follow"
 * flow. Set the key (test mode: sk_test_…) to turn real payments on.
 *
 * The secret key must never reach the browser — it has no NEXT_PUBLIC_ prefix
 * and is only imported here, in server-only modules.
 */
const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

/** Whether Stripe payments are configured. */
export const stripeEnabled = !!key;
