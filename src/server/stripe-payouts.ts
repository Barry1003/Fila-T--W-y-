import 'server-only';
import { stripe } from '@/lib/stripe';

/**
 * Read-only Stripe payout summary for the console. The bank account and payout
 * schedule are managed in the Stripe Dashboard (Stripe pays out automatically);
 * this just surfaces the balance and recent payouts so the owner can see money
 * moving without leaving the console.
 */

export type StripePayout = {
  id: string;
  amountCad: number;
  status: string;
  arrivalDate: string;
};

export type StripePayoutSummary = {
  configured: boolean;
  error: boolean;
  testMode: boolean;
  availableCad: number;
  pendingCad: number;
  payouts: StripePayout[];
  dashboardUrl: string;
};

function sumCad(entries: { amount: number; currency: string }[]): number {
  return entries.filter(e => e.currency === 'cad').reduce((s, e) => s + e.amount, 0) / 100;
}

function fmtDate(unixSeconds: number): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(unixSeconds * 1000)
  );
}

export async function getStripePayoutSummary(): Promise<StripePayoutSummary> {
  const testMode = !!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
  const dashboardUrl = `https://dashboard.stripe.com/${testMode ? 'test/' : ''}payouts`;

  if (!stripe) {
    return { configured: false, error: false, testMode, availableCad: 0, pendingCad: 0, payouts: [], dashboardUrl };
  }

  try {
    const [balance, payouts] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.payouts.list({ limit: 8 }),
    ]);

    return {
      configured: true,
      error: false,
      testMode,
      availableCad: sumCad(balance.available),
      pendingCad: sumCad(balance.pending),
      payouts: payouts.data.map(p => ({
        id: p.id,
        amountCad: p.amount / 100,
        status: p.status,
        arrivalDate: fmtDate(p.arrival_date),
      })),
      dashboardUrl,
    };
  } catch (error) {
    console.error('[stripe payouts] failed to load', error);
    return { configured: true, error: true, testMode, availableCad: 0, pendingCad: 0, payouts: [], dashboardUrl };
  }
}
