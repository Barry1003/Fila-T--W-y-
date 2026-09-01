'use client';

import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Stat tiles ────────────────────────────────────────────── */
const STATS = [
  {
    value: '2',
    label: 'Active Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    accent: C.maroon,
  },
  {
    value: '6',
    label: 'Wishlist Items',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    accent: C.teal,
  },
  {
    value: '5',
    label: 'Total Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    accent: C.gold,
  },
];

/* ─── Status badge ─────────────────────────────────────────── */
type Status = 'Shipped' | 'Delivered' | 'Confirmed' | 'Processing' | 'Placed' | 'Cancelled';

const STATUS_STYLE: Record<Status, { bg: string; color: string; border: string }> = {
  Shipped:    { bg: 'rgba(212,169,78,0.12)',  color: '#8A6400',               border: '1px solid rgba(212,169,78,0.4)' },
  Delivered:  { bg: 'transparent',            color: 'rgba(43,35,32,0.55)',   border: '1px solid rgba(43,35,32,0.24)' },
  Confirmed:  { bg: 'rgba(59,138,147,0.1)',   color: C.teal,                  border: '1px solid rgba(59,138,147,0.32)' },
  Processing: { bg: 'rgba(59,138,147,0.1)',   color: C.teal,                  border: '1px solid rgba(59,138,147,0.32)' },
  Placed:     { bg: 'rgba(59,138,147,0.1)',   color: C.teal,                  border: '1px solid rgba(59,138,147,0.32)' },
  Cancelled:  { bg: 'rgba(185,74,72,0.09)',   color: '#b94a48',               border: '1px solid rgba(185,74,72,0.28)' },
};

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Placed;
  return (
    <span style={{
      ...label, fontSize: '0.58rem', letterSpacing: '0.1em',
      padding: '0.22rem 0.65rem', borderRadius: '100px', whiteSpace: 'nowrap',
      backgroundColor: s.bg, color: s.color, border: s.border,
      flexShrink: 0,
    }}>
      {status}
    </span>
  );
}

/* ─── Recent orders seed ────────────────────────────────────── */
const RECENT = [
  {
    id: 'FTW-2025-0847',
    title: 'Embroidered Agbada Kaftan',
    date: 'Dec 14, 2025',
    status: 'Shipped' as Status,
    total: 'CAD $399',
    img: 'photo-1765910083971-aa0e3688be46',
  },
  {
    id: 'FTW-2025-0821',
    title: 'Gobi Filà Cap — Burgundy Velvet',
    date: 'Nov 28, 2025',
    status: 'Delivered' as Status,
    total: 'CAD $89',
    img: 'photo-1763823133159-c6f8ec380e33',
  },
  {
    id: 'FTW-2025-0803',
    title: 'Aso-oke Gele — Ivory & Gold Set',
    date: 'Nov 12, 2025',
    status: 'Confirmed' as Status,
    total: 'CAD $145',
    img: 'photo-1714124731489-7eb16af0ac91',
  },
];

/* ─── Wishlist preview seed ────────────────────────────────── */
const WISHLIST_PREVIEW = [
  { id: 1, img: 'photo-1763823133159-c6f8ec380e33', title: 'Gobi Filà Cap — Burgundy Velvet', cadNum: 89 },
  { id: 2, img: 'photo-1765910083971-aa0e3688be46', title: 'Embroidered Agbada Kaftan',        cadNum: 310 },
  { id: 3, img: 'photo-1632948056627-41482f69c38c', title: 'Adire Roundneck — Indigo',         cadNum: 125 },
  { id: 4, img: 'photo-1760086626077-55da1cb1ecb3', title: 'Ọjọ Ipele — Crimson Drape',       cadNum: 78 },
];

/* ─── Section heading ──────────────────────────────────────── */
function SectionHead({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
      <h2 style={{ fontFamily: UI, fontSize: '0.72rem', fontWeight: 700, color: C.charcoal, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {title}
      </h2>
      <Link to={linkTo} style={{ fontFamily: UI, fontSize: '0.78rem', color: C.indigo, textDecorationLine: 'none', letterSpacing: '0.01em' }}>
        {linkLabel} →
      </Link>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Account() {
  return (
    <AccountShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* ── Greeting ─────────────────────────────────────── */}
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: '2.1rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.015em', lineHeight: 1.1, marginBottom: '0.4rem' }}>
            Welcome back, Adunola
          </h1>
          <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.6 }}>
            Here's an overview of your orders and saved items.
          </p>
        </div>

        {/* ── Stat tiles ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {STATS.map(s => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '1.4rem 1.5rem',
                border: `1px solid rgba(43,35,32,0.09)`,
                boxShadow: '0 1px 8px rgba(43,35,32,0.045)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ color: s.accent, opacity: 0.8 }}>{s.icon}</div>
              </div>
              <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.12em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Orders ───────────────────────────────── */}
        <div>
          <SectionHead title="Recent Orders" linkTo="/account/orders" linkLabel="View all orders" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {RECENT.map(order => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  border: `1px solid rgba(43,35,32,0.09)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 14px rgba(43,35,32,0.09)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <img
                  src={`https://images.unsplash.com/${order.img}?w=80&h=80&fit=crop&auto=format`}
                  alt=""
                  width={44} height={44}
                  style={{ borderRadius: '5px', objectFit: 'cover', flexShrink: 0, backgroundColor: 'rgba(43,35,32,0.06)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: '0.82rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.3 }}>
                    {order.title}
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.44)', marginTop: '2px', letterSpacing: '0.01em' }}>
                    #{order.id} · {order.date}
                  </div>
                </div>
                <StatusBadge status={order.status} />
                <div style={{ fontFamily: UI, fontSize: '0.84rem', fontWeight: 500, color: C.charcoal, minWidth: '80px', textAlign: 'right', flexShrink: 0 }}>
                  {order.total}
                </div>
                <Link
                  to="/account/orders"
                  style={{ fontFamily: UI, fontSize: '0.72rem', color: C.indigo, textDecorationLine: 'none', letterSpacing: '0.01em', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  Details →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Wishlist preview ─────────────────────────────── */}
        <div>
          <SectionHead title="From Your Wishlist" linkTo="/account/wishlist" linkLabel="View wishlist" />
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
            {WISHLIST_PREVIEW.map(item => (
              <div
                key={item.id}
                style={{
                  flexShrink: 0,
                  width: '168px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: `1px solid rgba(43,35,32,0.09)`,
                  overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(43,35,32,0.04)',
                }}
              >
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                  <img
                    src={`https://images.unsplash.com/${item.img}?w=340&h=340&fit=crop&auto=format`}
                    alt={item.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontFamily: UI, fontSize: '0.75rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.35, marginBottom: '0.35rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.78rem', fontWeight: 600, color: C.charcoal }}>
                    CAD ${item.cadNum}
                  </div>
                  <Link
                    to="/account/wishlist"
                    style={{
                      display: 'block', marginTop: '0.6rem', textAlign: 'center',
                      fontFamily: UI, fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.45rem 0',
                      backgroundColor: C.gold, color: C.charcoal,
                      borderRadius: '4px', textDecorationLine: 'none',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Promo card ──────────────────────────────────── */}
        <div
          style={{
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            background: `linear-gradient(135deg, ${C.maroon} 0%, #5A1E25 100%)`,
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem 2.5rem',
          }}
        >
          {/* Decorative circle */}
          <div style={{ position: 'absolute', right: '3rem', top: '-2rem', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(212,169,78,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: '6rem', bottom: '-3rem', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(212,169,78,0.06)', pointerEvents: 'none' }} />

          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ ...label, fontSize: '0.58rem', color: C.gold, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
              Limited Time Offer
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 500, color: C.cream, lineHeight: 1.15, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
              Custom Made,<br />Just for You
            </h3>
            <p style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(250,246,240,0.65)', lineHeight: 1.65, maxWidth: '340px' }}>
              Order a bespoke filà, agbada, or kaftan tailored to your measurements and fabric preference.
            </p>
          </div>
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <Link
              to="/shop"
              style={{
                display: 'inline-block',
                fontFamily: UI, fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '0.85rem 1.75rem',
                backgroundColor: C.gold, color: C.charcoal,
                borderRadius: '5px', textDecorationLine: 'none',
                boxShadow: '0 2px 12px rgba(212,169,78,0.4)',
                transition: 'box-shadow 0.2s, transform 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = '0 4px 20px rgba(212,169,78,0.55)'; el.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = '0 2px 12px rgba(212,169,78,0.4)'; el.style.transform = 'translateY(0)'; }}
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </AccountShell>
  );
}
