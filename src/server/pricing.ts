/**
 * Cart and order pricing.
 *
 * Pure functions: no database, no React, no framework. Given the same inputs
 * they always return the same result, which makes them the easiest part of the
 * backend to reason about and to test.
 *
 * Cart and checkout both receive owner-controlled shipping configuration from
 * PageContent. The server action reads that same record before writing an
 * order, so browser values cannot change the amount charged.
 *
 * ── Working notes ────────────────────────────────────────────────────────────
 * Everything is in Canadian dollars. Money is held as whole cents (an integer),
 * never as a float: 0.1 + 0.2 !== 0.3 in JavaScript, and that error compounds
 * across a cart. Convert to dollars only when displaying.
 */

import { SHIPPING_DEFAULTS, type ShippingContent } from './content-schema';

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

export const FREE_SHIPPING_THRESHOLD_CENTS = SHIPPING_DEFAULTS.freeShippingThresholdCents;

// ── 1. Subtotal ──────────────────────────────────────────────────────────────

/**
 * Sum of every line, in cents.
 *
 * An empty cart is 0, not an error.
 */
export function subtotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);
}

// ── 2. Discounts ─────────────────────────────────────────────────────────────

/**
 * How much a discount takes off, in cents.
 */
export function discountAmount(subtotalCents: number, discount: Discount | null): number {
  if (!discount || subtotalCents <= 0) {
    return 0;
  }

  let calculatedDiscount = 0;

  if (discount.kind === 'percentage') {
    // Math.round handles uneven percentage divisions consistently
    calculatedDiscount = Math.round(subtotalCents * (discount.value / 100));
  } else if (discount.kind === 'fixed') {
    calculatedDiscount = discount.value;
  }

  // Clamp at both ends. The upper bound stops a discount exceeding the cart;
  // the lower bound stops a negative value — a code mistyped as -10 in the
  // console — turning into a surcharge, because subtracting a negative adds.
  return Math.max(0, Math.min(calculatedDiscount, subtotalCents));
}

// ── 3. Shipping ──────────────────────────────────────────────────────────────

/**
 * Shipping cost in cents for a zone and speed.
 */
export function shippingCost(zone: ShippingZone, speed: ShippingSpeed, subtotalCents = 0, config?: ShippingContent): number {
  const source = config ?? SHIPPING_DEFAULTS;
  const threshold = source.freeShippingThresholdCents;
  if (speed === 'standard' && subtotalCents >= threshold) {
    return 0;
  }
  const region = source.regions.find(r => r.id === zone);
  if (!region) return 0;
  if (speed === 'standard') return region.costCadCents;
  // The console stores delivery wording, while the CAD amount is the base
  // standard rate. Express pricing has no separate field in the settings UI;
  // keep it explicitly derived until the owner adds an express-cost field.
  return region.costCadCents === 0 ? 0 : Math.round(region.costCadCents * 1.65);
}

// ── 4. Putting it together ───────────────────────────────────────────────────

/**
 * Every figure the cart, checkout and confirmation pages need.
 */
export function orderTotals(
  lines: CartLine[],
  discount: Discount | null,
  zone: ShippingZone,
  speed: ShippingSpeed,
  config?: ShippingContent,
): OrderTotals {
  const subtotalCents = subtotal(lines);
  const discountCents = discountAmount(subtotalCents, discount);
  const shippingCents = shippingCost(zone, speed, subtotalCents, config);
  
  // Total is subtotal minus discount, plus shipping
  const totalCents = (subtotalCents - discountCents) + shippingCents;

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents
  };
}

// ── 5. Display ───────────────────────────────────────────────────────────────

/**
 * Cents to a string the storefront can render: 8900 becomes "CAD $89.00".
 */
export function formatCad(cents: number): string {
  // Intl with currency 'CAD' renders "$89.00" — correct for Canada, but the
  // storefront says "CAD $89" everywhere so shoppers in Lagos and London are
  // not left guessing which dollar. Compose the prefix and let Intl handle the
  // grouping and the decimals.
  const amount = new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

  return `CAD $${amount}`;
}
