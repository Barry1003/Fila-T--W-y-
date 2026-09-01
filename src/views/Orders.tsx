'use client';

import { useState } from 'react';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Types ───────────────────────────────────────────────── */
type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type TimelineStep = {
  key: string;
  label: string;
  date?: string;
  state: 'done' | 'active' | 'upcoming';
};

type OrderItem = {
  img: string;
  title: string;
  variant: string;
  qty: number;
  cad: number;
  ngn: number;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  cadTotal: number;
  ngnTotal: number;
  address: string;
  tracking?: string;
  timeline: TimelineStep[];
};

/* ─── Seed data ───────────────────────────────────────────── */
const ORDERS: Order[] = [
  {
    id: 'FTW-2024-0847',
    date: 'Dec 14, 2024',
    status: 'shipped',
    cadTotal: 399,
    ngnTotal: 198100,
    address: 'Adunola Okonkwo · 12 Maple Grove, Toronto, ON M4C 2K1, Canada',
    tracking: 'CA-9400111202130193',
    items: [
      { img: 'photo-1765910083971-aa0e3688be46', title: 'Embroidered Agbada Kaftan', variant: 'Gold · Size L', qty: 1, cad: 310, ngn: 153950 },
      { img: 'photo-1760086626077-55da1cb1ecb3', title: 'Ọjọ Ipele — Crimson Drape', variant: 'Crimson · One Size', qty: 1, cad: 78, ngn: 38750 },
    ],
    timeline: [
      { key: 'placed', label: 'Placed', date: 'Dec 14', state: 'done' },
      { key: 'confirmed', label: 'Confirmed', date: 'Dec 15', state: 'done' },
      { key: 'shipped', label: 'Shipped', date: 'Dec 17', state: 'active' },
      { key: 'out', label: 'Out for Delivery', state: 'upcoming' },
      { key: 'delivered', label: 'Delivered', state: 'upcoming' },
    ],
  },
  {
    id: 'FTW-2024-0821',
    date: 'Nov 28, 2024',
    status: 'delivered',
    cadTotal: 554,
    ngnTotal: 275100,
    address: 'Adunola Okonkwo · 12 Maple Grove, Toronto, ON M4C 2K1, Canada',
    tracking: 'CA-9400111201000012',
    items: [
      { img: 'photo-1763823133159-c6f8ec380e33', title: 'Gobi Filà Cap — Burgundy Velvet', variant: 'Burgundy · Size M', qty: 2, cad: 89, ngn: 44200 },
      { img: 'photo-1714124731489-7eb16af0ac91', title: 'Aso-oke Gele — Ivory & Gold Set', variant: 'Ivory & Gold · One Size', qty: 1, cad: 145, ngn: 71900 },
      { img: 'photo-1661332360810-28aa035f14db', title: 'Tailored Yoruba Trouser Set', variant: 'Ivory · Size 32', qty: 1, cad: 195, ngn: 96850 },
    ],
    timeline: [
      { key: 'placed', label: 'Placed', date: 'Nov 28', state: 'done' },
      { key: 'confirmed', label: 'Confirmed', date: 'Nov 29', state: 'done' },
      { key: 'shipped', label: 'Shipped', date: 'Dec 1', state: 'done' },
      { key: 'out', label: 'Out for Delivery', date: 'Dec 5', state: 'done' },
      { key: 'delivered', label: 'Delivered', date: 'Dec 6', state: 'done' },
    ],
  },
  {
    id: 'FTW-2024-0803',
    date: 'Nov 9, 2024',
    status: 'processing',
    cadTotal: 310,
    ngnTotal: 153950,
    address: 'Adunola Okonkwo · 12 Maple Grove, Toronto, ON M4C 2K1, Canada',
    items: [
      { img: 'photo-1765910083971-aa0e3688be46', title: 'Embroidered Agbada Kaftan', variant: 'Maroon · Size XL — Custom', qty: 1, cad: 310, ngn: 153950 },
    ],
    timeline: [
      { key: 'placed', label: 'Placed', date: 'Nov 9', state: 'done' },
      { key: 'confirmed', label: 'Confirmed', date: 'Nov 10', state: 'active' },
      { key: 'shipped', label: 'Shipped', state: 'upcoming' },
      { key: 'out', label: 'Out for Delivery', state: 'upcoming' },
      { key: 'delivered', label: 'Delivered', state: 'upcoming' },
    ],
  },
  {
    id: 'FTW-2024-0788',
    date: 'Oct 23, 2024',
    status: 'delivered',
    cadTotal: 267,
    ngnTotal: 132700,
    address: 'Adunola Okonkwo · 12 Maple Grove, Toronto, ON M4C 2K1, Canada',
    tracking: 'CA-9400111200887755',
    items: [
      { img: 'photo-1632948056627-41482f69c38c', title: 'Adire Roundneck — Indigo', variant: 'Indigo · Size M', qty: 1, cad: 125, ngn: 62000 },
      { img: 'photo-1646133512747-babfd708d662', title: 'Hand-tooled Pam Slippers', variant: 'Tan · Size 42', qty: 1, cad: 160, ngn: 79500 },
    ],
    timeline: [
      { key: 'placed', label: 'Placed', date: 'Oct 23', state: 'done' },
      { key: 'confirmed', label: 'Confirmed', date: 'Oct 24', state: 'done' },
      { key: 'shipped', label: 'Shipped', date: 'Oct 26', state: 'done' },
      { key: 'out', label: 'Out for Delivery', date: 'Oct 30', state: 'done' },
      { key: 'delivered', label: 'Delivered', date: 'Oct 31', state: 'done' },
    ],
  },
  {
    id: 'FTW-2024-0765',
    date: 'Oct 2, 2024',
    status: 'cancelled',
    cadTotal: 89,
    ngnTotal: 44200,
    address: 'Adunola Okonkwo · 12 Maple Grove, Toronto, ON M4C 2K1, Canada',
    items: [
      { img: 'photo-1763823133159-c6f8ec380e33', title: 'Gobi Filà Cap — Burgundy Velvet', variant: 'Navy · Size S', qty: 1, cad: 89, ngn: 44200 },
    ],
    timeline: [
      { key: 'placed', label: 'Placed', date: 'Oct 2', state: 'done' },
      { key: 'confirmed', label: 'Confirmed', state: 'upcoming' },
      { key: 'shipped', label: 'Shipped', state: 'upcoming' },
      { key: 'out', label: 'Out for Delivery', state: 'upcoming' },
      { key: 'delivered', label: 'Delivered', state: 'upcoming' },
    ],
  },
];

type FilterTab = 'all' | OrderStatus;
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function fmtCad(n: number) {
  return 'CAD ' + new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
}
function fmtNgn(n: number) {
  return '₦' + new Intl.NumberFormat('en-NG').format(n);
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  placed:     { label: 'Placed',     color: C.charcoal,              bg: 'rgba(43,35,32,0.06)',  border: 'rgba(43,35,32,0.22)' },
  processing: { label: 'Processing', color: C.indigo,                bg: 'rgba(46,74,158,0.08)', border: 'rgba(46,74,158,0.28)' },
  shipped:    { label: 'Shipped',    color: '#8a6c1a',               bg: 'rgba(212,169,78,0.12)', border: 'rgba(212,169,78,0.45)' },
  delivered:  { label: 'Delivered',  color: C.teal,                  bg: 'rgba(59,138,147,0.08)', border: 'rgba(59,138,147,0.3)' },
  cancelled:  { label: 'Cancelled',  color: '#b94a48',               bg: 'rgba(185,74,72,0.07)', border: 'rgba(185,74,72,0.28)' },
};

/* ─── StatusBadge ─────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_CONFIG[status];
  return (
    <span style={{
      ...label, fontSize: '0.6rem', letterSpacing: '0.1em',
      color: s.color, backgroundColor: s.bg,
      borderWidth: '1px', borderStyle: 'solid', borderColor: s.border,
      borderRadius: '4px', padding: '0.25rem 0.6rem',
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─── Timeline ────────────────────────────────────────────── */
function OrderTimeline({ steps, cancelled }: { steps: TimelineStep[]; cancelled: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {steps.map((step, i) => {
        const isDone = !cancelled && step.state === 'done';
        const isActive = !cancelled && step.state === 'active';
        const dotColor = isDone ? C.teal : isActive ? C.gold : 'rgba(43,35,32,0.18)';
        const lineColor = isDone ? C.teal : 'rgba(43,35,32,0.12)';
        return (
          <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', flex: i < steps.length - 1 ? 1 : 0, minWidth: '80px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: dotColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: isActive ? `0 0 0 3px rgba(212,169,78,0.22)` : 'none',
              }}>
                {isDone && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.charcoal }} />}
              </div>
              <div style={{ fontFamily: UI, fontSize: '0.65rem', color: isDone || isActive ? C.charcoal : 'rgba(43,35,32,0.38)', fontWeight: isActive ? 600 : 400, textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
                {step.label}
              </div>
              {step.date && (
                <div style={{ fontFamily: UI, fontSize: '0.58rem', color: 'rgba(43,35,32,0.4)', textAlign: 'center' }}>
                  {step.date}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', backgroundColor: lineColor, marginTop: '8px', marginLeft: '0', minWidth: '20px' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Order card ──────────────────────────────────────────── */
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const THUMB_SHOW = 3;
  const extra = order.items.length - THUMB_SHOW;

  function copyTracking() {
    if (order.tracking) {
      navigator.clipboard.writeText(order.tracking).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '10px',
      border: `1px solid rgba(43,35,32,0.1)`,
      boxShadow: '0 1px 10px rgba(43,35,32,0.05)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}>
      {/* ── Card header ─────────────────────────────── */}
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
            Order · {order.date}
          </div>
          <div style={{ fontFamily: UI, fontSize: '0.92rem', fontWeight: 700, color: C.charcoal, letterSpacing: '0.01em' }}>
            #{order.id}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Divider ──────────────────────────────────── */}
      <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.07)', margin: '0 1.5rem' }} />

      {/* ── Thumbnails + total ────────────────────────── */}
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Stacked thumbnails */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flexShrink: 0 }}>
          {order.items.slice(0, THUMB_SHOW).map((item, i) => (
            <div
              key={i}
              style={{
                marginLeft: i === 0 ? 0 : '-10px',
                zIndex: THUMB_SHOW - i,
                position: 'relative',
                borderRadius: '6px',
                border: '2px solid #fff',
                overflow: 'hidden',
                width: '46px', height: '46px',
                backgroundColor: 'rgba(43,35,32,0.07)',
                flexShrink: 0,
              }}
            >
              <img
                src={`https://images.unsplash.com/${item.img}?w=60&h=60&fit=crop&auto=format`}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
          {extra > 0 && (
            <div style={{
              marginLeft: '-10px', zIndex: 0,
              width: '46px', height: '46px', borderRadius: '6px',
              border: '2px solid #fff',
              backgroundColor: 'rgba(43,35,32,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: UI, fontSize: '0.65rem', fontWeight: 700, color: C.charcoal }}>+{extra}</span>
            </div>
          )}
        </div>

        {/* Item count */}
        <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)' }}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </div>

        {/* Total */}
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 700, color: C.charcoal }}>{fmtCad(order.cadTotal)}</div>
          <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.42)', marginTop: '2px' }}>{fmtNgn(order.ngnTotal)}</div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              fontFamily: UI, fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.05em', color: C.maroon,
              backgroundColor: 'transparent',
              borderWidth: '1.5px', borderStyle: 'solid', borderColor: C.maroon,
              borderRadius: '5px', padding: '0.5rem 0.875rem',
              cursor: 'pointer', transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(122,46,56,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
          {order.status === 'shipped' && (
            <button
              style={{
                fontFamily: UI, fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.08em', color: C.charcoal,
                backgroundColor: C.gold,
                border: 'none', borderRadius: '5px',
                padding: '0.5rem 0.875rem', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(212,169,78,0.35)',
                transition: 'box-shadow 0.15s, transform 0.1s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 18px rgba(212,169,78,0.5)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px rgba(212,169,78,0.35)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
            >
              Track Package
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded detail ───────────────────────────── */}
      {expanded && (
        <div style={{ borderTop: `1px solid rgba(43,35,32,0.08)`, backgroundColor: 'rgba(250,246,240,0.55)' }}>
          <div className="rg-split" style={{ padding: '1.75rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem' }}>

            {/* LEFT — items + timeline */}
            <div>
              {/* Item list */}
              <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.12em', marginBottom: '1rem' }}>Items in This Order</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.75rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <img
                      src={`https://images.unsplash.com/${item.img}?w=80&h=80&fit=crop&auto=format`}
                      alt={item.title}
                      style={{ width: '56px', height: '56px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0, backgroundColor: 'rgba(43,35,32,0.07)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: UI, fontSize: '0.84rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.3 }}>{item.title}</div>
                      <div style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.5)', marginTop: '3px' }}>{item.variant}</div>
                      <div style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.45)', marginTop: '2px' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: UI, fontSize: '0.84rem', fontWeight: 600, color: C.charcoal }}>{fmtCad(item.cad * item.qty)}</div>
                      <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.42)', marginTop: '2px' }}>{fmtNgn(item.ngn * item.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Delivery Status</div>
              <OrderTimeline steps={order.timeline} cancelled={order.status === 'cancelled'} />
            </div>

            {/* RIGHT — shipping + tracking */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Shipping address */}
              <div>
                <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>Shipped To</div>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '0.875rem 1rem', border: `1px solid rgba(43,35,32,0.1)`, fontFamily: UI, fontSize: '0.8rem', color: C.charcoal, lineHeight: 1.6 }}>
                  {order.address}
                </div>
              </div>

              {/* Tracking number */}
              {order.tracking && (
                <div>
                  <div style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.12em', marginBottom: '0.6rem' }}>Tracking Number</div>
                  <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '0.875rem 1rem', border: `1px solid rgba(43,35,32,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: C.charcoal, letterSpacing: '0.03em', wordBreak: 'break-all' }}>{order.tracking}</span>
                    <button
                      onClick={copyTracking}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0, color: copied ? C.teal : 'rgba(43,35,32,0.45)', transition: 'color 0.2s' }}
                      title="Copy tracking number"
                    >
                      {copied ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p style={{ fontFamily: UI, fontSize: '0.7rem', color: C.teal, marginTop: '0.35rem' }}>Copied to clipboard</p>
                  )}
                </div>
              )}

              {/* Support link */}
              <a href="#" style={{ fontFamily: UI, fontSize: '0.78rem', color: C.indigo, textDecorationLine: 'none', letterSpacing: '0.01em', borderBottom: `1px solid rgba(46,74,158,0.25)`, paddingBottom: '1px', width: 'fit-content' }}>
                Need help with this order?
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Orders() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filtered = activeFilter === 'all'
    ? ORDERS
    : ORDERS.filter(o => o.status === activeFilter);

  return (
    <AccountShell>
      <style>{`
        .order-detail-grid { grid-template-columns: 1fr 300px; }
        @media (max-width: 860px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page heading ──────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Your Orders
        </h1>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid rgba(43,35,32,0.12)` }}>
          {FILTER_TABS.map(tab => {
            const isActive = activeFilter === tab.key;
            const count = tab.key === 'all' ? ORDERS.length : ORDERS.filter(o => o.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: UI, fontSize: '0.72rem', fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isActive ? C.charcoal : 'rgba(43,35,32,0.45)',
                  padding: '0.75rem 1.25rem 0.75rem',
                  borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'color 0.15s, border-color 0.15s',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span style={{
                    fontFamily: UI, fontSize: '0.58rem', fontWeight: 700,
                    backgroundColor: isActive ? C.gold : 'rgba(43,35,32,0.1)',
                    color: isActive ? C.charcoal : 'rgba(43,35,32,0.5)',
                    borderRadius: '10px', padding: '1px 6px', lineHeight: '1.6',
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Order list / empty state ────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.25rem', opacity: 0.25 }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <p style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal, fontWeight: 500, marginBottom: '0.5rem' }}>
            No orders here yet
          </p>
          <p style={{ fontFamily: UI, fontSize: '0.84rem', color: 'rgba(43,35,32,0.5)', marginBottom: '1.75rem' }}>
            {activeFilter === 'all' ? "You haven't placed an order yet." : `No ${activeFilter} orders found.`}
          </p>
          <a
            href="/shop"
            style={{
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.charcoal, backgroundColor: C.gold,
              textDecorationLine: 'none', borderRadius: '5px',
              padding: '0.75rem 1.75rem',
              boxShadow: '0 2px 12px rgba(212,169,78,0.35)',
              transition: 'box-shadow 0.15s',
            }}
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
