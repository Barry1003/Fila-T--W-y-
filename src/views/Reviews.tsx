'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Mock data ─────────────────────────────────────────────── */

type Review = {
  id: string;
  product: string;
  productId: string;
  thumbnail: string;
  rating: number;
  date: string;
  body: string;
  photos?: string[];
};

type Pending = {
  id: string;
  product: string;
  productId: string;
  thumbnail: string;
  deliveredOn: string;
  orderId: string;
};

const REVIEWS: Review[] = [
  {
    id: 'r1',
    product: 'Ìgbàgbọ́ Woven Tote',
    productId: '1',
    thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    date: 'August 12, 2026',
    body: "Absolutely stunning craftsmanship. The weave is tight and the colours are even more vibrant in person than on screen. I've carried it daily for three weeks and it still looks pristine. The shoulder strap is well-padded and the interior is deeper than it looks — fits my A4 notebook, water bottle, and daily essentials with room to spare.",
    photos: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=64&h=64&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=64&h=64&fit=crop&auto=format',
    ],
  },
  {
    id: 'r2',
    product: 'Odòdó Linen Blouse',
    productId: '2',
    thumbnail: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=80&h=80&fit=crop&auto=format',
    rating: 4,
    date: 'July 3, 2026',
    body: "Beautiful piece. The embroidery detail around the collar is intricate and clearly hand-finished. I sized up as recommended and the fit was perfect. Linen does wrinkle a little after a full day, but honestly it just adds character. Knocked one star only because the sleeve buttons are a touch stiff — they'll loosen with wear.",
  },
  {
    id: 'r3',
    product: 'Àṣà Raffia Sandals',
    productId: '3',
    thumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    date: 'May 22, 2026',
    body: "My favourite purchase of the year. Comfortable straight out of the box, no break-in period, and they go with everything from linen to denim. The raffia weave on the strap is genuinely beautiful and holds its shape well even after beach outings.",
  },
];

const PENDING: Pending[] = [
  {
    id: 'p1',
    product: 'Ewé Indigo Block-Print Shirt',
    productId: '4',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop&auto=format',
    deliveredOn: 'August 28, 2026',
    orderId: 'FTW-2025-0847',
  },
  {
    id: 'p2',
    product: 'Ìrántí Leather Card Wallet',
    productId: '5',
    thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=80&h=80&fit=crop&auto=format',
    deliveredOn: 'August 19, 2026',
    orderId: 'FTW-2025-0821',
  },
];

/* ─── Star display ───────────────────────────────────────────── */
function StarDisplay({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', lineHeight: 0 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < rating ? C.gold : 'none'}
          stroke={i < rating ? C.gold : 'rgba(43,35,32,0.22)'}
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Star picker ────────────────────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: 'inline-flex', gap: '3px', lineHeight: 0, cursor: 'pointer' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hovered || value);
        return (
          <svg key={i} width="20" height="20" viewBox="0 0 24 24"
            fill={filled ? C.gold : 'none'}
            stroke={filled ? C.gold : 'rgba(43,35,32,0.3)'}
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'fill 0.1s, stroke 0.1s' }}
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i + 1)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </span>
  );
}

/* ─── Review card ────────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '10px',
      border: '1px solid rgba(43,35,32,0.08)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {/* Product row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        <Link to={`/product/${review.productId}`} style={{ flexShrink: 0 }}>
          <img src={review.thumbnail} alt={review.product} width={52} height={52}
            style={{ borderRadius: '6px', objectFit: 'cover', display: 'block' }} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/product/${review.productId}`}
            style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, textDecorationLine: 'none', display: 'block', marginBottom: '0.3rem' }}>
            {review.product}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <StarDisplay rating={review.rating} />
            <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.38)', letterSpacing: '0.02em' }}>
              {review.date}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.125rem', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
          <button style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: UI, fontSize: '0.8rem', color: C.indigo, cursor: 'pointer',
            textDecorationLine: 'underline', textDecorationColor: 'rgba(46,74,158,0.3)', textUnderlineOffset: '2px',
          }}>
            Edit
          </button>
          <button onClick={() => setDeleted(true)} style={{
            background: 'none', border: 'none', padding: 0,
            fontFamily: UI, fontSize: '0.8rem', color: 'rgba(185,74,72,0.7)', cursor: 'pointer',
            textDecorationLine: 'underline', textDecorationColor: 'rgba(185,74,72,0.25)', textUnderlineOffset: '2px',
          }}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.06)' }} />

      <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.72)', lineHeight: 1.75, margin: 0 }}>
        {review.body}
      </p>

      {review.photos && review.photos.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {review.photos.map((src, i) => (
            <img key={i} src={src} alt={`Review photo ${i + 1}`} width={60} height={60}
              style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(43,35,32,0.1)', cursor: 'zoom-in' }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Pending card ───────────────────────────────────────────── */
function PendingCard({ item }: { item: Pending }) {
  const [rating, setRating] = useState(0);
  const [writing, setWriting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState('');

  if (submitted) {
    return (
      <div style={{
        backgroundColor: '#fff', borderRadius: '10px', border: '1px solid rgba(43,35,32,0.08)',
        padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <span style={{ color: C.teal, lineHeight: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span style={{ fontFamily: UI, fontSize: '0.875rem', color: C.teal, fontWeight: 500 }}>
          Review submitted for{' '}
          <span style={{ color: C.charcoal, fontWeight: 600 }}>{item.product}</span>
          {' '}— thank you!
        </span>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '10px', border: '1px solid rgba(43,35,32,0.08)',
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: writing ? '1.125rem' : '0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
        <Link to={`/product/${item.productId}`} style={{ flexShrink: 0 }}>
          <img src={item.thumbnail} alt={item.product} width={52} height={52}
            style={{ borderRadius: '6px', objectFit: 'cover', display: 'block' }} />
        </Link>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <Link to={`/product/${item.productId}`}
            style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, textDecorationLine: 'none', display: 'block', marginBottom: '0.25rem' }}>
            {item.product}
          </Link>
          <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.42)' }}>
              Delivered {item.deliveredOn}
            </span>
            <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.26)' }}>
              · {item.orderId}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <StarPicker value={rating} onChange={n => { setRating(n); if (!writing) setWriting(true); }} />
          <button
            onClick={() => setWriting(true)}
            style={{
              fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em',
              color: '#fff', backgroundColor: C.gold, border: 'none', borderRadius: '5px',
              padding: '0.5rem 1.125rem', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Write a Review
          </button>
        </div>
      </div>

      {writing && (
        <>
          <div style={{ height: '1px', backgroundColor: 'rgba(43,35,32,0.06)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <div style={{ ...label, fontSize: '0.63rem', color: 'rgba(43,35,32,0.4)', marginBottom: '0.5rem' }}>Your Rating</div>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <div style={{ ...label, fontSize: '0.63rem', color: 'rgba(43,35,32,0.4)', marginBottom: '0.5rem' }}>Your Review</div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Share your honest thoughts — quality, fit, how it wore over time…"
                rows={4}
                style={{
                  width: '100%', fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
                  backgroundColor: C.cream, border: '1px solid rgba(43,35,32,0.14)',
                  borderRadius: '6px', padding: '0.75rem 1rem', resize: 'vertical',
                  lineHeight: 1.65, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(43,35,32,0.32)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(43,35,32,0.14)')}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setWriting(false)}
                style={{
                  fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)',
                  background: 'none', border: '1px solid rgba(43,35,32,0.18)',
                  borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { if (rating > 0 && draft.trim()) setSubmitted(true); }}
                disabled={rating === 0 || !draft.trim()}
                style={{
                  fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.03em',
                  color: '#fff',
                  backgroundColor: rating > 0 && draft.trim() ? C.gold : 'rgba(43,35,32,0.16)',
                  border: 'none', borderRadius: '5px', padding: '0.5rem 1.25rem',
                  cursor: rating > 0 && draft.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
type Tab = 'reviews' | 'pending';

export default function Reviews() {
  const [activeTab, setActiveTab] = useState<Tab>('reviews');

  const tabBtn = (t: Tab, children: React.ReactNode): React.CSSProperties => ({
    fontFamily: UI,
    fontSize: '0.8rem',
    fontWeight: activeTab === t ? 600 : 400,
    color: activeTab === t ? C.charcoal : 'rgba(43,35,32,0.48)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === t ? `2px solid ${C.gold}` : '2px solid transparent',
    paddingBottom: '0.625rem',
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: '2rem',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  });

  return (
    <AccountShell>
      <div>
        {/* Page title */}
        <h1 style={{
          fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal,
          letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 1.5rem',
        }}>
          Your Reviews
        </h1>

        {/* Tab row */}
        <div style={{ borderBottom: '1px solid rgba(43,35,32,0.1)', marginBottom: '2rem', display: 'flex' }}>
          <button style={tabBtn('reviews', null)} onClick={() => setActiveTab('reviews')}>
            Reviews
          </button>
          <button style={tabBtn('pending', null)} onClick={() => setActiveTab('pending')}>
            Pending Reviews
            {PENDING.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '17px', height: '17px', borderRadius: '50%',
                backgroundColor: activeTab === 'pending' ? C.maroon : 'rgba(43,35,32,0.14)',
                color: activeTab === 'pending' ? '#fff' : 'rgba(43,35,32,0.5)',
                fontFamily: UI, fontSize: '0.6rem', fontWeight: 700, letterSpacing: 0,
                transition: 'background-color 0.15s, color 0.15s',
              }}>
                {PENDING.length}
              </span>
            )}
          </button>
        </div>

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          REVIEWS.length === 0 ? (
            <div style={{
              backgroundColor: '#fff', borderRadius: '10px', border: '1px solid rgba(43,35,32,0.08)',
              padding: '3.5rem 2rem', textAlign: 'center',
            }}>
              <div style={{ marginBottom: '1rem', color: 'rgba(43,35,32,0.18)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <p style={{ fontFamily: DISPLAY, fontSize: '1.125rem', color: C.charcoal, fontWeight: 400, margin: '0 0 0.5rem' }}>
                You haven't written any reviews yet
              </p>
              <p style={{ fontFamily: UI, fontSize: '0.85rem', color: 'rgba(43,35,32,0.45)', lineHeight: 1.6, margin: 0 }}>
                Once you've received an order, you can{' '}
                <button onClick={() => setActiveTab('pending')} style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontFamily: UI, fontSize: '0.85rem', color: C.indigo,
                  textDecorationLine: 'underline', textDecorationColor: 'rgba(46,74,158,0.35)', textUnderlineOffset: '2px',
                }}>
                  write your first review
                </button>{' '}
                from the Pending tab.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )
        )}

        {/* Pending tab */}
        {activeTab === 'pending' && (
          PENDING.length === 0 ? (
            <div style={{
              backgroundColor: '#fff', borderRadius: '10px', border: '1px solid rgba(43,35,32,0.08)',
              padding: '3.5rem 2rem', textAlign: 'center',
            }}>
              <div style={{ marginBottom: '1rem', color: 'rgba(43,35,32,0.18)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontFamily: DISPLAY, fontSize: '1.125rem', color: C.charcoal, fontWeight: 400, margin: 0 }}>
                You're all caught up — no pending reviews
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: UI, fontSize: '0.85rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.6, marginTop: 0, marginBottom: '1.25rem' }}>
                These items were recently delivered and are waiting for your review.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {PENDING.map(p => <PendingCard key={p.id} item={p} />)}
              </div>
            </>
          )
        )}
      </div>
    </AccountShell>
  );
}
