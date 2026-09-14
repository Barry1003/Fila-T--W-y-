'use client';

import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import type { CurrentUser } from '@/server/auth';
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
    <span
      className="py-[0.22rem] px-[0.65rem] rounded-full whitespace-nowrap shrink-0"
      style={{ ...label, fontSize: '0.58rem', letterSpacing: '0.1em', backgroundColor: s.bg, color: s.color, border: s.border }}
    >
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
    <div className="flex items-baseline justify-between mb-[1.1rem]">
      <h2 className="uppercase" style={{ fontFamily: UI, fontSize: '0.72rem', fontWeight: 700, color: C.charcoal, letterSpacing: '0.12em' }}>
        {title}
      </h2>
      <Link to={linkTo} className="no-underline" style={{ fontFamily: UI, fontSize: '0.78rem', color: C.indigo, letterSpacing: '0.01em' }}>
        {linkLabel} →
      </Link>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Account({ user }: { user: CurrentUser | null }) {
  return (
    <AccountShell user={user}>
      <div className="flex flex-col gap-10">

        {/* ── Greeting ─────────────────────────────────────── */}
        <div>
          <h1 className="mb-[0.4rem]" style={{ fontFamily: DISPLAY, fontSize: '2.1rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.015em', lineHeight: 1.1 }}>
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
          </h1>
          <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.6 }}>
            Here's an overview of your orders and saved items.
          </p>
        </div>

        {/* ── Stat tiles ──────────────────────────────────── */}
        <div className="rg-3 grid grid-cols-3 gap-4">
          {STATS.map(s => (
            <div
              key={s.label}
              className="rounded-lg py-[1.4rem] px-6 flex flex-col gap-3"
              style={{
                backgroundColor: '#fff',
                border: `1px solid rgba(43,35,32,0.09)`,
                boxShadow: '0 1px 8px rgba(43,35,32,0.045)',
              }}
            >
              <div className="flex items-center justify-between">
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
          <div className="flex flex-col gap-[0.6rem]">
            {RECENT.map(order => (
              <div
                key={order.id}
                className="rounded-lg py-4 px-5 flex items-center gap-4"
                style={{
                  backgroundColor: '#fff',
                  border: `1px solid rgba(43,35,32,0.09)`,
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 14px rgba(43,35,32,0.09)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <img
                  src={`https://images.unsplash.com/${order.img}?w=80&h=80&fit=crop&auto=format`}
                  alt=""
                  width={44} height={44}
                  className="rounded-[5px] object-cover shrink-0"
                  style={{ backgroundColor: 'rgba(43,35,32,0.06)' }}
                />
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: UI, fontSize: '0.82rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.3 }}>
                    {order.title}
                  </div>
                  <div className="mt-[2px]" style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.44)', letterSpacing: '0.01em' }}>
                    #{order.id} · {order.date}
                  </div>
                </div>
                <StatusBadge status={order.status} />
                <div className="min-w-[80px] text-right shrink-0" style={{ fontFamily: UI, fontSize: '0.84rem', fontWeight: 500, color: C.charcoal }}>
                  {order.total}
                </div>
                <Link
                  to="/account/orders"
                  className="no-underline shrink-0 whitespace-nowrap"
                  style={{ fontFamily: UI, fontSize: '0.72rem', color: C.indigo, letterSpacing: '0.01em' }}
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
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {WISHLIST_PREVIEW.map(item => (
              <div
                key={item.id}
                className="shrink-0 w-[168px] rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#fff',
                  border: `1px solid rgba(43,35,32,0.09)`,
                  boxShadow: '0 1px 6px rgba(43,35,32,0.04)',
                }}
              >
                <div className="relative pt-[100%] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${item.img}?w=340&h=340&fit=crop&auto=format`}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="mb-[0.35rem] line-clamp-2" style={{ fontFamily: UI, fontSize: '0.75rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.35 }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.78rem', fontWeight: 600, color: C.charcoal }}>
                    CAD ${item.cadNum}
                  </div>
                  <Link
                    to="/account/wishlist"
                    className="block mt-[0.6rem] text-center py-[0.45rem] rounded-[4px] uppercase no-underline"
                    style={{
                      fontFamily: UI, fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.1em',
                      backgroundColor: C.gold, color: C.charcoal,
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
          className="rounded-[10px] overflow-hidden relative flex items-center gap-8 py-8 px-10"
          style={{ background: `linear-gradient(135deg, ${C.maroon} 0%, #5A1E25 100%)` }}
        >
          {/* Decorative circle */}
          <div className="absolute right-12 -top-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(212,169,78,0.08)' }} />
          <div className="absolute right-24 -bottom-12 w-[100px] h-[100px] rounded-full pointer-events-none" style={{ background: 'rgba(212,169,78,0.06)' }} />

          <div className="flex-1 relative">
            <div className="mb-2" style={{ ...label, fontSize: '0.58rem', color: C.gold, letterSpacing: '0.2em' }}>
              Limited Time Offer
            </div>
            <h3 className="mb-[0.6rem]" style={{ fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 500, color: C.cream, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              Custom Made,<br />Just for You
            </h3>
            <p className="max-w-[340px]" style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(250,246,240,0.65)', lineHeight: 1.65 }}>
              Order a bespoke filà, agbada, or kaftan tailored to your measurements and fabric preference.
            </p>
          </div>
          <div className="shrink-0 relative">
            <Link
              to="/shop"
              className="inline-block no-underline uppercase whitespace-nowrap py-[0.85rem] px-7 rounded-[5px]"
              style={{
                fontFamily: UI, fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.12em',
                backgroundColor: C.gold, color: C.charcoal,
                boxShadow: '0 2px 12px rgba(212,169,78,0.4)',
                transition: 'box-shadow 0.2s, transform 0.15s',
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
