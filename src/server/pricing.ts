/**
 * Cart and order pricing.
 *
 * Pure functions: no database, no React, no framework. Given the same inputs
 * they always return the same result, which makes them the easiest part of the
 * backend to reason about and to test.
 *
 * Right now this logic is inlined in Cart.tsx and duplicated in Checkout.tsx,
 * where it has already drifted — see the note on shippingCost below. Pulling it
 * here means the cart, the checkout and the order confirmation cannot disagree
 * about what someone owes.
 *
 * ── Working notes ────────────────────────────────────────────────────────────
 * Everything is in Canadian dollars. Money is held as whole cents (an integer),
 * never as a float: 0.1 + 0.2 !== 0.3 in JavaScript, and that error compounds
 * across a cart. Convert to dollars only when displaying.
 */

export type CartLine = {
  /** Price of one unit, in cents. 8900 means CAD $89.00. */
  unitPriceCents: number;
  quantity: number;
};

export type Discount =
  | { kind: 'percentage'; value: number }   // value: 10 means 10% off
  | { kind: 'fixed'; value: number };       // value: cents off the subtotal

export type ShippingZone = 'canada-us' | 'uk' | 'nigeria' | 'rest-of-world';
export type ShippingSpeed = 'standard' | 'express';

export type OrderTotals = {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
};

// ── 1. Subtotal ──────────────────────────────────────────────────────────────

/**
 * Sum of every line, in cents.
 *
 * An empty cart is 0, not an error.
 */
export function subtotal(lines: CartLine[]): number {
  // TODO
  throw new Error('not implemented');
}

// ── 2. Discounts ─────────────────────────────────────────────────────────────

/**
 * How much a discount takes off, in cents.
 *
 * Think about, and decide deliberately:
 *   - A percentage that does not divide evenly. 10% of 8999 is 899.9 — round it,
 *     and be consistent, because the rounding is real money.
 *   - A fixed discount larger than the subtotal. The result must never be
 *     negative; nobody gets paid for ordering.
 *   - A subtotal of 0.
 */
export function discountAmount(subtotalCents: number, discount: Discount | null): number {
  // TODO
  throw new Error('not implemented');
}

// ── 3. Shipping ──────────────────────────────────────────────────────────────

/**
 * Shipping cost in cents for a zone and speed.
 *
 * Cart.tsx currently does this:
 *
 *     const totalCad = subtotalCad - discountCad + (selectedShip.cost ? 7 : 0);
 *
 * which charges a flat 7 for every destination that is not free — so the United
 * Kingdom, Nigeria and the rest of the world are all billed the same regardless
 * of the rates shown a few lines above. That is the bug this function exists to
 * remove, so pick the rates deliberately rather than copying that line.
 *
 * Suggested rates (CAD, in cents), but they are yours to set:
 *   canada-us      standard 0      express 2500
 *   uk             standard 500    express 1800
 *   nigeria        standard 700    express 2000
 *   rest-of-world  standard 1000   express 2500
 */
export function shippingCost(zone: ShippingZone, speed: ShippingSpeed): number {
  // TODO
  throw new Error('not implemented');
}

// ── 4. Putting it together ───────────────────────────────────────────────────

/**
 * Every figure the cart, checkout and confirmation pages need.
 *
 * The discount applies to the subtotal only — never to shipping — and the total
 * can never fall below the shipping cost.
 */
export function orderTotals(
  lines: CartLine[],
  discount: Discount | null,
  zone: ShippingZone,
  speed: ShippingSpeed
): OrderTotals {
  // TODO: build this from the three functions above rather than recalculating.
  throw new Error('not implemented');
}

// ── 5. Display ───────────────────────────────────────────────────────────────

/**
 * Cents to a string the storefront can render: 8900 becomes "CAD $89.00".
 *
 * Intl.NumberFormat with 'en-CA' and currency 'CAD' does the formatting; your
 * job is the conversion from cents and choosing whether to show trailing zeros.
 */
export function formatCad(cents: number): string {
  // TODO
  throw new Error('not implemented');
}
