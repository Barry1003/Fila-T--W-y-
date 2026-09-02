'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import type { CatalogueProduct } from '@/server/catalogue';

const U = 'https://images.unsplash.com/';

const MOCK_REVIEWS = [
  {
    id: 1, name: 'Adaeze O.', location: 'Lagos, Nigeria', rating: 5, date: 'Aug 12, 2026',
    text: "I ordered the Gobi Filà for my husband's traditional wedding and it arrived in perfect condition. The velvet quality is exceptional — rich, deep colour that photographs beautifully. Delivery to Lagos took exactly 4 business days.",
  },
  {
    id: 2, name: 'Tokunbo A.', location: 'Toronto, Canada', rating: 5, date: 'Jul 28, 2026',
    text: "Finally a brand that gets the diaspora experience right. Ordered two filàs for a cultural event in Toronto — sizing was spot on and the craftsmanship is outstanding. Will be a repeat customer.",
  },
  {
    id: 3, name: 'Chisom N.', location: 'London, UK', rating: 4, date: 'Jun 15, 2026',
    text: "Beautiful piece, arrived well-packaged. The burgundy velvet is even richer in person. Took off one star only because I'd love to see more brocade options. Otherwise flawless.",
  },
];

const RATING_DIST = [
  { stars: 5, count: 18 },
  { stars: 4, count: 5 },
  { stars: 3, count: 1 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];
const TOTAL_REVIEWS = RATING_DIST.reduce((s, r) => s + r.count, 0);
const AVG_RATING = 4.7;

// ── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({
  product,
  imgSrc,
  onClose,
}: {
  product: CatalogueProduct;
  imgSrc: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const productUrl = `https://adeclassics.com/product/${product.slug}`;
  const shareText = `Check out ${product.title} on AdeClassics — CAD $${product.priceCad.toLocaleString()}`;

  function handleCopy() {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = productUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  }

  const channels = [
    {
      name: 'WhatsApp',
      bg: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + productUrl)}`,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      bg: '#C13584',
      href: 'https://www.instagram.com/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      bg: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      ),
    },
    {
      name: 'X',
      bg: '#0F0F0F',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'Email',
      bg: '#3B8A93',
      href: `mailto:?subject=${encodeURIComponent('A piece from AdeClassics')}&body=${encodeURIComponent(shareText + '\n\n' + productUrl)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(43,35,32,0.58)', backdropFilter: 'blur(5px)' }} />

      {/* Modal card */}
      <div style={{ position: 'relative', backgroundColor: C.cream, borderRadius: '14px', width: '100%', maxWidth: '440px', padding: '2rem', boxShadow: '0 32px 80px rgba(43,35,32,0.28)', zIndex: 1, maxHeight: '92dvh', overflowY: 'auto' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1.125rem', right: '1.125rem', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(43,35,32,0.38)', padding: '5px', display: 'flex', lineHeight: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Title */}
        <h2 style={{ fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 400, color: C.charcoal, margin: '0 0 1.5rem', letterSpacing: '-0.018em', lineHeight: 1.15 }}>
          Share This Product
        </h2>

        {/* OG link-preview card */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textDecorationLine: 'none', marginBottom: '0.625rem' }}
        >
          <div style={{ border: '1px solid rgba(43,35,32,0.11)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(43,35,32,0.09)' }}>
            {/* Product image — same as PDP main */}
            <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#ddd5c8', position: 'relative' }}>
              <img src={imgSrc} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            {/* Text block — mimics a WhatsApp / iMessage OG card */}
            <div style={{ padding: '0.75rem 1rem 0.9rem', backgroundColor: '#fff', borderTop: '1px solid rgba(43,35,32,0.07)' }}>
              <div style={{ fontFamily: UI, fontSize: '0.575rem', color: 'rgba(43,35,32,0.3)', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                adeclassics.com
              </div>
              <div style={{ fontFamily: UI, fontSize: '0.925rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.32, marginBottom: '0.3rem' }}>
                {product.title}
              </div>
              <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)', display: 'flex', gap: '0.375rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: C.charcoal }}>CAD ${product.priceCad.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </a>

        {/* Caption */}
        <p style={{ fontFamily: UI, fontSize: '0.695rem', color: 'rgba(43,35,32,0.38)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          This is how it'll appear when shared — tap it to open the product page
        </p>

        {/* Channel buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.875rem', marginBottom: '1.625rem' }}>
          {channels.map(ch => (
            <a
              key={ch.name}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', textDecorationLine: 'none' }}
            >
              <span style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(43,35,32,0.14)' }}>
                {ch.icon}
              </span>
              <span style={{ fontFamily: UI, fontSize: '0.565rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.04em' }}>{ch.name}</span>
            </a>
          ))}
        </div>

        {/* Copy-link row */}
        <div style={{ display: 'flex', border: '1px solid rgba(43,35,32,0.13)', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' }}>
          <input
            readOnly
            value={productUrl}
            style={{ flex: 1, padding: '0.7rem 0.875rem', border: 'none', outline: 'none', fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.45)', backgroundColor: 'transparent', minWidth: 0 }}
          />
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: copied ? C.teal : C.gold,
              color: copied ? C.cream : C.charcoal,
              border: 'none',
              ...label,
              fontSize: '0.575rem',
              padding: '0 1.25rem',
              cursor: 'pointer',
              letterSpacing: '0.12em',
              flexShrink: 0,
              transition: 'background-color 0.28s, color 0.28s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* Toast */}
        <div style={{
          marginTop: '0.875rem',
          display: 'flex',
          justifyContent: 'center',
          height: '1.5rem',
        }}>
          <span style={{
            fontFamily: UI,
            fontSize: '0.72rem',
            color: C.teal,
            fontWeight: 600,
            opacity: copied ? 1 : 0,
            transform: copied ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.22s, transform 0.22s',
          }}>
            Link copied to clipboard!
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', verticalAlign: 'middle' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? C.gold : 'none'}
          stroke={C.gold} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export type ProductProps = {
  product: CatalogueProduct;
  related: CatalogueProduct[];
};

export default function Product({ product, related }: ProductProps) {

  const [mainIdx, setMainIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'sizing' | 'shipping'>('description');
  const [shareOpen, setShareOpen] = useState(false);

  // One stored image, shown at several crops until products carry a real
  // gallery. Unsplash-hosted URLs accept crop hints; anything else falls back
  // to the image as stored.
  const gallery = ['entropy', 'top', 'bottom', 'left', 'right'].map(crop => {
    const unsplash = product.imageUrl.includes('images.unsplash.com');
    const base = product.imageUrl.split('?')[0];
    return unsplash
      ? {
          main: `${base}?w=900&h=1125&fit=crop&crop=${crop}&auto=format`,
          thumb: `${base}?w=200&h=200&fit=crop&crop=${crop}&auto=format`,
        }
      : { main: product.imageUrl, thumb: product.imageUrl };
  });

  const isHeadwear = ['Fila Gobi', 'Abetiaja', 'Shisha', 'Fila Senator', 'Gele', 'Ipele'].includes(product.category);
  const isFootwear = ['Shoes', 'Pam Slippers'].includes(product.category);
  const isMTO = product.tag === 'MADE TO ORDER';
  const isSoldOut = product.tag === 'SOLD OUT';
  const hasVariableSizes = product.sizes.length > 1 && product.sizes[0] !== 'One Size';

  const sizingRows = isHeadwear ? [
    ['S', '54–56', '21.3–22"'],
    ['M', '56–58', '22–22.8"'],
    ['L', '58–60', '22.8–23.6"'],
    ['XL', '60–62', '23.6–24.4"'],
  ] : isFootwear ? [
    ['38', '24.5', '6'],
    ['39', '25.1', '6.5'],
    ['40', '25.7', '7'],
    ['41', '26.3', '7.5'],
    ['42', '27.0', '8.5'],
    ['43', '27.6', '9'],
  ] : [
    ['S', '88–92', '72–76', '68'],
    ['M', '92–96', '76–80', '70'],
    ['L', '96–100', '80–84', '72'],
    ['XL', '100–105', '84–89', '74'],
    ['2XL', '105–112', '89–96', '76'],
  ];

  const sizingHeaders = isHeadwear
    ? ['Size', 'Circumference (cm)', 'Circumference (in)']
    : isFootwear
    ? ['EU Size', 'Foot Length (cm)', 'US Size']
    : ['Size', 'Chest (cm)', 'Waist (cm)', 'Length (cm)'];

  const tabs = [
    { key: 'description' as const, label: 'Description' },
    { key: 'sizing' as const, label: 'Sizing Guide' },
    { key: 'shipping' as const, label: 'Shipping & Returns' },
  ];

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2.5rem' }}>

        {/* ── Breadcrumb ── */}
        <nav style={{ padding: '2rem 0 0', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', ...label, fontSize: '0.565rem', color: 'rgba(43,35,32,0.38)', letterSpacing: '0.13em' }}>
          <Link to="/" style={{ color: 'inherit', textDecorationLine: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'inherit', textDecorationLine: 'none' }}>Shop</Link>
          <span>/</span>
          <Link
            to={product.collectionSlug ? `/collections/${product.collectionSlug}` : '/shop'}
            style={{ color: 'inherit', textDecorationLine: 'none' }}
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: C.charcoal }}>{product.title}</span>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', padding: '3rem 0 5rem', alignItems: 'start' }}>

          {/* LEFT: Image gallery */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#ddd5c8', marginBottom: '0.875rem' }}>
              <img
                key={mainIdx}
                className="pdp-main-img"
                src={gallery[mainIdx].main}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: isSoldOut ? C.charcoal : isMTO ? C.charcoal : C.maroon, color: C.cream, ...label, fontSize: '0.575rem', padding: '4px 10px', letterSpacing: '0.12em' }}>
                {product.tag}
              </span>
            </div>
            {/* Thumbnail strip */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setMainIdx(i)}
                  style={{
                    flex: 1, aspectRatio: '1', overflow: 'hidden', padding: 0, border: 'none',
                    outline: mainIdx === i ? `2px solid ${C.gold}` : '2px solid transparent',
                    outlineOffset: '2px', cursor: 'pointer', backgroundColor: '#ddd5c8',
                    transition: 'outline 0.15s',
                  }}
                >
                  <img src={g.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div style={{ paddingTop: '0.25rem' }}>
            {/* Category eyebrow */}
            <div style={{ ...label, color: C.teal, fontSize: '0.58rem', marginBottom: '0.875rem', letterSpacing: '0.16em' }}>
              {product.category}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, margin: '0 0 1rem', lineHeight: 1.12 }}>
              {product.title}
            </h1>

            {/* Stars + review count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.75rem' }}>
              <Stars rating={AVG_RATING} size={14} />
              <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)' }}>
                {AVG_RATING} · {TOTAL_REVIEWS} reviews
              </span>
            </div>

            {/* Price block */}
            <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(43,35,32,0.08)' }}>
              <div style={{ fontFamily: UI, fontSize: '2rem', fontWeight: 700, color: C.charcoal, lineHeight: 1, letterSpacing: '-0.025em' }}>
                CAD ${product.priceCad.toLocaleString()}
              </div>
            </div>

            {/* Size selector */}
            {hasVariableSizes && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.875rem' }}>
                  <span style={{ ...label, fontSize: '0.58rem', color: C.charcoal }}>Size</span>
                  <button
                    onClick={() => setActiveTab('sizing')}
                    style={{ background: 'none', border: 'none', fontFamily: UI, fontSize: '0.775rem', color: C.indigo, cursor: 'pointer', padding: 0, textDecorationLine: 'underline' }}>
                    Size Guide
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        minWidth: '46px', padding: '0.5rem 0.75rem',
                        border: selectedSize === s ? `2px solid ${C.gold}` : '1px solid rgba(43,35,32,0.18)',
                        backgroundColor: selectedSize === s ? 'rgba(212,169,78,0.07)' : 'transparent',
                        color: C.charcoal, fontFamily: UI, fontSize: '0.825rem',
                        cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s', outline: 'none',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.125rem' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: isSoldOut ? 'rgba(43,35,32,0.25)' : isMTO ? C.gold : C.teal,
                boxShadow: isSoldOut ? 'none' : `0 0 0 3px ${isMTO ? 'rgba(212,169,78,0.15)' : 'rgba(59,138,147,0.15)'}`,
              }} />
              <span style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.charcoal }}>
                {isSoldOut ? 'Sold Out — join the waitlist' : isMTO ? 'Made to Order — ships in 5–7 business days' : 'In Stock — ready to ship'}
              </span>
            </div>

            {/* Estimated delivery */}
            <div style={{ marginBottom: '2rem', padding: '0.875rem 1.125rem', backgroundColor: 'rgba(59,138,147,0.055)', borderLeft: `2.5px solid ${C.teal}` }}>
              <div style={{ ...label, color: C.charcoal, fontSize: '0.57rem', marginBottom: '0.5rem', letterSpacing: '0.13em' }}>Estimated Delivery</div>
              <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.75 }}>
                Canada / US / UK: 7–10 business days<br />
                Nigeria: 2–4 business days
              </div>
            </div>

            {/* Quantity + CTA */}
            <div style={{ marginBottom: '0.875rem' }}>
              <div style={{ ...label, fontSize: '0.57rem', color: C.charcoal, marginBottom: '0.75rem', letterSpacing: '0.13em' }}>Quantity</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Stepper */}
                <div style={{ display: 'flex', border: '1px solid rgba(43,35,32,0.18)', height: '50px', flexShrink: 0 }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '46px', background: 'none', border: 'none', cursor: 'pointer', color: C.charcoal, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: UI, fontSize: '0.9375rem', color: C.charcoal, borderLeft: '1px solid rgba(43,35,32,0.12)', borderRight: '1px solid rgba(43,35,32,0.12)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ width: '46px', background: 'none', border: 'none', cursor: 'pointer', color: C.charcoal, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                {/* Add to Cart */}
                <button
                  disabled={isSoldOut}
                  className={isSoldOut ? '' : 'shimmer-cta'}
                  style={{
                    flex: 1, height: '50px',
                    backgroundColor: isSoldOut ? 'rgba(43,35,32,0.08)' : C.gold,
                    color: isSoldOut ? 'rgba(43,35,32,0.3)' : C.charcoal,
                    border: 'none', ...label, fontSize: '0.68rem', letterSpacing: '0.17em',
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSoldOut ? 'Sold Out' : 'Add to Cart'}
                </button>

                {/* Share button */}
                <button
                  onClick={() => setShareOpen(true)}
                  title="Share this product"
                  style={{
                    width: '50px', height: '50px', flexShrink: 0,
                    border: `1.5px solid ${C.maroon}`,
                    backgroundColor: 'transparent',
                    color: C.maroon,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.maroon; (e.currentTarget as HTMLButtonElement).style.color = C.cream; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = C.maroon; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Custom size link */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <a href="#" style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.indigo, textDecorationLine: 'none', borderBottom: `1px solid ${C.indigo}`, paddingBottom: '1px' }}>
                Request Custom Size →
              </a>
            </div>

            {/* Trust row */}
            <div style={{ borderTop: '1px solid rgba(43,35,32,0.08)', paddingTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { mark: '🔒', text: 'Escrow-protected payment' },
                { mark: '✦', text: 'Authentic Yoruba craft' },
                { mark: '↩', text: 'Easy 14-day returns' },
              ].map(({ mark, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>{mark}</span>
                  <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.55)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ borderTop: '1px solid rgba(43,35,32,0.09)', paddingBottom: '5rem' }}>
          {/* Tab nav */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(43,35,32,0.09)', marginBottom: '3rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  ...label, fontSize: '0.605rem', letterSpacing: '0.14em',
                  color: activeTab === tab.key ? C.charcoal : 'rgba(43,35,32,0.4)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1.25rem 2rem',
                  borderBottom: activeTab === tab.key ? `2px solid ${C.gold}` : '2px solid transparent',
                  marginBottom: '-1px',
                  transition: 'color 0.18s, border-color 0.18s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: '700px' }}>
            {/* Description */}
            {activeTab === 'description' && (
              <div>
                <p style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)', marginBottom: '1.25rem' }}>
                  The {product.title} is a handcrafted piece made with premium materials sourced and finished in Nigeria. Each one is individually sewn and inspected before shipping — reflecting the standard of quality AdeClassics has maintained since its founding.
                </p>
                <p style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)', marginBottom: '1.25rem' }}>
                  This {product.category.toLowerCase()} is constructed using traditional techniques passed down through generations of Yoruba craftspeople. The rich tones and textures are a direct result of careful material selection and hand-finishing — no shortcuts, no compromises.
                </p>
                <div style={{ marginTop: '2.25rem' }}>
                  <div style={{ ...label, color: C.charcoal, fontSize: '0.58rem', marginBottom: '1rem', letterSpacing: '0.14em' }}>Materials & Care</div>
                  <ul style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)', paddingLeft: '1.25rem', margin: 0 }}>
                    <li>Premium Aso-oke or velvet, depending on colourway</li>
                    <li>Hand-stitched finishing — no factory shortcuts</li>
                    <li>Dry clean recommended; or gentle hand wash in cold water</li>
                    <li>Store flat or on a padded hanger; avoid prolonged direct sunlight</li>
                    <li>Iron on low heat with a pressing cloth over the fabric</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Sizing guide */}
            {activeTab === 'sizing' && (
              <div>
                <p style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(43,35,32,0.72)', marginBottom: '1.75rem' }}>
                  {isHeadwear
                    ? 'Measure your head circumference at its widest point — approximately 1 cm above the eyebrows and ears. When between sizes, we recommend sizing up.'
                    : isFootwear
                    ? 'Measure the length of your foot from heel to longest toe. Our lasts run true to EU sizing — if between sizes, size up.'
                    : 'For garments, measure your chest at its fullest point and your natural waist. All garments include a 2 cm seam allowance. For custom measurements, use the Request Custom Size link above.'}
                </p>
                <div className="table-scroll">
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420, fontFamily: UI, fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${C.gold}` }}>
                        {sizingHeaders.map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem 0.75rem 0', color: C.charcoal, ...label, fontSize: '0.565rem', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizingRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(43,35,32,0.07)', backgroundColor: i % 2 === 1 ? 'rgba(43,35,32,0.02)' : 'transparent' }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{ padding: '0.75rem 1rem 0.75rem 0', color: j === 0 ? C.charcoal : 'rgba(43,35,32,0.65)', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shipping & Returns */}
            {activeTab === 'shipping' && (
              <div>
                <div style={{ marginBottom: '2.25rem' }}>
                  <div style={{ ...label, color: C.charcoal, fontSize: '0.58rem', marginBottom: '1rem', letterSpacing: '0.14em' }}>Shipping</div>
                  <ul style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)', paddingLeft: '1.25rem', margin: 0 }}>
                    <li>Canada / US / UK: standard 7–10 business days; express 3–5 days</li>
                    <li>Nigeria: 2–4 business days via our Lagos fulfilment partner</li>
                    <li>All other countries: 10–18 business days</li>
                    <li>Free standard shipping on all orders over CAD $200</li>
                    <li>All parcels are fully tracked and insured at no extra cost</li>
                  </ul>
                </div>
                <div>
                  <div style={{ ...label, color: C.charcoal, fontSize: '0.58rem', marginBottom: '1rem', letterSpacing: '0.14em' }}>Returns</div>
                  <ul style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)', paddingLeft: '1.25rem', margin: 0 }}>
                    <li>In-stock items: 14-day return window from delivery date</li>
                    <li>Made-to-order items are final sale — crafted to your dimensions</li>
                    <li>Items must be unworn, unwashed, with original packaging intact</li>
                    <li>Initiate a return via our Help Centre — return shipping covered within Canada</li>
                    <li>Refunds processed within 5–7 business days of receiving the item</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <section style={{ borderTop: '1px solid rgba(43,35,32,0.09)', backgroundColor: 'rgba(122,46,56,0.025)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '5rem 2.5rem' }}>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, marginBottom: '3rem' }}>
            Customer Reviews.
          </h2>

          {/* Summary row */}
          <div className="pdp-review-summary" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3.5rem', alignItems: 'start', marginBottom: '3.5rem', maxWidth: '660px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '4rem', fontWeight: 400, color: C.charcoal, lineHeight: 1 }}>{AVG_RATING}</div>
              <div style={{ margin: '0.4rem 0' }}><Stars rating={AVG_RATING} size={16} /></div>
              <div style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)' }}>{TOTAL_REVIEWS} reviews</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.625rem' }}>
              {RATING_DIST.map(({ stars, count }) => (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.5)', width: '10px', textAlign: 'right', flexShrink: 0 }}>{stars}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(43,35,32,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${TOTAL_REVIEWS > 0 ? (count / TOTAL_REVIEWS) * 100 : 0}%`, backgroundColor: C.gold, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)', width: '20px', flexShrink: 0 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="pdp-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {MOCK_REVIEWS.map(review => (
              <div key={review.id} style={{ backgroundColor: C.cream, padding: '1.875rem', border: '1px solid rgba(43,35,32,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.2rem' }}>{review.name}</div>
                    <div style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)' }}>{review.location}</div>
                  </div>
                  <Stars rating={review.rating} size={12} />
                </div>
                <p style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.78, color: 'rgba(43,35,32,0.7)', margin: '0 0 1rem' }}>"{review.text}"</p>
                <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.32)' }}>{review.date}</div>
              </div>
            ))}
          </div>

          <button style={{ border: `1.5px solid ${C.gold}`, color: C.charcoal, backgroundColor: 'transparent', ...label, fontSize: '0.655rem', padding: '0.875rem 2.25rem', cursor: 'pointer', letterSpacing: '0.14em' }}>
            Write a Review
          </button>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      <section style={{ borderTop: '1px solid rgba(43,35,32,0.09)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '5rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, margin: 0 }}>
              You May Also Like.
            </h2>
            <Link to="/shop" style={{ ...label, color: C.indigo, textDecorationLine: 'none', fontSize: '0.64rem' }}>View All →</Link>
          </div>
          <div className="pdp-related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.slug}`} className="product-card" style={{ textDecorationLine: 'none', color: C.charcoal, display: 'block' }}>
                <div style={{ position: 'relative', marginBottom: '1rem', backgroundColor: '#ddd5c8', overflow: 'hidden', aspectRatio: '3/4' }}>
                  <img className="product-img" src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: p.tag === 'NEW' ? C.maroon : C.charcoal, color: C.cream, ...label, fontSize: '0.56rem', padding: '3px 8px', letterSpacing: '0.12em' }}>
                    {p.tag}
                  </span>
                  <div className="product-overlay">
                    <div className="product-overlay-btns">
                      <button onClick={e => e.preventDefault()} style={{ flex: 1, border: '1px solid rgba(250,246,240,0.55)', color: C.cream, background: 'transparent', ...label, fontSize: '0.585rem', padding: '0.55rem 0', cursor: 'pointer', letterSpacing: '0.12em', backdropFilter: 'blur(4px)' }}>
                        Quick View
                      </button>
                      <button onClick={e => e.preventDefault()} style={{ flex: 1, border: 'none', color: C.charcoal, background: C.gold, ...label, fontSize: '0.585rem', padding: '0.55rem 0', cursor: 'pointer', letterSpacing: '0.12em' }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, marginBottom: '0.5rem', lineHeight: 1.4 }}>{p.title}</div>
                <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600 }}>CAD ${p.priceCad.toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Share modal */}
      {shareOpen && (
        <ShareModal
          product={product}
          imgSrc={gallery[mainIdx].main}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
