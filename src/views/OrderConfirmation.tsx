'use client';

import { useEffect } from 'react';
import { Link } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { C, DISPLAY, UI, label } from '../tokens';
import { formatCad } from '@/server/pricing';
import type { OrderDetail } from '@/server/orders';

/**
 * The order someone has just placed.
 *
 * This page used to render a fixture — a different customer's name, and a Lagos
 * address that belonged to nobody. A shopper reaching it after checking out was
 * shown someone else's delivery details as their own.
 */

/* ─── Progress bar (mirrors Checkout's, step 4 = Confirmation active) */
const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
function ProgressBar() {
  const current = 3; // "Confirmation" step
  return (
    <div className="checkout-steps flex items-center justify-center">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center">
            {i > 0 && (
              <div className="checkout-step-line w-10 h-px" style={{ backgroundColor: done || active ? C.maroon : 'rgba(43,35,32,0.2)' }} />
            )}
            <div className="flex flex-col items-center gap-[4px]">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: active ? C.gold : done ? C.maroon : 'rgba(43,35,32,0.1)' }}
              >
                {done || active ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke={active ? C.charcoal : '#fff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontFamily: UI, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(43,35,32,0.4)' }}>{i + 1}</span>
                )}
              </div>
              <span className="checkout-step-label" style={{ ...label, fontSize: '0.575rem', color: active ? C.gold : done ? C.maroon : 'rgba(43,35,32,0.4)', letterSpacing: '0.1em' }}>
                {s}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Trust items ────────────────────────────────────────────── */
const TRUST = [
  { path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Escrow-Protected Payments' },
  { path: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2zM2 12h20', label: 'Worldwide Delivery' },
  { path: 'M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z', label: 'Hassle-Free Returns' },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function OrderConfirmation({ order }: { order: OrderDetail }) {
  // Reaching this page means the order was placed — empty the cart. (Stripe
  // redirects here on success without the checkout page having cleared it.)
  const { clear, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: UI, color: C.charcoal }}>

      {/* ── Header (identical to Checkout) ──────────────────── */}
      <header style={{ backgroundColor: C.maroon, borderBottom: `1px solid rgba(212,169,78,0.22)` }}>
        <div className="max-w-[1240px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link to="/" className="no-underline">
            <div style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              AdeClassics
            </div>
            <div className="mt-[2px] uppercase" style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold, letterSpacing: '0.16em' }}>
              Timeless Elegance
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="uppercase" style={{ fontFamily: UI, fontSize: '0.7rem', color: C.cream, letterSpacing: '0.08em', opacity: 0.85 }}>
              Secure Checkout
            </span>
          </div>
        </div>
        <div className="py-[0.7rem] px-8" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
          <ProgressBar />
        </div>
      </header>

      {/* ── Page body ─────────────────────────────────────────── */}
      <div className="max-w-[680px] mx-auto pt-16 px-8 pb-20">

        {/* ── Hero checkmark ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Animated check circle */}
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-7"
            style={{
              backgroundColor: 'rgba(59,138,147,0.1)',
              borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.3)',
              boxShadow: '0 0 0 8px rgba(59,138,147,0.06)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="mb-3.5" style={{ fontFamily: DISPLAY, fontSize: '2.25rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.12 }}>
            Thank You for Your Order
          </h1>

          <p className="max-w-[460px]" style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.6)', lineHeight: 1.7 }}>
            Order <strong style={{ color: C.charcoal }}>{order.number}</strong> confirmed — we have sent the details to{' '}
            <span style={{ color: C.indigo, fontWeight: 500 }}>{order.customerEmail}</span>.
          </p>
        </div>

        {/* ── Order summary card ─────────────────────────────── */}
        <div
          className="rounded-lg overflow-hidden mb-8"
          style={{
            backgroundColor: '#fff',
            borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.12)',
            boxShadow: '0 2px 16px rgba(43,35,32,0.06)',
          }}
        >
          {/* Card header */}
          <div
            className="py-4 px-6 flex items-center justify-between"
            style={{ backgroundColor: C.cream, borderBottom: `1px solid rgba(43,35,32,0.1)` }}
          >
            <div style={{ ...label, color: C.charcoal, fontSize: '0.65rem' }}>Order Summary</div>
            <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.02em' }}>
              {order.number}
            </div>
          </div>

          {/* Items */}
          <div className="py-[1.125rem] px-6 flex flex-col gap-4">
            {order.items.map((it, idx) => (
              <div key={`${it.name}:${it.variant ?? ''}:${idx}`} className="flex gap-3.5 items-start">
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal }}>
                    {it.name}
                  </div>
                  <div className="mt-[2px]" style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)' }}>
                    {[it.variant, it.qty > 1 ? `Qty ${it.qty}` : null].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div style={{ fontFamily: UI, fontSize: '0.825rem', fontWeight: 600, color: C.charcoal }}>
                    {formatCad(Math.round(it.unitCad * it.qty * 100))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-4 px-6 flex flex-col gap-[0.575rem]" style={{ borderTop: `1px solid rgba(43,35,32,0.1)` }}>
            <div className="flex justify-between items-baseline">
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.58)' }}>Subtotal</span>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: C.charcoal }}>{formatCad(Math.round(order.subtotalCad * 100))}</span>
            </div>
            {order.discountCad > 0 && (
              <div className="flex justify-between items-baseline">
                <span style={{ fontFamily: UI, fontSize: '0.8rem', color: C.teal }}>Discount</span>
                <span style={{ fontFamily: UI, fontSize: '0.8rem', color: C.teal, fontWeight: 600 }}>−{formatCad(Math.round(order.discountCad * 100))}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.58)' }}>Shipping</span>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: order.shippingCad === 0 ? C.teal : C.charcoal, fontWeight: order.shippingCad === 0 ? 600 : 400 }}>
                {order.shippingCad === 0 ? 'Free' : formatCad(Math.round(order.shippingCad * 100))}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-[0.6rem] mt-[0.15rem]" style={{ borderTop: `1px solid rgba(43,35,32,0.1)` }}>
              <span style={{ fontFamily: UI, fontWeight: 700, fontSize: '0.95rem', color: C.charcoal }}>Total</span>
              <div className="text-right">
                <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.charcoal, fontWeight: 600 }}>{formatCad(Math.round(order.totalCad * 100))}</div>
              </div>
            </div>
          </div>

          {/* Two-column: Shipping address + Delivery estimate */}
          <div className="rg-2 grid grid-cols-2" style={{ borderTop: `1px solid rgba(43,35,32,0.1)` }}>
            {/* Ship to */}
            <div className="py-4 px-6" style={{ borderRight: `1px solid rgba(43,35,32,0.1)` }}>
              <div className="mb-[0.55rem]" style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)' }}>Ship to</div>
              <div className="mb-[0.2rem]" style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal }}>{order.customerName}</div>
              <div style={{ fontFamily: UI, fontSize: '0.77rem', color: 'rgba(43,35,32,0.58)', lineHeight: 1.65 }}>
                {order.address}
              </div>
            </div>

            {/* Estimated delivery */}
            <div className="py-4 px-6">
              <div className="mb-[0.55rem]" style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)' }}>Estimated delivery</div>
              <div className="flex items-center gap-[0.45rem] mb-[0.35rem]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal }}>
                  Placed {order.placedAt}
                </span>
              </div>
              <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55 }}>
                We will confirm your pieces and email a payment link, then a tracking number once your order is dispatched.
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ─────────────────────────────────── */}
        <div className="flex gap-3.5 mb-10">
          <Link
            to="/account/orders"
            className="flex-1 block text-center py-[0.95rem] px-6 rounded-[5px] uppercase no-underline"
            style={{
              backgroundColor: C.gold, color: C.charcoal,
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em',
              boxShadow: '0 2px 14px rgba(212,169,78,0.38)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 22px rgba(212,169,78,0.5)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 14px rgba(212,169,78,0.38)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}
          >
            Track Your Order
          </Link>
          <Link
            to="/shop"
            className="flex-1 block text-center py-[0.95rem] px-6 rounded-[5px] uppercase no-underline"
            style={{
              backgroundColor: 'transparent', color: C.maroon,
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em',
              borderWidth: '1.5px', borderStyle: 'solid', borderColor: C.maroon,
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.backgroundColor = 'rgba(122,46,56,0.06)'; }}
            onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.backgroundColor = 'transparent'; }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* ── Trust row ──────────────────────────────────────── */}
        <div className="flex justify-center gap-8 flex-wrap pt-6" style={{ borderTop: `1px solid rgba(43,35,32,0.08)` }}>
          {TRUST.map(t => (
            <div key={t.label} className="flex items-center gap-[0.45rem]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.path} />
              </svg>
              <span style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.52)', letterSpacing: '0.02em' }}>{t.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Minimal footer (identical to Checkout) ────────────── */}
      <footer style={{ backgroundColor: C.maroon, borderTop: `1px solid rgba(212,169,78,0.15)` }}>
        <div className="max-w-[1240px] mx-auto py-5 px-8 flex items-center justify-between flex-wrap gap-3">
          <span style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.45)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} AdeClassics. All rights reserved.
          </span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Returns'].map(lnk => (
              <a key={lnk} href="#" className="no-underline" style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.5)', letterSpacing: '0.04em' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,240,0.5)')}
              >
                {lnk}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
