'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { checkPromoCode } from '@/server/place-order';
import { C, DISPLAY, UI, label } from '../tokens';
import { formatCad, orderTotals, shippingCost, type Discount, type ShippingZone } from '@/server/pricing';

/* ─── Shipping options ──────────────────────────────────── */
const SHIPPING_OPTS: { id: string; zone: ShippingZone; label: string; est: string }[] = [
  { id: 'ca-us', zone: 'canada-us',     label: 'Canada / United States', est: '5–8 business days' },
  { id: 'uk',    zone: 'uk',            label: 'United Kingdom',         est: '8–12 business days' },
  { id: 'ng',    zone: 'nigeria',       label: 'Nigeria',                est: '7–14 business days' },
  { id: 'intl',  zone: 'rest-of-world', label: 'Rest of World',          est: '10–18 business days' },
];

/** What a zone costs, written the way the option list shows it. */
function shippingLabel(zone: ShippingZone): string {
  const cents = shippingCost(zone, 'standard');
  return cents === 0 ? 'Free' : formatCad(cents);
}

/* ─── Helpers ─────────────────────────────────────────────── */

/* ─── Trust signals ─────────────────────────────────────── */
const TRUST = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Escrow-Protected Payments',
    body: 'Funds held until delivery confirmed',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Worldwide Delivery',
    body: 'Shipping to 50+ countries',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: 'Easy Returns',
    body: '14-day return policy, no hassle',
  },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Cart() {
  const { lines, count: itemCount, setQuantity, remove, hydrated } = useCart();

  const [shipping, setShipping] = useState('ca-us');
  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState<{ code: string; discount: Discount; description: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [checking, setChecking] = useState(false);

  const selectedShip = SHIPPING_OPTS.find(o => o.id === shipping)!;

  const totals = orderTotals(
    lines.map(line => ({ unitPriceCents: line.unitPriceCents, quantity: line.quantity })),
    applied?.discount ?? null,
    selectedShip.zone,
    'standard'
  );

  // The code is checked against the database rather than a string in this file,
  // so the cart can only offer discounts the owner actually created.
  async function applyPromo() {
    setChecking(true);
    setPromoError('');

    const result = await checkPromoCode(promo);
    if (result.ok) {
      setApplied({ code: result.code, discount: result.discount, description: result.description });
    } else {
      setApplied(null);
      setPromoError(result.message);
    }

    setChecking(false);
  }

  function clearPromo() {
    setApplied(null);
    setPromo('');
    setPromoError('');
  }

  // Until localStorage has been read the cart looks empty, and showing the
  // "nothing here" page to someone who has items would be wrong.
  if (!hydrated) {
    return <div className="min-h-[70vh]" style={{ backgroundColor: C.cream }} aria-busy="true" />;
  }

  /* ── Empty state ─────────────────────────────────────── */
  if (lines.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-8 text-center" style={{ backgroundColor: C.cream }}>
        <div className="mb-8 opacity-[0.18]">
          <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <div className="mb-3.5" style={{ fontFamily: DISPLAY, fontSize: '2.25rem', color: C.charcoal, fontWeight: 500, letterSpacing: '-0.02em' }}>
          Your cart is empty
        </div>
        <p className="max-w-[340px] mb-9" style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.55)', lineHeight: 1.7 }}>
          Discover our collection of handcrafted Yoruba traditional wear — made to order and shipped worldwide.
        </p>
        <Link to="/shop" className="no-underline">
          <button
            className="shimmer-cta cursor-pointer py-[0.9rem] px-9"
            style={{
              backgroundColor: C.gold,
              color: C.charcoal,
              border: 'none',
              ...label,
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
            }}
          >
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  /* ── Full cart ──────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1440px] mx-auto pt-14 px-10 pb-24">

        {/* Page header */}
        <div className="mb-12 flex items-baseline gap-4 flex-wrap">
          <h1 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.025em' }}>
            Your Cart
          </h1>
          <span style={{ ...label, fontSize: '0.7rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.14em' }}>
            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
        </div>

        {/* Two-column grid */}
        <div className="cart-grid grid grid-cols-[1fr_384px] gap-14 items-start">

          {/* ─── Left: Items ─────────────────────────── */}
          <div>
            {/* Column headers */}
            <div
              className="grid gap-4 items-center pb-3.5"
              style={{
                gridTemplateColumns: '88px 1fr auto auto',
                ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.45)',
                borderBottom: `1px solid rgba(43,35,32,0.1)`,
              }}
            >
              <span />
              <span>Product</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Total</span>
            </div>

            {/* Line items */}
            {lines.map((item, idx) => {
              const lineTotalCents = item.unitPriceCents * item.quantity;
              return (
                <div key={`${item.productId}:${item.size}`}>
                  <div
                    className="grid gap-4 items-start py-[1.875rem] relative"
                    style={{ gridTemplateColumns: '88px 1fr auto auto' }}
                  >
                    {/* Thumbnail */}
                    <div className="w-[88px] h-[88px] shrink-0 overflow-hidden" style={{ backgroundColor: '#e8e2da' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover block"
                      />
                    </div>

                    {/* Info */}
                    <div className="pt-[2px]">
                      <Link to={`/product/${item.slug}`} className="no-underline">
                        <div className="mb-[0.3rem]" style={{ fontFamily: DISPLAY, fontSize: '1.0625rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.3 }}>
                          {item.title}
                        </div>
                      </Link>
                      <div className="mb-3" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)' }}>
                        {item.color} · {item.size}
                      </div>
                      {/* Unit price */}
                      <div>
                        <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 500, color: C.charcoal }}>
                          {formatCad(item.unitPriceCents)}
                        </div>
                      </div>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center h-[38px] mt-[2px]" style={{ border: `1px solid rgba(43,35,32,0.18)` }}>
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-[34px] h-full flex items-center justify-center cursor-pointer"
                        style={{ background: 'none', border: 'none', color: C.charcoal, fontSize: '1.1rem', lineHeight: 1 }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-[32px] text-center select-none" style={{ fontFamily: UI, fontSize: '0.875rem', color: C.charcoal }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-[34px] h-full flex items-center justify-center cursor-pointer"
                        style={{ background: 'none', border: 'none', color: C.charcoal, fontSize: '1.1rem', lineHeight: 1 }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div className="text-right pt-[2px]">
                      <button
                        onClick={() => remove(item.productId, item.size)}
                        className="flex ml-auto cursor-pointer mb-1.5 p-0"
                        style={{ background: 'none', border: 'none', color: 'rgba(43,35,32,0.3)', lineHeight: 0 }}
                        aria-label={`Remove ${item.title}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 600, color: C.charcoal }}>
                        {formatCad(lineTotalCents)}
                      </div>
                    </div>
                  </div>

                  {idx < lines.length - 1 && (
                    <div className="h-px" style={{ backgroundColor: 'rgba(43,35,32,0.08)' }} />
                  )}
                </div>
              );
            })}

            {/* Continue shopping link */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(43,35,32,0.08)' }}>
              <Link to="/shop" className="no-underline">
                <button className="inline-flex items-center gap-2 cursor-pointer py-[0.7rem] px-6" style={{
                  background: 'none',
                  border: `1.5px solid ${C.maroon}`,
                  color: C.maroon,
                  ...label,
                  fontSize: '0.65rem',
                  letterSpacing: '0.13em',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* ─── Right: Order Summary ─────────────────── */}
          <div className="sticky top-[88px]">
            <div className="p-8" style={{
              backgroundColor: C.cream,
              border: `1px solid rgba(43,35,32,0.14)`,
              boxShadow: '0 4px 32px rgba(43,35,32,0.07)',
            }}>
              <h2 className="m-0 mb-7" style={{ fontFamily: DISPLAY, fontSize: '1.375rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.015em' }}>
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between items-baseline mb-2.5">
                <span style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.65)' }}>Subtotal</span>
                <div className="text-right">
                  <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: C.charcoal }}>{formatCad(totals.subtotalCents)}</div>
                </div>
              </div>

              {/* Discount */}
              {applied && (
                <div className="flex justify-between items-baseline mb-2.5">
                  <span style={{ fontFamily: UI, fontSize: '0.875rem', color: C.teal }}>Promo ({applied.code} — {applied.description})</span>
                  <div className="text-right">
                    <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: C.teal }}>−{formatCad(totals.discountCents)}</div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.65)' }}>Shipping</span>
                  <div className="text-right">
                    <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: totals.shippingCents === 0 ? C.teal : C.charcoal }}>
                      {shippingLabel(selectedShip.zone)}
                    </div>
                    <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.4)' }}>{selectedShip.est}</div>
                  </div>
                </div>
                <select
                  value={shipping}
                  onChange={e => setShipping(e.target.value)}
                  className="w-full py-[0.6rem] pl-3 pr-8 cursor-pointer appearance-none"
                  style={{
                    border: `1px solid rgba(43,35,32,0.2)`,
                    backgroundColor: C.cream,
                    fontFamily: UI,
                    fontSize: '0.8rem',
                    color: C.charcoal,
                    outline: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232B2320' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  {SHIPPING_OPTS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="h-px mb-6" style={{ backgroundColor: 'rgba(43,35,32,0.1)' }} />

              {/* Promo code */}
              <div className="mb-7">
                <div className="mb-2.5" style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.5)', letterSpacing: '0.13em' }}>
                  Promo Code
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promo}
                    disabled={!!applied}
                    onChange={e => { setPromo(e.target.value); setPromoError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter' && !applied) { e.preventDefault(); applyPromo(); } }}
                    className="flex-1 py-[0.65rem] px-3 min-w-0"
                    style={{
                      border: `1px solid ${promoError ? '#C0392B' : 'rgba(43,35,32,0.2)'}`,
                      backgroundColor: applied ? 'rgba(43,35,32,0.04)' : C.cream,
                      fontFamily: UI,
                      fontSize: '0.8rem',
                      color: C.charcoal,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={applied ? clearPromo : applyPromo}
                    disabled={checking}
                    className="px-3.5 py-0 whitespace-nowrap shrink-0"
                    style={{
                      border: `1.5px solid ${C.maroon}`,
                      background: 'none',
                      color: C.maroon,
                      ...label,
                      fontSize: '0.6rem',
                      cursor: checking ? 'wait' : 'pointer',
                      letterSpacing: '0.12em',
                      opacity: checking ? 0.6 : 1,
                    }}
                  >
                    {checking ? 'Checking' : applied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="mt-1.5 mx-0 mb-0" style={{ fontFamily: UI, fontSize: '0.725rem', color: '#C0392B' }}>
                    {promoError}
                  </p>
                )}
                {applied && (
                  <p className="mt-1.5 mx-0 mb-0" style={{ fontFamily: UI, fontSize: '0.725rem', color: C.teal }}>
                    {applied.description} applied.
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px mb-6" style={{ backgroundColor: 'rgba(43,35,32,0.1)' }} />

              {/* Total */}
              <div className="flex justify-between items-baseline mb-[1.875rem]">
                <span style={{ fontFamily: DISPLAY, fontSize: '1.0625rem', color: C.charcoal, fontWeight: 500 }}>Total</span>
                <div className="text-right">
                  <div style={{ fontFamily: DISPLAY, fontSize: '1.375rem', fontWeight: 600, color: C.charcoal, letterSpacing: '-0.015em' }}>
                    {formatCad(totals.totalCents)}
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                to={applied ? `/checkout?promo=${encodeURIComponent(applied.code)}` : '/checkout'}
                className="block no-underline mb-3.5"
              >
                <span
                  className="shimmer-cta w-full block text-center p-4 rounded-[4px] cursor-pointer"
                  style={{
                    backgroundColor: C.gold,
                    color: C.charcoal,
                    border: 'none',
                    ...label,
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                  }}
                >
                  Proceed to Checkout
                </span>
              </Link>

              {/* Secondary CTA */}
              <Link to="/shop" className="block text-center no-underline">
                <span className="underline cursor-pointer" style={{
                  fontFamily: UI,
                  fontSize: '0.8rem',
                  color: C.indigo,
                  textUnderlineOffset: '3px',
                }}>
                  Continue Shopping
                </span>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-col gap-3.5">
              {TRUST.map(t => (
                <div key={t.title} className="flex gap-3.5 items-start">
                  <div className="shrink-0 mt-[1px] opacity-[0.85]">{t.icon}</div>
                  <div>
                    <div className="mb-[1px]" style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal }}>{t.title}</div>
                    <div style={{ fontFamily: UI, fontSize: '0.73rem', color: 'rgba(43,35,32,0.5)', lineHeight: 1.5 }}>{t.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1000px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .cart-grid > div:first-child > div[style*="88px 1fr auto auto"] {
            grid-template-columns: 72px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
