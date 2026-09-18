'use client';

import { Suspense, useState, useMemo } from 'react';
import { Link, useSearchParams } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { SlidersIcon, GridIcon, ListIcon, XIcon } from '../icons';
import { useCart } from '@/lib/cart';
import { swatchFor } from '../data/products';
import type { CatalogueProduct, CatalogueCollection } from '@/server/catalogue';
import PromoCarousel, { type Promo } from '../components/PromoCarousel';

const fmt = (num: number, prefix: string) => `${prefix}${num.toLocaleString()}`;

// ── Live promotions ───────────────────────────────────────────────────────────
// Shaped like the Banner rows in prisma/schema.prisma. Each promo borrows its
// image, title and price from the product it advertises, so a slide can never
// show a price the product page contradicts.

const PROMO_SOURCES: { slug: string; badge: string; text: string; subtext: string; ctaLabel: string }[] = [
  {
    slug: 'aso-oke-gele-ivory-gold-set', badge: '20% off',
    text: 'Aso-oke, woven to be worn again',
    subtext: 'Our hand-woven Gele sets are 20% off through the end of the month with code ASOKEVIP.',
    ctaLabel: 'Shop Gele',
  },
  {
    slug: 'gobi-fila-cap-burgundy-velvet', badge: '10% off first order',
    text: 'Your first cap, on us — almost',
    subtext: 'New here? Code WELCOME10 takes 10% off anything in the collection.',
    ctaLabel: 'Shop Filà',
  },
  {
    slug: 'embroidered-agbada-kaftan', badge: 'Free shipping',
    text: 'Made to order, delivered free',
    subtext: 'Orders over CAD $258 ship free worldwide with code FREESHIP25.',
    ctaLabel: 'Shop Kaftans',
  },
  {
    slug: 'damask-gele-teal-coral', badge: '15% off',
    text: 'Damask Gele, in every colour',
    subtext: 'Fifteen percent off the full Gele range with code GELE15 while stock lasts.',
    ctaLabel: 'Shop the offer',
  },
];

function buildPromos(products: CatalogueProduct[]): Promo[] {
  return PROMO_SOURCES.flatMap(src => {
    const product = products.find(p => p.slug === src.slug);
    if (!product) return [];
    return [{
      id: `promo-${product.id}`,
      badge: src.badge,
      text: src.text,
      subtext: src.subtext,
      ctaLabel: src.ctaLabel,
      ctaHref: `/product/${product.slug}`,
      imageUrl: product.imageUrl,
      productTitle: product.title,
      productPriceCad: product.priceCad,
    }];
  });
}

// ── Filter sidebar ────────────────────────────────────────────────────────────

interface SidebarProps {
  collections: CatalogueCollection[];
  colors: string[];
  selectedCats: string[];
  onCat: (c: string) => void;
  priceMax: number;
  onPriceMax: (v: number) => void;
  selectedColors: string[];
  onColor: (c: string) => void;
  availability: string[];
  onAvail: (a: string) => void;
  onClear: () => void;
  onClose?: () => void;
}

// Layout for a filter section heading; colour/type stay in sectionHead.
const SECTION_HEAD_CLS = 'mb-3.5 pb-2';

function Sidebar({ collections, colors, selectedCats, onCat, priceMax, onPriceMax, selectedColors, onColor, availability, onAvail, onClear, onClose }: SidebarProps) {
  const sectionHead: React.CSSProperties = {
    ...label, fontSize: '0.595rem', color: C.charcoal,
    letterSpacing: '0.14em', borderBottom: '1px solid rgba(43,35,32,0.08)',
  };

  const checkRow = (checked: boolean, lbl: string, onChange: () => void) => (
    <label key={lbl} className="flex items-center gap-2.5 cursor-pointer mb-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor: C.maroon }} />
      <span style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.charcoal }}>{lbl}</span>
    </label>
  );

  const hasFilters = selectedCats.length > 0 || selectedColors.length > 0 || availability.length > 0 || priceMax < 350;

  return (
    <div className="flex flex-col gap-8">
      {/* Header row */}
      <div className="flex justify-between items-center">
        <span style={{ ...label, fontSize: '0.68rem', color: C.charcoal }}>Filters</span>
        <div className="flex gap-4 items-center">
          {hasFilters && (
            <button onClick={onClear} className="p-0 cursor-pointer" style={{ background: 'none', border: 'none', color: C.indigo, fontFamily: UI, fontSize: '0.775rem' }}>
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="flex p-[2px] cursor-pointer" style={{ background: 'none', border: 'none', color: C.charcoal }}><XIcon /></button>
          )}
        </div>
      </div>

      {/* Category, grouped by the collection each one belongs to */}
      {collections.map(collection => (
        <div key={collection.slug}>
          <div className={SECTION_HEAD_CLS} style={sectionHead}>{collection.name}</div>
          {collection.categories.map(c => checkRow(selectedCats.includes(c), c, () => onCat(c)))}
        </div>
      ))}

      {/* Price range */}
      <div>
        <div className={SECTION_HEAD_CLS} style={sectionHead}>Price</div>
        <div className="flex justify-between mb-2">
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.55)' }}>CAD $0</span>
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: C.charcoal, fontWeight: 500 }}>up to CAD ${priceMax}</span>
        </div>
        <input
          type="range" min={50} max={350} step={10} value={priceMax}
          onChange={e => onPriceMax(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor: C.maroon }}
        />
      </div>

      {/* Availability */}
      <div>
        <div className={SECTION_HEAD_CLS} style={sectionHead}>Availability</div>
        {['In Stock', 'Made to Order'].map(a => checkRow(availability.includes(a), a, () => onAvail(a)))}
      </div>

      {/* Color */}
      <div>
        <div className={SECTION_HEAD_CLS} style={sectionHead}>Colour</div>
        <div className="flex flex-wrap gap-2">
          {colors.map(col => {
            const active = selectedColors.includes(col);
            const bg = swatchFor(col);
            return (
              <button
                key={col}
                onClick={() => onColor(col)}
                title={col}
                className="w-6 h-6 rounded-full cursor-pointer p-0 shrink-0"
                style={{
                  background: bg, border: active ? `2px solid ${C.charcoal}` : '2px solid transparent',
                  outline: active ? `2px solid ${C.gold}` : '2px solid transparent',
                  outlineOffset: '1px',
                  transition: 'outline 0.15s',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({ p, view }: { p: CatalogueProduct; view: 'grid' | 'list' }) {
  const [hovered, setHovered] = useState(false);
  const { add } = useCart();

  if (view === 'list') {
    return (
      <Link to={`/product/${p.slug}`} className="flex gap-6 no-underline py-5" style={{ color: C.charcoal, borderBottom: '1px solid rgba(43,35,32,0.07)' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="w-[120px] shrink-0 aspect-[3/4] overflow-hidden relative" style={{ backgroundColor: '#ddd5c8' }}>
          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover block" style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
          <span className="absolute top-2 left-2 py-[2px] px-[6px]" style={{ backgroundColor: p.tag === 'NEW' ? C.maroon : C.charcoal, color: C.cream, ...label, fontSize: '0.52rem' }}>{p.tag}</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-[0.4rem]" style={{ fontFamily: UI, fontSize: '0.9375rem', color: C.charcoal }}>{p.title}</div>
          <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal }}>{fmt(p.priceCad, 'CAD $')}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${p.slug}`} className="product-card no-underline block" style={{ color: C.charcoal }}>
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
                // The whole card is a link to the product; adding shouldn't navigate.
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
      <div className="mb-2" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4, color: C.charcoal }}>{p.title}</div>
      <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>{fmt(p.priceCad, 'CAD $')}</div>
    </Link>
  );
}

// ── Shop page ─────────────────────────────────────────────────────────────────

function ShopContent({ products, collections, colors }: ShopProps) {
  const [selectedCats, setSelectedCats]   = useState<string[]>([]);
  const [priceMax, setPriceMax]           = useState(350);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [availability, setAvailability]   = useState<string[]>([]);
  const [sortBy, setSortBy]               = useState('newest');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen]       = useState(false);
  const [visibleCount, setVisibleCount]   = useState(12);

  // Set by the search field in the nav bar.
  const query = (useSearchParams()?.get('q') ?? '').trim().toLowerCase();

  const toggleArr = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const clearAll = () => {
    setSelectedCats([]); setSelectedColors([]); setAvailability([]); setPriceMax(350);
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (query) {
      // Match on title, category or colour so "gele", "indigo" and "kaftan"
      // all find something.
      r = r.filter(p =>
        `${p.title} ${p.category} ${p.colors.join(' ')}`.toLowerCase().includes(query)
      );
    }
    if (selectedCats.length)   r = r.filter(p => selectedCats.includes(p.category));
    r = r.filter(p => p.priceCad <= priceMax);
    if (selectedColors.length) r = r.filter(p => selectedColors.some(c => p.colors.includes(c)));
    if (availability.includes('In Stock') && !availability.includes('Made to Order'))
      r = r.filter(p => p.inStock && p.tag !== 'MADE TO ORDER');
    if (availability.includes('Made to Order') && !availability.includes('In Stock'))
      r = r.filter(p => p.tag === 'MADE TO ORDER');
    if (sortBy === 'price-asc')  r.sort((a, b) => a.priceCad - b.priceCad);
    if (sortBy === 'price-desc') r.sort((a, b) => b.priceCad - a.priceCad);
    return r;
  }, [products, query, selectedCats, priceMax, selectedColors, availability, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasFilters = selectedCats.length > 0 || selectedColors.length > 0 || availability.length > 0 || priceMax < 350;

  const sidebarProps: SidebarProps = {
    collections, colors,
    selectedCats, onCat: c => setSelectedCats(prev => toggleArr(prev, c)),
    priceMax, onPriceMax: setPriceMax,
    selectedColors, onColor: c => setSelectedColors(prev => toggleArr(prev, c)),
    availability, onAvail: a => setAvailability(prev => toggleArr(prev, a)),
    onClear: clearAll,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>

      {/* ── Running promotions ── */}
      <PromoCarousel promos={buildPromos(products)} />

      {/* ── Page header ── */}
      <div className="pt-12 px-10 pb-10 max-w-[1440px] mx-auto" style={{ borderBottom: '1px solid rgba(43,35,32,0.08)' }}>
        <div className="mb-3.5" style={{ ...label, color: 'rgba(43,35,32,0.4)', fontSize: '0.58rem', letterSpacing: '0.14em' }}>
          <a href="/" className="no-underline" style={{ color: 'inherit' }}>Home</a>
          <span className="mx-2" style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: C.charcoal }}>Shop</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, lineHeight: 1.05 }}>
              {query ? `“${query}”` : selectedCats.length === 1 ? selectedCats[0] : 'Shop All'}
            </h1>
            <p className="mt-[0.4rem] mx-0 mb-0" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.45)' }}>
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Sort + view — desktop */}
          <div className="shop-topbar-controls flex items-center gap-4">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="py-2 pl-3.5 pr-7 cursor-pointer appearance-none"
              style={{ fontFamily: UI, fontSize: '0.775rem', color: C.charcoal, border: '1px solid rgba(43,35,32,0.15)', backgroundColor: C.cream, outline: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%232B2320\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center' }}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low – High</option>
              <option value="price-desc">Price: High – Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
            <div className="flex" style={{ border: '1px solid rgba(43,35,32,0.15)' }}>
              {(['grid', 'list'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} className="flex py-2 px-2.5 cursor-pointer" style={{ background: viewMode === m ? C.charcoal : 'none', color: viewMode === m ? C.cream : C.charcoal, border: 'none', lineHeight: 0, transition: 'background 0.15s' }}>
                  {m === 'grid' ? <GridIcon /> : <ListIcon />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex gap-2 flex-wrap mt-5">
            {selectedCats.map(c => (
              <button key={c} onClick={() => setSelectedCats(prev => prev.filter(x => x !== c))} className="flex items-center gap-1.5 py-[4px] px-[10px] cursor-pointer" style={{ border: `1px solid ${C.maroon}`, color: C.maroon, backgroundColor: 'transparent', ...label, fontSize: '0.575rem' }}>
                {c} <XIcon />
              </button>
            ))}
            {selectedColors.map(c => (
              <button key={c} onClick={() => setSelectedColors(prev => prev.filter(x => x !== c))} className="flex items-center gap-1.5 py-[4px] px-[10px] cursor-pointer" style={{ border: '1px solid rgba(43,35,32,0.2)', color: C.charcoal, backgroundColor: 'transparent', ...label, fontSize: '0.575rem' }}>
                {c} <XIcon />
              </button>
            ))}
            {priceMax < 350 && (
              <button onClick={() => setPriceMax(350)} className="flex items-center gap-1.5 py-[4px] px-[10px] cursor-pointer" style={{ border: '1px solid rgba(43,35,32,0.2)', color: C.charcoal, backgroundColor: 'transparent', ...label, fontSize: '0.575rem' }}>
                Up to CAD ${priceMax} <XIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Layout: sidebar + grid ── */}
      <div className="max-w-[1440px] mx-auto pt-10 px-10 pb-24 flex gap-14 items-start">

        {/* Desktop sidebar */}
        <aside className="shop-sidebar w-[220px] shrink-0 sticky top-[86px]">
          <Sidebar {...sidebarProps} />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile filter button */}
          <div className="shop-mobile-filter hidden mb-5">
            <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 py-[0.6rem] px-[1.125rem] cursor-pointer" style={{ border: `1px solid rgba(43,35,32,0.2)`, backgroundColor: 'transparent', color: C.charcoal, ...label, fontSize: '0.65rem' }}>
              <SlidersIcon /> Filters {hasFilters ? `(${selectedCats.length + selectedColors.length + (priceMax < 350 ? 1 : 0)})` : ''}
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 px-8">
              <p className="mb-4" style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(43,35,32,0.5)' }}>
                No products match your filters.
              </p>
              <button onClick={clearAll} className="p-0 cursor-pointer underline" style={{ background: 'none', border: 'none', color: C.gold, fontFamily: UI, fontSize: '0.875rem', fontWeight: 500 }}>
                Clear filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="shop-grid grid grid-cols-4 gap-6">
              {visible.map(p => <ProductCard key={p.id} p={p} view="grid" />)}
            </div>
          ) : (
            <div>
              {visible.map(p => <ProductCard key={p.id} p={p} view="list" />)}
            </div>
          )}

          {/* Pagination / Load More */}
          {filtered.length > 0 && (
            <div className="mt-14 text-center">
              <p className="mb-5" style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.45)' }}>
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products
              </p>
              {hasMore ? (
                <button onClick={() => setVisibleCount(v => v + 12)} className="shimmer-cta cursor-pointer py-3.5 px-10" style={{ border: `1.5px solid ${C.maroon}`, color: C.maroon, backgroundColor: 'transparent', ...label, fontSize: '0.68rem', letterSpacing: '0.14em' }}>
                  Load More
                </button>
              ) : (
                <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.35)' }}>You've seen everything.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[200]">
          <div onClick={() => setFilterOpen(false)} className="absolute inset-0" style={{ backgroundColor: 'rgba(43,35,32,0.45)' }} />
          <div className="absolute top-0 left-0 bottom-0 w-[min(340px,90vw)] p-8 overflow-y-auto" style={{ backgroundColor: C.cream }}>
            <Sidebar {...sidebarProps} onClose={() => setFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export type ShopProps = {
  products: CatalogueProduct[];
  collections: CatalogueCollection[];
  colors: string[];
};

export default function Shop(props: ShopProps) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: C.cream }} />}>
      <ShopContent {...props} />
    </Suspense>
  );
}
