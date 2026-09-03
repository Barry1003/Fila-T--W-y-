/**
 * Tests for src/server/pricing.ts — run with:  node --test src/server/__tests__/
 *
 * They all fail right now, because the functions throw. Make them pass one at a
 * time. When these go green, the pricing is correct by definition and you can
 * change how it works without fear.
 *
 * Add your own cases as you go — especially the awkward ones. The bugs live in
 * the awkward ones.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subtotal, discountAmount, shippingCost, orderTotals, formatCad } from '../pricing.ts';

test('subtotal adds up the lines', () => {
  assert.equal(subtotal([{ unitPriceCents: 8900, quantity: 2 }]), 17800);
  assert.equal(subtotal([
    { unitPriceCents: 8900, quantity: 1 },
    { unitPriceCents: 14500, quantity: 3 },
  ]), 52400);
});

test('an empty cart costs nothing', () => {
  assert.equal(subtotal([]), 0);
});

test('a percentage discount comes off the subtotal', () => {
  assert.equal(discountAmount(10000, { kind: 'percentage', value: 10 }), 1000);
});

test('a percentage that does not divide evenly still returns whole cents', () => {
  const result = discountAmount(8999, { kind: 'percentage', value: 10 });
  assert.ok(Number.isInteger(result), `expected whole cents, got ${result}`);
});

test('a fixed discount never exceeds the subtotal', () => {
  assert.equal(discountAmount(1000, { kind: 'fixed', value: 5000 }), 1000);
});

test('no discount means no reduction', () => {
  assert.equal(discountAmount(10000, null), 0);
});

test('shipping differs by zone, which is the bug being fixed', () => {
  const uk = shippingCost('uk', 'standard');
  const ng = shippingCost('nigeria', 'standard');
  const row = shippingCost('rest-of-world', 'standard');
  assert.notEqual(uk, ng, 'UK and Nigeria should not cost the same');
  assert.notEqual(ng, row, 'Nigeria and rest-of-world should not cost the same');
});

test('express is never cheaper than standard', () => {
  for (const zone of ['canada-us', 'uk', 'nigeria', 'rest-of-world']) {
    assert.ok(shippingCost(zone, 'express') >= shippingCost(zone, 'standard'), `${zone} express is cheaper`);
  }
});

test('totals hang together', () => {
  const t = orderTotals(
    [{ unitPriceCents: 10000, quantity: 1 }],
    { kind: 'percentage', value: 10 },
    'uk',
    'standard'
  );
  assert.equal(t.subtotalCents, 10000);
  assert.equal(t.discountCents, 1000);
  assert.equal(t.totalCents, t.subtotalCents - t.discountCents + t.shippingCents);
});

test('a discount bigger than the cart never makes a negative total', () => {
  const t = orderTotals(
    [{ unitPriceCents: 500, quantity: 1 }],
    { kind: 'fixed', value: 100000 },
    'canada-us',
    'standard'
  );
  assert.ok(t.totalCents >= 0, `total was ${t.totalCents}`);
});

test('a discount can never be negative, whatever the code says', () => {
  // A discount stored as -10 in the console would otherwise *increase* the
  // total: Math.min(-1000, subtotal) is -1000, and subtracting a negative adds.
  assert.equal(discountAmount(10000, { kind: 'percentage', value: -10 }), 0);
  assert.equal(discountAmount(10000, { kind: 'fixed', value: -500 }), 0);
});

test('a bad discount never inflates what someone owes', () => {
  const t = orderTotals(
    [{ unitPriceCents: 10000, quantity: 1 }],
    { kind: 'percentage', value: -10 },
    'canada-us',
    'standard'
  );
  assert.ok(t.totalCents <= t.subtotalCents + t.shippingCents,
    `total ${t.totalCents} exceeds subtotal plus shipping`);
});

test('formatting shows dollars, not cents', () => {
  assert.match(formatCad(8900), /89/);
  assert.ok(!formatCad(8900).includes('8900'), 'looks like raw cents');
});

test('formatting matches how the storefront writes prices', () => {
  // "$89.00" alone is ambiguous to a shopper in Lagos or London.
  assert.equal(formatCad(8900), 'CAD $89.00');
  assert.equal(formatCad(0), 'CAD $0.00');
  assert.equal(formatCad(5), 'CAD $0.05');
  assert.equal(formatCad(123456789), 'CAD $1,234,567.89');
});
