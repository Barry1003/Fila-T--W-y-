'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';
import { slugify } from '@/lib/slug';

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
    <div className="flex flex-col">
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-[3/4] mb-3.5"
        style={{ backgroundColor: '#ddd5c8' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/product/${slugify(item.title)}`}>
          <img
            src={`https://images.unsplash.com/${item.img}?w=600&h=800&fit=crop&auto=format`}
            alt={item.title}
            className="w-full h-full object-cover block"
            style={{
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
              opacity: isSoldOut ? 0.72 : 1,
            }}
          />
        </Link>

        {/* Tag badge */}
        <span
          className="absolute top-3 left-3 py-[3px] px-[8px] pointer-events-none"
          style={{ backgroundColor: tagColor, color: C.cream, ...label, fontSize: '0.56rem', letterSpacing: '0.12em' }}
        >
          {item.tag}
        </span>

        {/* Filled heart — remove from wishlist */}
        <button
          onClick={onRemove}
          onMouseEnter={() => setHeartHover(true)}
          onMouseLeave={() => setHeartHover(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: heartHover ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(4px)',
            border: 'none',
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
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(250,246,240,0.15)' }} />
        )}
      </div>

      {/* Text */}
      <Link to={`/product/${slugify(item.title)}`} className="no-underline" style={{ color: C.charcoal }}>
        <div className="mb-[0.45rem]" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.4, color: C.charcoal }}>
          {item.title}
        </div>
      </Link>
      <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>
        {fmt(item.cadNum, 'CAD $')}
      </div>
      <div className="mt-[0.2rem] mb-3.5" style={{ fontFamily: UI, fontSize: '0.8rem', color: C.teal, fontWeight: 500 }}>
      </div>

      {/* CTA */}
      {isSoldOut ? (
        <button
          disabled
          className="w-full py-[0.6rem] px-4 rounded-[4px] uppercase cursor-not-allowed"
          style={{
            fontFamily: UI, fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'rgba(43,35,32,0.4)',
            backgroundColor: 'transparent',
            borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.2)',
          }}
        >
          Notify Me When Available
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full py-[0.6rem] px-4 rounded-[4px] uppercase cursor-pointer"
          style={{
            fontFamily: UI, fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em',
            color: added ? '#fff' : C.charcoal,
            backgroundColor: added ? C.teal : C.gold,
            border: 'none',
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
        className="pt-[0.45rem] cursor-pointer text-left"
        style={{
          background: 'none', border: 'none',
          fontFamily: UI, fontSize: '0.72rem',
          color: 'rgba(43,35,32,0.38)',
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
      <div className="mb-9">
        <h1 className="inline" style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          Your Wishlist
        </h1>
        {items.length > 0 && (
          <span className="ml-3 uppercase" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.1em' }}>
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </div>

      {/* ── Empty state ───────────────────────────────── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="mb-6 opacity-20">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="mb-2" style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal, fontWeight: 500 }}>
            Your wishlist is empty
          </p>
          <p className="mb-7 max-w-[300px]" style={{ fontFamily: UI, fontSize: '0.84rem', color: 'rgba(43,35,32,0.5)', lineHeight: 1.6 }}>
            Save items you love for later — they'll appear here.
          </p>
          <Link
            to="/shop"
            className="inline-block no-underline rounded-[5px] py-3 px-7 uppercase"
            style={{
              fontFamily: UI, fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.1em',
              color: C.charcoal, backgroundColor: C.gold,
              boxShadow: '0 2px 12px rgba(212,169,78,0.35)',
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
