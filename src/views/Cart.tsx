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
    return <div style={{ backgroundColor: C.cream, minHeight: '70vh' }} aria-busy="true" />;
  }

  /* ── Empty state ─────────────────────────────────────── */
  if (lines.length === 0) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem', opacity: 0.18 }}>
          <svg width="88" height="88" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: '2.25rem', color: C.charcoal, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '0.875rem' }}>
          Your cart is empty
        </div>
        <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.55)', lineHeight: 1.7, maxWidth: '340px', marginBottom: '2.25rem' }}>
          Discover our collection of handcrafted Yoruba traditional wear — made to order and shipped worldwide.
        </p>
        <Link to="/shop" style={{ textDecorationLine: 'none' }}>
          <button
            className="shimmer-cta"
            style={{
              backgroundColor: C.gold,
              color: C.charcoal,
              border: 'none',
              ...label,
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              padding: '0.9rem 2.25rem',
              cursor: 'pointer',
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
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '3.5rem 2.5rem 6rem' }}>

        {/* Page header */}
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.025em', margin: 0 }}>
            Your Cart
          </h1>
          <span style={{ ...label, fontSize: '0.7rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.14em' }}>
            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
        </div>

        {/* Two-column grid */}
        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 384px', gap: '3.5rem', alignItems: 'start' }}>

          {/* ─── Left: Items ─────────────────────────── */}
          <div>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '88px 1fr auto auto',
              gap: '1rem', alignItems: 'center',
              ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.45)',
              paddingBottom: '0.875rem',
              borderBottom: `1px solid rgba(43,35,32,0.1)`,
              marginBottom: '0',
            }}>
              <span />
              <span>Product</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {/* Line items */}
            {lines.map((item, idx) => {
              const lineTotalCents = item.unitPriceCents * item.quantity;
              return (
                <div key={`${item.productId}:${item.size}`}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '88px 1fr auto auto',
                    gap: '1rem',
                    alignItems: 'start',
                    padding: '1.875rem 0',
                    position: 'relative',
                  }}>
                    {/* Thumbnail */}
                    <div style={{ width: '88px', height: '88px', backgroundColor: '#e8e2da', flexShrink: 0, overflow: 'hidden' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ paddingTop: '2px' }}>
                      <Link to={`/product/${item.slug}`} style={{ textDecorationLine: 'none' }}>
                        <div style={{ fontFamily: DISPLAY, fontSize: '1.0625rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.3, marginBottom: '0.3rem' }}>
                          {item.title}
                        </div>
                      </Link>
                      <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.75rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: `1px solid rgba(43,35,32,0.18)`, height: '38px', marginTop: '2px' }}>
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                        style={{ width: '34px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: C.charcoal, fontSize: '1.1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontFamily: UI, fontSize: '0.875rem', color: C.charcoal, userSelect: 'none' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                        style={{ width: '34px', height: '100%', background: 'none', border: 'none', cursor: 'pointer', color: C.charcoal, fontSize: '1.1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div style={{ textAlign: 'right', paddingTop: '2px' }}>
                      <button
                        onClick={() => remove(item.productId, item.size)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(43,35,32,0.3)', marginBottom: '0.375rem', padding: '0', display: 'flex', marginLeft: 'auto', lineHeight: 0 }}
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
                    <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.08)' }} />
                  )}
                </div>
              );
            })}

            {/* Continue shopping link */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(43,35,32,0.08)' }}>
              <Link to="/shop" style={{ textDecorationLine: 'none' }}>
                <button style={{
                  background: 'none',
                  border: `1.5px solid ${C.maroon}`,
                  color: C.maroon,
                  ...label,
                  fontSize: '0.65rem',
                  letterSpacing: '0.13em',
                  padding: '0.7rem 1.5rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{
              backgroundColor: C.cream,
              border: `1px solid rgba(43,35,32,0.14)`,
              boxShadow: '0 4px 32px rgba(43,35,32,0.07)',
              padding: '2rem',
            }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: '1.375rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.015em', margin: '0 0 1.75rem' }}>
                Order Summary
              </h2>

              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.625rem' }}>
                <span style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.65)' }}>Subtotal</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: C.charcoal }}>{formatCad(totals.subtotalCents)}</div>
                </div>
              </div>

              {/* Discount */}
              {applied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.625rem' }}>
                  <span style={{ fontFamily: UI, fontSize: '0.875rem', color: C.teal }}>Promo ({applied.code} — {applied.description})</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: C.teal }}>−{formatCad(totals.discountCents)}</div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                  <span style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.65)' }}>Shipping</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 500, color: totals.shippingCents === 0 ? C.teal : C.charcoal }}>
                      {shippingLabel(selectedShip.zone)}
                    </div>
                    <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.4)' }}>{selectedShip.est}</div>
                  </div>
                </div>
                <select
                  value={shipping}
                  onChange={e => setShipping(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    border: `1px solid rgba(43,35,32,0.2)`,
                    backgroundColor: C.cream,
                    fontFamily: UI,
                    fontSize: '0.8rem',
                    color: C.charcoal,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232B2320' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    paddingRight: '2rem',
                  }}
                >
                  {SHIPPING_OPTS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.1)', marginBottom: '1.5rem' }} />

              {/* Promo code */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.625rem', letterSpacing: '0.13em' }}>
                  Promo Code
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promo}
                    disabled={!!applied}
                    onChange={e => { setPromo(e.target.value); setPromoError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter' && !applied) { e.preventDefault(); applyPromo(); } }}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.75rem',
                      border: `1px solid ${promoError ? '#C0392B' : 'rgba(43,35,32,0.2)'}`,
                      backgroundColor: applied ? 'rgba(43,35,32,0.04)' : C.cream,
                      fontFamily: UI,
                      fontSize: '0.8rem',
                      color: C.charcoal,
                      outline: 'none',
                      minWidth: 0,
                    }}
                  />
                  <button
                    onClick={applied ? clearPromo : applyPromo}
                    disabled={checking}
                    style={{
                      border: `1.5px solid ${C.maroon}`,
                      background: 'none',
                      color: C.maroon,
                      ...label,
                      fontSize: '0.6rem',
                      padding: '0 0.875rem',
                      cursor: checking ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.12em',
                      flexShrink: 0,
                      opacity: checking ? 0.6 : 1,
                    }}
                  >
                    {checking ? 'Checking' : applied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p style={{ fontFamily: UI, fontSize: '0.725rem', color: '#C0392B', margin: '0.375rem 0 0' }}>
                    {promoError}
                  </p>
                )}
                {applied && (
                  <p style={{ fontFamily: UI, fontSize: '0.725rem', color: C.teal, margin: '0.375rem 0 0' }}>
                    {applied.description} applied.
                  </p>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.1)', marginBottom: '1.5rem' }} />

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.875rem' }}>
                <span style={{ fontFamily: DISPLAY, fontSize: '1.0625rem', color: C.charcoal, fontWeight: 500 }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: '1.375rem', fontWeight: 600, color: C.charcoal, letterSpacing: '-0.015em' }}>
                    {formatCad(totals.totalCents)}
                  </div>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                to={applied ? `/checkout?promo=${encodeURIComponent(applied.code)}` : '/checkout'}
                style={{ textDecorationLine: 'none', display: 'block', marginBottom: '0.875rem' }}
              >
                <span
                  className="shimmer-cta"
                  style={{
                    width: '100%',
                    backgroundColor: C.gold,
                    color: C.charcoal,
                    border: 'none',
                    ...label,
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'block',
                    textAlign: 'center',
                    borderRadius: '4px',
                  }}
                >
                  Proceed to Checkout
                </span>
              </Link>

              {/* Secondary CTA */}
              <Link to="/shop" style={{ textDecorationLine: 'none', display: 'block', textAlign: 'center' }}>
                <span style={{
                  fontFamily: UI,
                  fontSize: '0.8rem',
                  color: C.indigo,
                  textDecorationLine: 'underline',
                  textUnderlineOffset: '3px',
                  cursor: 'pointer',
                }}>
                  Continue Shopping
                </span>
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {TRUST.map(t => (
                <div key={t.title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: '1px', opacity: 0.85 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, marginBottom: '1px' }}>{t.title}</div>
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
