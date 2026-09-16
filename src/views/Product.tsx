'use client';

import { useState, useMemo, useTransition } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useOverlay } from '@/lib/useOverlay';
import { useCart } from '@/lib/cart';
import { toggleWishlist } from '@/server/wishlist-actions';
import { C, DISPLAY, UI, label } from '../tokens';
import type { CatalogueProduct } from '@/server/catalogue';

// Reviews are not wired to real data yet, so the product page shows none rather
// than placeholder ratings — no invented "4.7 / 24 reviews" as social proof.

// ── Share Modal ──────────────────────────────────────────────────────────────

function ShareModal({
  product,
  baseUrl,
  onClose,
}: {
  product: CatalogueProduct;
  baseUrl?: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  useOverlay(true, onClose); // Escape-to-close + scroll lock while the modal is open
  // Prefer the canonical origin passed from the server (survives redeploys, never
  // a preview/localhost host); fall back to the current origin, then production.
  const origin = (baseUrl || (typeof window !== 'undefined' ? window.location.origin : '') || 'https://fila-t-w-y.vercel.app').replace(/\/+$/, '');
  const host = origin.replace(/^https?:\/\//, '');
  const productUrl = `${origin}/product/${product.slug}`;
  // The real card that platforms unfurl — the same 1200×630 "Shop Now" image.
  const previewUrl = `${productUrl}/og.jpg`;
  const shareText = `Check out ${product.title} on AdeClassics — CAD $${product.priceCad.toLocaleString()}`;

  // Native share sheet (mobile) — the reliable way to reach Instagram, which has
  // no web share intent. Falls back to copying the link on desktop.
  function nativeShare() {
    const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string; url?: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      nav.share({ title: product.title, text: shareText, url: productUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  }

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

  const channels: { name: string; bg: string; icon: React.ReactNode; href?: string; onClick?: () => void }[] = [
    {
      name: 'WhatsApp',
      bg: '#25D366',
      // URL first so WhatsApp unfurls it — leading text suppresses the preview.
      href: `https://wa.me/?text=${encodeURIComponent(productUrl + '\n\n' + shareText)}`,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      name: 'Share',
      bg: '#C13584',
      onClick: nativeShare,
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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0" style={{ backgroundColor: 'rgba(43,35,32,0.58)', backdropFilter: 'blur(5px)' }} />

      {/* Modal card */}
      <div className="relative rounded-[14px] w-full max-w-[440px] p-8 z-[1] max-h-[92dvh] overflow-y-auto" style={{ backgroundColor: C.cream, boxShadow: '0 32px 80px rgba(43,35,32,0.28)' }}>

        {/* Close */}
        <button onClick={onClose} className="absolute top-[1.125rem] right-[1.125rem] p-[5px] flex cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(43,35,32,0.38)', lineHeight: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Title */}
        <h2 className="m-0 mb-6" style={{ fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.018em', lineHeight: 1.15 }}>
          Share This Product
        </h2>

        {/* OG link-preview card */}
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block no-underline mb-2.5"
        >
          <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid rgba(43,35,32,0.11)', boxShadow: '0 2px 14px rgba(43,35,32,0.09)' }}>
            {/* The actual share card platforms render, at its true 1.91:1 ratio. */}
            <div className="overflow-hidden relative" style={{ backgroundColor: '#ddd5c8', aspectRatio: '1200 / 630' }}>
              <img src={previewUrl} alt={product.title} className="w-full h-full object-cover block" />
            </div>
            {/* Text row — mimics the domain/title line a WhatsApp card shows below. */}
            <div className="pt-3 px-4 pb-[0.9rem]" style={{ backgroundColor: '#fff', borderTop: '1px solid rgba(43,35,32,0.07)' }}>
              <div className="mb-[0.3rem] uppercase" style={{ fontFamily: UI, fontSize: '0.575rem', color: 'rgba(43,35,32,0.3)', letterSpacing: '0.13em' }}>
                {host}
              </div>
              <div className="mb-[0.3rem]" style={{ fontFamily: UI, fontSize: '0.925rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.32 }}>
                {product.title}
              </div>
              <div className="flex gap-1.5 items-baseline flex-wrap" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)' }}>
                <span style={{ fontWeight: 700, color: C.charcoal }}>CAD ${product.priceCad.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </a>

        {/* Caption */}
        <p className="m-0 mb-6" style={{ fontFamily: UI, fontSize: '0.695rem', color: 'rgba(43,35,32,0.38)', lineHeight: 1.6 }}>
          This is how it'll appear when shared — tap it to open the product page
        </p>

        {/* Channel buttons */}
        <div className="flex justify-center gap-3.5 mb-[1.625rem]">
          {channels.map(ch => {
            const inner = (
              <>
                <span className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: ch.bg, boxShadow: '0 2px 8px rgba(43,35,32,0.14)' }}>
                  {ch.icon}
                </span>
                <span style={{ fontFamily: UI, fontSize: '0.565rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.04em' }}>{ch.name}</span>
              </>
            );
            return 'onClick' in ch && ch.onClick ? (
              <button
                key={ch.name}
                onClick={ch.onClick}
                className="flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
              >
                {inner}
              </button>
            ) : (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 no-underline"
              >
                {inner}
              </a>
            );
          })}
        </div>

        {/* Copy-link row */}
        <div className="flex rounded-[6px] overflow-hidden" style={{ border: '1px solid rgba(43,35,32,0.13)', backgroundColor: '#fff' }}>
          <input
            readOnly
            value={productUrl}
            className="flex-1 py-[0.7rem] px-3.5 min-w-0"
            style={{ border: 'none', outline: 'none', fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.45)', backgroundColor: 'transparent' }}
          />
          <button
            onClick={handleCopy}
            className="px-5 py-0 cursor-pointer whitespace-nowrap shrink-0"
            style={{
              backgroundColor: copied ? C.teal : C.gold,
              color: copied ? C.cream : C.charcoal,
              border: 'none',
              ...label,
              fontSize: '0.575rem',
              letterSpacing: '0.12em',
              transition: 'background-color 0.28s, color 0.28s',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* Toast */}
        <div className="mt-3.5 flex justify-center h-6">
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

export type ProductProps = {
  product: CatalogueProduct;
  related: CatalogueProduct[];
  inWishlist?: boolean;
  signedIn?: boolean;
  /** Canonical origin (from siteUrl()) so shared links survive redeploys and
   *  never point at a preview/localhost host. */
  shareBaseUrl?: string;
};

export default function Product({ product, related, inWishlist = false, signedIn = false, shareBaseUrl }: ProductProps) {

  const [mainIdx, setMainIdx] = useState(0);
  const uniqueSizes = useMemo(() => [...new Set(product.variants.map(v => v.size))], [product.variants]);
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'sizing' | 'shipping'>('description');
  const [shareOpen, setShareOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { add } = useCart();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(inWishlist);
  const [, startWishlist] = useTransition();

  function toggleSaved() {
    if (!signedIn) {
      navigate(`/auth?next=/product/${product.slug}`);
      return;
    }
    const prev = saved;
    setSaved(!prev); // optimistic
    startWishlist(async () => {
      const res = await toggleWishlist(product.id);
      if (!res.ok) { setSaved(prev); alert(res.message); return; }
      setSaved(res.inWishlist);
    });
  }

  function addToCart() {
    if (!canBuy) return;
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      size: selectedSize,
      color: selectedColor,
      unitPriceCents: Math.round(product.priceCad * 100),
      // The photo the shopper is actually looking at, so the cart shows what
      // they chose — the selected colour and the crop they clicked to.
      imageUrl: gallery[safeIdx]?.main ?? shownImages[0]?.url ?? product.imageUrl,
      quantity,
    });

    // Confirm in place rather than navigating away — most shoppers add more
    // than one thing, and bouncing them to the cart each time interrupts that.
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2600);
  }

  // The gallery follows the chosen colour: that colour's own photos first, then
  // the general ones that apply to every colour.
  const shownImages = useMemo(() => {
    const all = product.images ?? [];
    const forColor = all.filter(img => img.color === selectedColor);
    const general = all.filter(img => !img.color);
    return [...forColor, ...general];
  }, [product.images, selectedColor]);

  // A product with a real gallery shows its photos as stored. One with a single
  // image (the seeded catalogue) is shown at several crops so the strip is not a
  // lone thumbnail — Unsplash URLs accept crop hints; anything else repeats.
  const gallery = useMemo(() => {
    if (shownImages.length > 1) {
      return shownImages.map(img => ({ main: img.url, thumb: img.url }));
    }
    const url = shownImages[0]?.url ?? product.imageUrl;
    const base = url.split('?')[0];
    return url.includes('images.unsplash.com')
      ? ['entropy', 'top', 'bottom', 'left', 'right'].map(crop => ({
          main: `${base}?w=900&h=1125&fit=crop&crop=${crop}&auto=format`,
          thumb: `${base}?w=200&h=200&fit=crop&crop=${crop}&auto=format`,
        }))
      : [{ main: url, thumb: url }];
  }, [shownImages, product.imageUrl]);

  // Switching colour can shrink the gallery below the current index. Clamp here,
  // during render, rather than correcting in an effect afterwards — an effect
  // runs after the render that would already have read gallery[mainIdx] and
  // thrown on a shorter list.
  const safeIdx = mainIdx < gallery.length ? mainIdx : 0;

  const isHeadwear = ['Fila Gobi', 'Abetiaja', 'Shisha', 'Fila Senator', 'Gele'].includes(product.category);
  const isFootwear = ['Shoes', 'Pam Slippers'].includes(product.category);
  const isMTO = product.tag === 'MADE TO ORDER';
  const isSoldOut = product.tag === 'SOLD OUT';

  // The exact variant the shopper has selected — what actually governs whether
  // they can buy, not the product-level SOLD OUT tag. A made-to-order piece is
  // buyable even with no stock on hand.
  const selectedVariant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const canBuy = !isSoldOut && (isMTO || selectedVariant?.inStock !== false);

  const hasVariableSizes = uniqueSizes.length > 1 && uniqueSizes[0] !== 'One Size';
  const hasVariableColors = product.colors.length > 0 && product.colors[0] !== '';

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
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>
      <div className="max-w-[1440px] mx-auto px-10">

        {/* ── Breadcrumb ── */}
        <nav className="pt-8 flex gap-2 items-center flex-wrap" style={{ ...label, fontSize: '0.565rem', color: 'rgba(43,35,32,0.38)', letterSpacing: '0.13em' }}>
          <Link to="/" className="no-underline" style={{ color: 'inherit' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" className="no-underline" style={{ color: 'inherit' }}>Shop</Link>
          <span>/</span>
          <Link
            to={product.collectionSlug ? `/collections/${product.collectionSlug}` : '/shop'}
            className="no-underline"
            style={{ color: 'inherit' }}
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: C.charcoal }}>{product.title}</span>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="pdp-grid grid grid-cols-2 gap-20 pt-12 pb-20 items-start">

          {/* LEFT: Image gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden mb-3.5" style={{ backgroundColor: '#ddd5c8' }}>
              <img
                key={safeIdx}
                className="pdp-main-img w-full h-full object-cover block"
                src={gallery[safeIdx].main}
                alt={product.title}
              />
              <span className="absolute top-4 left-4 py-[4px] px-[10px]" style={{ backgroundColor: isSoldOut ? C.charcoal : isMTO ? C.charcoal : C.maroon, color: C.cream, ...label, fontSize: '0.575rem', letterSpacing: '0.12em' }}>
                {product.tag}
              </span>
            </div>
            {/* Thumbnail strip — only when there is more than one photo, so a
                single image isn't echoed as a full-width square below it. */}
            {gallery.length > 1 && (
            <div className="flex gap-2.5">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setMainIdx(i)}
                  className="flex-1 aspect-square overflow-hidden p-0 cursor-pointer"
                  style={{
                    border: 'none',
                    outline: safeIdx === i ? `2px solid ${C.gold}` : '2px solid transparent',
                    outlineOffset: '2px', backgroundColor: '#ddd5c8',
                    transition: 'outline 0.15s',
                  }}
                >
                  <img src={g.thumb} alt="" className="w-full h-full object-cover block" />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* RIGHT: Product info */}
          <div className="pt-1">
            {/* Category eyebrow */}
            <div className="mb-3.5" style={{ ...label, color: C.teal, fontSize: '0.58rem', letterSpacing: '0.16em' }}>
              {product.category}
            </div>

            {/* Title */}
            <h1 className="m-0 mb-6" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, lineHeight: 1.12 }}>
              {product.title}
            </h1>

            {/* Price block */}
            <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(43,35,32,0.08)' }}>
              <div style={{ fontFamily: UI, fontSize: '2rem', fontWeight: 700, color: C.charcoal, lineHeight: 1, letterSpacing: '-0.025em' }}>
                CAD ${product.priceCad.toLocaleString()}
              </div>
            </div>

            {/* Size selector */}
            {hasVariableSizes && (
              <div className="mb-7">
                <div className="flex justify-between items-baseline mb-3.5">
                  <span style={{ ...label, fontSize: '0.58rem', color: C.charcoal }}>Size</span>
                  <button
                    onClick={() => setActiveTab('sizing')}
                    className="p-0 cursor-pointer underline"
                    style={{ background: 'none', border: 'none', fontFamily: UI, fontSize: '0.775rem', color: C.indigo }}>
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {uniqueSizes.map(s => {
                    const available = product.variants.some(v => v.size === s && v.color === selectedColor && v.inStock);
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className="min-w-[46px] py-2 px-3 cursor-pointer"
                        style={{
                          border: selectedSize === s ? `2px solid ${C.gold}` : '1px solid rgba(43,35,32,0.18)',
                          backgroundColor: selectedSize === s ? 'rgba(212,169,78,0.07)' : 'transparent',
                          color: available ? C.charcoal : 'rgba(43,35,32,0.35)',
                          textDecoration: available ? 'none' : 'line-through',
                          fontFamily: UI, fontSize: '0.825rem',
                          transition: 'border-color 0.15s, background 0.15s', outline: 'none',
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {hasVariableColors && (
              <div className="mb-7">
                <div className="mb-3.5" style={{ ...label, fontSize: '0.58rem', color: C.charcoal }}>
                  Colour: <span style={{ fontWeight: 400, color: 'rgba(43,35,32,0.6)' }}>{selectedColor}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => {
                    const available = product.variants.some(v => v.color === c && v.size === selectedSize && v.inStock);
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className="py-2 px-4 cursor-pointer"
                        style={{
                          border: selectedColor === c ? `2px solid ${C.gold}` : '1px solid rgba(43,35,32,0.18)',
                          backgroundColor: selectedColor === c ? 'rgba(212,169,78,0.07)' : 'transparent',
                          color: available ? C.charcoal : 'rgba(43,35,32,0.35)',
                          textDecoration: available ? 'none' : 'line-through',
                          fontFamily: UI, fontSize: '0.825rem',
                          transition: 'border-color 0.15s, background 0.15s', outline: 'none',
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-[1.125rem]">
              <span className="w-2 h-2 rounded-full shrink-0" style={{
                backgroundColor: isSoldOut ? 'rgba(43,35,32,0.25)' : isMTO ? C.gold : C.teal,
                boxShadow: isSoldOut ? 'none' : `0 0 0 3px ${isMTO ? 'rgba(212,169,78,0.15)' : 'rgba(59,138,147,0.15)'}`,
              }} />
              <span style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.charcoal }}>
                {isSoldOut ? 'Sold Out — join the waitlist' : isMTO ? 'Made to Order — ships in 5–7 business days' : 'In Stock — ready to ship'}
              </span>
            </div>

            {/* Estimated delivery */}
            <div className="mb-8 py-3.5 px-[1.125rem]" style={{ backgroundColor: 'rgba(59,138,147,0.055)', borderLeft: `2.5px solid ${C.teal}` }}>
              <div className="mb-2" style={{ ...label, color: C.charcoal, fontSize: '0.57rem', letterSpacing: '0.13em' }}>Estimated Delivery</div>
              <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.75 }}>
                Canada / US / UK: 7–10 business days<br />
                Nigeria: 2–4 business days
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="mb-3.5">
              <div className="mb-3" style={{ ...label, fontSize: '0.57rem', color: C.charcoal, letterSpacing: '0.13em' }}>Quantity</div>
              <div className="flex gap-3">
                {/* Stepper */}
                <div className="flex h-[50px] shrink-0" style={{ border: '1px solid rgba(43,35,32,0.18)' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-[46px] flex items-center justify-center cursor-pointer" style={{ background: 'none', border: 'none', color: C.charcoal, fontSize: '1.15rem' }}>−</button>
                  <span className="w-[42px] flex items-center justify-center" style={{ fontFamily: UI, fontSize: '0.9375rem', color: C.charcoal, borderLeft: '1px solid rgba(43,35,32,0.12)', borderRight: '1px solid rgba(43,35,32,0.12)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-[46px] flex items-center justify-center cursor-pointer" style={{ background: 'none', border: 'none', color: C.charcoal, fontSize: '1.15rem' }}>+</button>
                </div>
                {/* Add to Cart */}
                <button
                  onClick={addToCart}
                  disabled={!canBuy}
                  className={`flex-1 h-[50px] ${canBuy ? 'shimmer-cta' : ''}`}
                  style={{
                    backgroundColor: !canBuy ? 'rgba(43,35,32,0.08)' : justAdded ? C.teal : C.gold,
                    color: !canBuy ? 'rgba(43,35,32,0.3)' : justAdded ? C.cream : C.charcoal,
                    border: 'none', ...label, fontSize: '0.68rem', letterSpacing: '0.17em',
                    cursor: !canBuy ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s, color 0.2s',
                  }}
                >
                  {isSoldOut ? 'Sold Out' : !canBuy ? 'Unavailable' : justAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>

                {/* Save to wishlist */}
                <button
                  onClick={toggleSaved}
                  title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={saved}
                  className="w-[50px] h-[50px] shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    border: `1.5px solid ${C.maroon}`,
                    backgroundColor: saved ? C.maroon : 'transparent',
                    color: saved ? C.cream : C.maroon,
                    transition: 'background 0.18s, color 0.18s',
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                {/* Share button */}
                <button
                  onClick={() => setShareOpen(true)}
                  title="Share this product"
                  className="w-[50px] h-[50px] shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    border: `1.5px solid ${C.maroon}`,
                    backgroundColor: 'transparent',
                    color: C.maroon,
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
            <div className="text-center mb-8">
              <Link to="/custom-order" className="no-underline pb-[1px]" style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.indigo, borderBottom: `1px solid ${C.indigo}` }}>
                Request Custom Size →
              </Link>
            </div>

            {/* Trust row */}
            <div className="pt-6 flex gap-6 flex-wrap" style={{ borderTop: '1px solid rgba(43,35,32,0.08)' }}>
              {[
                { mark: '🔒', text: 'Escrow-protected payment' },
                { mark: '✦', text: 'Authentic Yoruba craft' },
                { mark: '↩', text: 'Easy 14-day returns' },
              ].map(({ mark, text }) => (
                <div key={text} className="flex items-center gap-[0.4rem]">
                  <span style={{ fontSize: '0.875rem' }}>{mark}</span>
                  <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.55)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="pb-20" style={{ borderTop: '1px solid rgba(43,35,32,0.09)' }}>
          {/* Tab nav */}
          <div className="flex mb-12" style={{ borderBottom: '1px solid rgba(43,35,32,0.09)' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="py-5 px-8 mb-[-1px] cursor-pointer"
                style={{
                  ...label, fontSize: '0.605rem', letterSpacing: '0.14em',
                  color: activeTab === tab.key ? C.charcoal : 'rgba(43,35,32,0.4)',
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab.key ? `2px solid ${C.gold}` : '2px solid transparent',
                  transition: 'color 0.18s, border-color 0.18s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-[700px]">
            {/* Description */}
            {activeTab === 'description' && (
              <div>
                <p className="mb-5" style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)' }}>
                  The {product.title} is a handcrafted piece made with premium materials sourced and finished in Nigeria. Each one is individually sewn and inspected before shipping — reflecting the standard of quality AdeClassics has maintained since its founding.
                </p>
                <p className="mb-5" style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)' }}>
                  This {product.category.toLowerCase()} is constructed using traditional techniques passed down through generations of Yoruba craftspeople. The rich tones and textures are a direct result of careful material selection and hand-finishing — no shortcuts, no compromises.
                </p>
                <div className="mt-9">
                  <div className="mb-4" style={{ ...label, color: C.charcoal, fontSize: '0.58rem', letterSpacing: '0.14em' }}>Materials & Care</div>
                  <ul className="m-0 pl-5" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)' }}>
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
                <p className="mb-7" style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.75, color: 'rgba(43,35,32,0.72)' }}>
                  {isHeadwear
                    ? 'Measure your head circumference at its widest point — approximately 1 cm above the eyebrows and ears. When between sizes, we recommend sizing up.'
                    : isFootwear
                    ? 'Measure the length of your foot from heel to longest toe. Our lasts run true to EU sizing — if between sizes, size up.'
                    : 'For garments, measure your chest at its fullest point and your natural waist. All garments include a 2 cm seam allowance. For custom measurements, use the Request Custom Size link above.'}
                </p>
                <div className="table-scroll">
                  <table className="w-full min-w-[420px]" style={{ borderCollapse: 'collapse', fontFamily: UI, fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${C.gold}` }}>
                        {sizingHeaders.map(h => (
                          <th key={h} className="text-left py-3 pr-4 pl-0" style={{ color: C.charcoal, ...label, fontSize: '0.565rem', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizingRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(43,35,32,0.07)', backgroundColor: i % 2 === 1 ? 'rgba(43,35,32,0.02)' : 'transparent' }}>
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 pr-4 pl-0" style={{ color: j === 0 ? C.charcoal : 'rgba(43,35,32,0.65)', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
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
                <div className="mb-9">
                  <div className="mb-4" style={{ ...label, color: C.charcoal, fontSize: '0.58rem', letterSpacing: '0.14em' }}>Shipping</div>
                  <ul className="m-0 pl-5" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)' }}>
                    <li>Canada / US / UK: standard 7–10 business days; express 3–5 days</li>
                    <li>Nigeria: 2–4 business days via our Lagos fulfilment partner</li>
                    <li>All other countries: 10–18 business days</li>
                    <li>Free standard shipping on all orders over CAD $200</li>
                    <li>All parcels are fully tracked and insured at no extra cost</li>
                  </ul>
                </div>
                <div>
                  <div className="mb-4" style={{ ...label, color: C.charcoal, fontSize: '0.58rem', letterSpacing: '0.14em' }}>Returns</div>
                  <ul className="m-0 pl-5" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 2.1, color: 'rgba(43,35,32,0.7)' }}>
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

      {/* Reviews section intentionally omitted until real reviews are wired. */}

      {/* ── RELATED PRODUCTS ── */}
      <section style={{ borderTop: '1px solid rgba(43,35,32,0.09)' }}>
        <div className="max-w-[1440px] mx-auto py-20 px-10">
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal }}>
              You May Also Like.
            </h2>
            <Link to="/shop" className="no-underline" style={{ ...label, color: C.indigo, fontSize: '0.64rem' }}>View All →</Link>
          </div>
          <div className="pdp-related-grid grid grid-cols-4 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.slug}`} className="product-card no-underline block" style={{ color: C.charcoal }}>
                <div className="relative mb-4 overflow-hidden aspect-[3/4]" style={{ backgroundColor: '#ddd5c8' }}>
                  <img className="product-img w-full h-full object-cover block" src={p.imageUrl} alt={p.title} />
                  <span className="absolute top-3 left-3 py-[3px] px-[8px]" style={{ backgroundColor: p.tag === 'NEW' ? C.maroon : C.charcoal, color: C.cream, ...label, fontSize: '0.56rem', letterSpacing: '0.12em' }}>
                    {p.tag}
                  </span>
                  <div className="product-overlay">
                    <div className="product-overlay-btns">
                      <button onClick={e => e.preventDefault()} className="flex-1 cursor-pointer py-[0.55rem]" style={{ border: '1px solid rgba(250,246,240,0.55)', color: C.cream, background: 'transparent', ...label, fontSize: '0.585rem', letterSpacing: '0.12em', backdropFilter: 'blur(4px)' }}>
                        Quick View
                      </button>
                      <button
                        onClick={e => {
                          // The card is a link; adding should not also navigate.
                          e.preventDefault();
                          add({
                            productId: p.id,
                            slug: p.slug,
                            title: p.title,
                            size: p.variants[0]?.size ?? 'One Size',
                            color: p.colors[0] ?? '',
                            unitPriceCents: Math.round(p.priceCad * 100),
                            imageUrl: p.imageUrl,
                          });
                        }}
                        className="flex-1 cursor-pointer py-[0.55rem]"
                        style={{ border: 'none', color: C.charcoal, background: C.gold, ...label, fontSize: '0.585rem', letterSpacing: '0.12em' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-2" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4 }}>{p.title}</div>
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
          baseUrl={shareBaseUrl}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
