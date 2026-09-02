'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Seed data ───────────────────────────────────────────── */
type WishItem = {
  id: number;
  img: string;
  tag: string;
  title: string;
  cadNum: number;
  ngnNum: number;
  inStock: boolean;
};

const INITIAL_WISHLIST: WishItem[] = [
  { id: 1,  img: 'photo-1763823133159-c6f8ec380e33', tag: 'NEW',           title: 'Gobi Filà Cap — Burgundy Velvet',    cadNum: 89,  ngnNum: 44200,  inStock: true  },
  { id: 3,  img: 'photo-1765910083971-aa0e3688be46', tag: 'MADE TO ORDER', title: 'Embroidered Agbada Kaftan',           cadNum: 310, ngnNum: 153950, inStock: true  },
  { id: 6,  img: 'photo-1632948056627-41482f69c38c', tag: 'SOLD OUT',      title: 'Adire Roundneck — Indigo',            cadNum: 125, ngnNum: 62000,  inStock: false },
  { id: 4,  img: 'photo-1760086626077-55da1cb1ecb3', tag: 'NEW',           title: 'Ọjọ Ipele — Crimson Drape',          cadNum: 78,  ngnNum: 38750,  inStock: true  },
  { id: 7,  img: 'photo-1646133512747-babfd708d662', tag: 'NEW',           title: 'Hand-tooled Pam Slippers',            cadNum: 160, ngnNum: 79500,  inStock: true  },
  { id: 2,  img: 'photo-1714124731489-7eb16af0ac91', tag: 'NEW',           title: 'Aso-oke Gele — Ivory & Gold Set',     cadNum: 145, ngnNum: 71900,  inStock: true  },
];

const fmt = (n: number, prefix: string) => `${prefix}${n.toLocaleString()}`;

/* ─── Wishlist card ────────────────────────────────────────── */
function WishCard({ item, onRemove, onAddToCart }: { item: WishItem; onRemove: () => void; onAddToCart: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [heartHover, setHeartHover] = useState(false);
  const [added, setAdded] = useState(false);
  const isSoldOut = !item.inStock;

  function handleAddToCart() {
    if (isSoldOut) return;
    setAdded(true);
    onAddToCart();
    setTimeout(() => setAdded(false), 1800);
  }

  const tagColor = item.tag === 'NEW' ? C.maroon : item.tag === 'SOLD OUT' ? 'rgba(43,35,32,0.55)' : C.charcoal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div
        style={{ position: 'relative', backgroundColor: '#ddd5c8', overflow: 'hidden', aspectRatio: '3/4', marginBottom: '0.875rem' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/product/${item.id}`}>
          <img
            src={`https://images.unsplash.com/${item.img}?w=600&h=800&fit=crop&auto=format`}
            alt={item.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
              opacity: isSoldOut ? 0.72 : 1,
            }}
          />
        </Link>

        {/* Tag badge */}
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          backgroundColor: tagColor, color: C.cream,
          ...label, fontSize: '0.56rem', padding: '3px 8px', letterSpacing: '0.12em',
          pointerEvents: 'none',
        }}>
          {item.tag}
        </span>

        {/* Filled heart — remove from wishlist */}
        <button
          onClick={onRemove}
          onMouseEnter={() => setHeartHover(true)}
          onMouseLeave={() => setHeartHover(false)}
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: heartHover ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s, transform 0.15s',
            transform: heartHover ? 'scale(1.12)' : 'scale(1)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
          }}
          title="Remove from wishlist"
          aria-label="Remove from wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Sold out dim overlay */}
        {isSoldOut && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(250,246,240,0.15)', pointerEvents: 'none' }} />
        )}
      </div>

      {/* Text */}
      <Link to={`/product/${item.id}`} style={{ textDecorationLine: 'none', color: C.charcoal }}>
        <div style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.4, marginBottom: '0.45rem', color: C.charcoal }}>
          {item.title}
        </div>
      </Link>
      <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>
        {fmt(item.cadNum, 'CAD $')}
      </div>
      <div style={{ fontFamily: UI, fontSize: '0.8rem', color: C.teal, fontWeight: 500, marginTop: '0.2rem', marginBottom: '0.875rem' }}>
      </div>

      {/* CTA */}
      {isSoldOut ? (
        <button
          disabled
          style={{
            width: '100%', padding: '0.6rem 1rem',
            fontFamily: UI, fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(43,35,32,0.4)',
            backgroundColor: 'transparent',
            borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.2)',
            borderRadius: '4px', cursor: 'not-allowed',
          }}
        >
          Notify Me When Available
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%', padding: '0.6rem 1rem',
            fontFamily: UI, fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: added ? '#fff' : C.charcoal,
            backgroundColor: added ? C.teal : C.gold,
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            boxShadow: added ? 'none' : '0 2px 10px rgba(212,169,78,0.3)',
            transition: 'background 0.25s, color 0.25s, box-shadow 0.25s',
          }}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      )}

      {/* Remove link */}
      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.45rem 0 0',
          fontFamily: UI, fontSize: '0.72rem',
          color: 'rgba(43,35,32,0.38)',
          textAlign: 'left',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = C.maroon)}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.38)')}
      >
        Remove
      </button>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Wishlist() {
  const [items, setItems] = useState<WishItem[]>(INITIAL_WISHLIST);

  function removeItem(id: number) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <AccountShell>
      <style>{`
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem 1.5rem;
        }
        @media (max-width: 1100px) {
          .wishlist-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .wishlist-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Heading ───────────────────────────────────── */}
      <div style={{ marginBottom: '2.25rem' }}>
        <h1 style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1, display: 'inline' }}>
          Your Wishlist
        </h1>
        {items.length > 0 && (
          <span style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: '0.75rem' }}>
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </div>

      {/* ── Empty state ───────────────────────────────── */}
      {items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem', opacity: 0.2 }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal, fontWeight: 500, marginBottom: '0.5rem' }}>
            Your wishlist is empty
          </p>
          <p style={{ fontFamily: UI, fontSize: '0.84rem', color: 'rgba(43,35,32,0.5)', marginBottom: '1.75rem', maxWidth: '300px', lineHeight: 1.6 }}>
            Save items you love for later — they'll appear here.
          </p>
          <Link
            to="/shop"
            style={{
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.charcoal, backgroundColor: C.gold,
              textDecorationLine: 'none', borderRadius: '5px',
              padding: '0.75rem 1.75rem',
              boxShadow: '0 2px 12px rgba(212,169,78,0.35)',
              display: 'inline-block',
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* ── Grid ──────────────────────────────────────── */
        <div className="wishlist-grid">
          {items.map(item => (
            <WishCard
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onAddToCart={() => {}}
            />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
