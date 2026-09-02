'use client';

import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Order data (mirrors Checkout seed) ─────────────────────── */
const ORDER_NUM = 'FTW-10492';
const EMAIL = 'adunola@example.com';

const ITEMS = [
  { id: 8, title: 'Embroidered Agbada Kaftan', variant: 'Gold · Size L', cadPrice: 310, ngnPrice: 153950, qty: 1, img: 'photo-1765910083971-aa0e3688be46' },
  { id: 1, title: 'Gobi Filà Cap — Burgundy Velvet', variant: 'Burgundy · Size M', cadPrice: 89, ngnPrice: 44200, qty: 2, img: 'photo-1763823133159-c6f8ec380e33' },
  { id: 4, title: 'Aso-oke Gele — Ivory & Gold Set', variant: 'Gold · One Size', cadPrice: 145, ngnPrice: 71900, qty: 1, img: 'photo-1714124731489-7eb16af0ac91' },
];

const SHIPPING = { label: 'Standard', days: '5–8 business days', cadCost: 0, ngnCost: 0 };

const ADDRESS = {
  name: 'Adunola Okonkwo',
  line1: '14 Adeola Hopewell Street',
  city: 'Victoria Island',
  state: 'Lagos',
  postal: '101001',
  country: 'Nigeria',
};

/* ─── Helpers ────────────────────────────────────────────────── */
function cad(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
}

const subtotalCad = ITEMS.reduce((s, it) => s + it.cadPrice * it.qty, 0);
const subtotalNgn = ITEMS.reduce((s, it) => s + it.ngnPrice * it.qty, 0);
const totalCad = subtotalCad + SHIPPING.cadCost;
const totalNgn = subtotalNgn + SHIPPING.ngnCost;

/* ─── Progress bar (mirrors Checkout's, step 4 = Confirmation active) */
const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
function ProgressBar() {
  const current = 3; // "Confirmation" step
  return (
    <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div className="checkout-step-line" style={{ width: '2.5rem', height: '1px', backgroundColor: done || active ? C.maroon : 'rgba(43,35,32,0.2)' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: active ? C.gold : done ? C.maroon : 'rgba(43,35,32,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
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
export default function OrderConfirmation() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', fontFamily: UI, color: C.charcoal }}>

      {/* ── Header (identical to Checkout) ──────────────────── */}
      <header style={{ backgroundColor: C.maroon, borderBottom: `1px solid rgba(212,169,78,0.22)` }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecorationLine: 'none' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              AdeClassics
            </div>
            <div style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '2px' }}>
              Timeless Elegance
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontFamily: UI, fontSize: '0.7rem', color: C.cream, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
              Secure Checkout
            </span>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.12)', padding: '0.7rem 2rem' }}>
          <ProgressBar />
        </div>
      </header>

      {/* ── Page body ─────────────────────────────────────────── */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>

        {/* ── Hero checkmark ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
          {/* Animated check circle */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            backgroundColor: 'rgba(59,138,147,0.1)',
            borderWidth: '2px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.75rem',
            boxShadow: '0 0 0 8px rgba(59,138,147,0.06)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{
            fontFamily: DISPLAY, fontSize: '2.25rem', fontWeight: 500,
            color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.12,
            marginBottom: '0.875rem',
          }}>
            Thank You for Your Order
          </h1>

          <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.6)', lineHeight: 1.7, maxWidth: '460px' }}>
            Order <strong style={{ color: C.charcoal }}>#{ORDER_NUM}</strong> confirmed — a confirmation email has been sent to{' '}
            <span style={{ color: C.indigo, fontWeight: 500 }}>{EMAIL}</span>.
          </p>
        </div>

        {/* ── Order summary card ─────────────────────────────── */}
        <div style={{
          backgroundColor: '#fff',
          borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.12)',
          borderRadius: '8px', overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(43,35,32,0.06)',
          marginBottom: '2rem',
        }}>
          {/* Card header */}
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: C.cream,
            borderBottom: `1px solid rgba(43,35,32,0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ ...label, color: C.charcoal, fontSize: '0.65rem' }}>Order Summary</div>
            <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.02em' }}>
              #{ORDER_NUM}
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: '1.125rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ITEMS.map(it => (
              <div key={it.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={`https://images.unsplash.com/${it.img}?w=80&h=80&fit=crop&auto=format`}
                    alt={it.title}
                    width={52} height={52}
                    style={{ borderRadius: '4px', objectFit: 'cover', display: 'block', backgroundColor: 'rgba(43,35,32,0.08)' }}
                  />
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    backgroundColor: C.charcoal, color: '#fff',
                    borderRadius: '50%', width: '18px', height: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: UI, fontSize: '0.55rem', fontWeight: 700,
                  }}>{it.qty}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {it.title}
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)', marginTop: '2px' }}>{it.variant}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontFamily: UI, fontSize: '0.825rem', fontWeight: 600, color: C.charcoal }}>{cad(it.cadPrice * it.qty)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid rgba(43,35,32,0.1)`, display: 'flex', flexDirection: 'column', gap: '0.575rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.58)' }}>Subtotal</span>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: C.charcoal }}>{cad(subtotalCad)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.58)' }}>Shipping ({SHIPPING.label})</span>
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: C.teal, fontWeight: 600 }}>Free</span>
            </div>
            <div style={{ borderTop: `1px solid rgba(43,35,32,0.1)`, paddingTop: '0.6rem', marginTop: '0.15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: UI, fontWeight: 700, fontSize: '0.95rem', color: C.charcoal }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.charcoal, fontWeight: 600 }}>{cad(totalCad)}</div>
              </div>
            </div>
          </div>

          {/* Two-column: Shipping address + Delivery estimate */}
          <div className="rg-2" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderTop: `1px solid rgba(43,35,32,0.1)`,
          }}>
            {/* Ship to */}
            <div style={{ padding: '1rem 1.5rem', borderRight: `1px solid rgba(43,35,32,0.1)` }}>
              <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', marginBottom: '0.55rem' }}>Ship to</div>
              <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.2rem' }}>{ADDRESS.name}</div>
              <div style={{ fontFamily: UI, fontSize: '0.77rem', color: 'rgba(43,35,32,0.58)', lineHeight: 1.65 }}>
                {ADDRESS.line1}<br />
                {ADDRESS.city}, {ADDRESS.state} {ADDRESS.postal}<br />
                {ADDRESS.country}
              </div>
            </div>

            {/* Estimated delivery */}
            <div style={{ padding: '1rem 1.5rem' }}>
              <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', marginBottom: '0.55rem' }}>Estimated delivery</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal }}>
                  {SHIPPING.days}
                </span>
              </div>
              <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55 }}>
                Standard shipping to Nigeria. We'll email you a tracking number once dispatched.
              </div>
            </div>
          </div>
        </div>

        {/* ── Action buttons ─────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '2.5rem' }}>
          <Link
            to="/account/orders"
            style={{
              flex: 1, display: 'block', textAlign: 'center',
              padding: '0.95rem 1.5rem',
              backgroundColor: C.gold, color: C.charcoal,
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecorationLine: 'none', borderRadius: '5px',
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
            style={{
              flex: 1, display: 'block', textAlign: 'center',
              padding: '0.95rem 1.5rem',
              backgroundColor: 'transparent', color: C.maroon,
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecorationLine: 'none', borderRadius: '5px',
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
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
          paddingTop: '1.5rem', borderTop: `1px solid rgba(43,35,32,0.08)`,
        }}>
          {TRUST.map(t => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
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
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.45)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} AdeClassics. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Returns'].map(lnk => (
              <a key={lnk} href="#" style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.5)', textDecorationLine: 'none', letterSpacing: '0.04em' }}
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
