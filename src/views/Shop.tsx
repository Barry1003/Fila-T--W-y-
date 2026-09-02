'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { SlidersIcon, GridIcon, ListIcon, XIcon } from '../icons';
import { ALL_PRODUCTS, ALL_CATEGORIES, ALL_COLORS, COLOR_HEX, type Product } from '../data/products';

const fmt = (num: number, prefix: string) => `${prefix}${num.toLocaleString()}`;

// ── Filter sidebar ────────────────────────────────────────────────────────────

interface SidebarProps {
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

function Sidebar({ selectedCats, onCat, priceMax, onPriceMax, selectedColors, onColor, availability, onAvail, onClear, onClose }: SidebarProps) {
  const sectionHead: React.CSSProperties = {
    ...label, fontSize: '0.595rem', color: C.charcoal, marginBottom: '0.875rem',
    letterSpacing: '0.14em', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(43,35,32,0.08)',
  };

  const checkRow = (checked: boolean, lbl: string, onChange: () => void) => (
    <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '0.5rem' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: C.maroon, width: '14px', height: '14px', cursor: 'pointer' }} />
      <span style={{ fontFamily: UI, fontSize: '0.8125rem', color: C.charcoal }}>{lbl}</span>
    </label>
  );

  const hasFilters = selectedCats.length > 0 || selectedColors.length > 0 || availability.length > 0 || priceMax < 350;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...label, fontSize: '0.68rem', color: C.charcoal }}>Filters</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {hasFilters && (
            <button onClick={onClear} style={{ background: 'none', border: 'none', color: C.indigo, fontFamily: UI, fontSize: '0.775rem', cursor: 'pointer', padding: 0 }}>
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.charcoal, display: 'flex', padding: '2px' }}><XIcon /></button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <div style={sectionHead}>Category</div>
        {ALL_CATEGORIES.map(c => checkRow(selectedCats.includes(c), c, () => onCat(c)))}
      </div>

      {/* Price range */}
      <div>
        <div style={sectionHead}>Price</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.55)' }}>CAD $0</span>
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: C.charcoal, fontWeight: 500 }}>up to CAD ${priceMax}</span>
        </div>
        <input
          type="range" min={50} max={350} step={10} value={priceMax}
          onChange={e => onPriceMax(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.maroon, cursor: 'pointer' }}
        />
      </div>

      {/* Availability */}
      <div>
        <div style={sectionHead}>Availability</div>
        {['In Stock', 'Made to Order'].map(a => checkRow(availability.includes(a), a, () => onAvail(a)))}
      </div>

      {/* Color */}
      <div>
        <div style={sectionHead}>Colour</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {ALL_COLORS.map(col => {
            const active = selectedColors.includes(col);
            const bg = COLOR_HEX[col];
            return (
              <button
                key={col}
                onClick={() => onColor(col)}
                title={col}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: bg, border: active ? `2px solid ${C.charcoal}` : '2px solid transparent',
                  outline: active ? `2px solid ${C.gold}` : '2px solid transparent',
                  outlineOffset: '1px',
                  cursor: 'pointer', padding: 0, flexShrink: 0,
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

function ProductCard({ p, view }: { p: Product; view: 'grid' | 'list' }) {
  const [hovered, setHovered] = useState(false);

  if (view === 'list') {
    return (
      <Link to={`/product/${p.id}`} style={{ display: 'flex', gap: '1.5rem', textDecorationLine: 'none', color: C.charcoal, padding: '1.25rem 0', borderBottom: '1px solid rgba(43,35,32,0.07)' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ width: '120px', flexShrink: 0, aspectRatio: '3/4', backgroundColor: '#ddd5c8', overflow: 'hidden', position: 'relative' }}>
          <img src={`https://images.unsplash.com/${p.img}?w=300&h=400&fit=crop&auto=format`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
          <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: p.tag === 'NEW' ? C.maroon : C.charcoal, color: C.cream, ...label, fontSize: '0.52rem', padding: '2px 6px' }}>{p.tag}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: UI, fontSize: '0.9375rem', marginBottom: '0.4rem', color: C.charcoal }}>{p.title}</div>
          <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal }}>{fmt(p.cadNum, 'CAD $')}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${p.id}`} className="product-card" style={{ textDecorationLine: 'none', color: C.charcoal, display: 'block' }}>
      <div style={{ position: 'relative', marginBottom: '1rem', backgroundColor: '#ddd5c8', overflow: 'hidden', aspectRatio: '3/4' }}>
        <img className="product-img" src={`https://images.unsplash.com/${p.img}?w=600&h=800&fit=crop&auto=format`} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
      <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, marginBottom: '0.5rem', lineHeight: 1.4, color: C.charcoal }}>{p.title}</div>
      <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>{fmt(p.cadNum, 'CAD $')}</div>
    </Link>
  );
}

// ── Shop page ─────────────────────────────────────────────────────────────────

export default function Shop() {
  const [selectedCats, setSelectedCats]   = useState<string[]>([]);
  const [priceMax, setPriceMax]           = useState(350);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [availability, setAvailability]   = useState<string[]>([]);
  const [sortBy, setSortBy]               = useState('newest');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen]       = useState(false);
  const [visibleCount, setVisibleCount]   = useState(12);

  const toggleArr = <T,>(arr: T[], item: T) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const clearAll = () => {
    setSelectedCats([]); setSelectedColors([]); setAvailability([]); setPriceMax(350);
  };

  const filtered = useMemo(() => {
    let r = [...ALL_PRODUCTS];
    if (selectedCats.length)   r = r.filter(p => selectedCats.includes(p.category));
    r = r.filter(p => p.cadNum <= priceMax);
    if (selectedColors.length) r = r.filter(p => selectedColors.includes(p.color));
    if (availability.includes('In Stock') && !availability.includes('Made to Order'))
      r = r.filter(p => p.inStock && p.tag !== 'MADE TO ORDER');
    if (availability.includes('Made to Order') && !availability.includes('In Stock'))
      r = r.filter(p => p.tag === 'MADE TO ORDER');
    if (sortBy === 'price-asc')  r.sort((a, b) => a.cadNum - b.cadNum);
    if (sortBy === 'price-desc') r.sort((a, b) => b.cadNum - a.cadNum);
    return r;
  }, [selectedCats, priceMax, selectedColors, availability, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasFilters = selectedCats.length > 0 || selectedColors.length > 0 || availability.length > 0 || priceMax < 350;

  const sidebarProps: SidebarProps = {
    selectedCats, onCat: c => setSelectedCats(prev => toggleArr(prev, c)),
    priceMax, onPriceMax: setPriceMax,
    selectedColors, onColor: c => setSelectedColors(prev => toggleArr(prev, c)),
    availability, onAvail: a => setAvailability(prev => toggleArr(prev, a)),
    onClear: clearAll,
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div style={{ borderBottom: '1px solid rgba(43,35,32,0.08)', padding: '3rem 2.5rem 2.5rem', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ ...label, color: 'rgba(43,35,32,0.4)', fontSize: '0.58rem', marginBottom: '0.875rem', letterSpacing: '0.14em' }}>
          <a href="/" style={{ color: 'inherit', textDecorationLine: 'none' }}>Home</a>
          <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>/</span>
          <span style={{ color: C.charcoal }}>Shop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, margin: 0, lineHeight: 1.05 }}>
              {selectedCats.length === 1 ? selectedCats[0] : 'Shop All'}
            </h1>
            <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.45)', margin: '0.4rem 0 0' }}>
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Sort + view — desktop */}
          <div className="shop-topbar-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ fontFamily: UI, fontSize: '0.775rem', color: C.charcoal, border: '1px solid rgba(43,35,32,0.15)', backgroundColor: C.cream, padding: '0.5rem 0.875rem', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '1.75rem', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%232B2320\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center' }}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low – High</option>
              <option value="price-desc">Price: High – Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
            <div style={{ display: 'flex', border: '1px solid rgba(43,35,32,0.15)' }}>
              {(['grid', 'list'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{ background: viewMode === m ? C.charcoal : 'none', color: viewMode === m ? C.cream : C.charcoal, border: 'none', padding: '0.5rem 0.625rem', cursor: 'pointer', display: 'flex', lineHeight: 0, transition: 'background 0.15s' }}>
                  {m === 'grid' ? <GridIcon /> : <ListIcon />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {selectedCats.map(c => (
              <button key={c} onClick={() => setSelectedCats(prev => prev.filter(x => x !== c))} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', border: `1px solid ${C.maroon}`, color: C.maroon, backgroundColor: 'transparent', ...label, fontSize: '0.575rem', padding: '4px 10px', cursor: 'pointer' }}>
                {c} <XIcon />
              </button>
            ))}
            {selectedColors.map(c => (
              <button key={c} onClick={() => setSelectedColors(prev => prev.filter(x => x !== c))} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', border: '1px solid rgba(43,35,32,0.2)', color: C.charcoal, backgroundColor: 'transparent', ...label, fontSize: '0.575rem', padding: '4px 10px', cursor: 'pointer' }}>
                {c} <XIcon />
              </button>
            ))}
            {priceMax < 350 && (
              <button onClick={() => setPriceMax(350)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', border: '1px solid rgba(43,35,32,0.2)', color: C.charcoal, backgroundColor: 'transparent', ...label, fontSize: '0.575rem', padding: '4px 10px', cursor: 'pointer' }}>
                Up to CAD ${priceMax} <XIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Layout: sidebar + grid ── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2.5rem 6rem', display: 'flex', gap: '3.5rem', alignItems: 'flex-start' }}>

        {/* Desktop sidebar */}
        <aside className="shop-sidebar" style={{ width: '220px', flexShrink: 0, position: 'sticky', top: '86px' }}>
          <Sidebar {...sidebarProps} />
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile filter button */}
          <div className="shop-mobile-filter" style={{ display: 'none', marginBottom: '1.25rem' }}>
            <button onClick={() => setFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: `1px solid rgba(43,35,32,0.2)`, backgroundColor: 'transparent', color: C.charcoal, ...label, fontSize: '0.65rem', padding: '0.6rem 1.125rem', cursor: 'pointer' }}>
              <SlidersIcon /> Filters {hasFilters ? `(${selectedCats.length + selectedColors.length + (priceMax < 350 ? 1 : 0)})` : ''}
            </button>
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <p style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(43,35,32,0.5)', marginBottom: '1rem' }}>
                No products match your filters.
              </p>
              <button onClick={clearAll} style={{ background: 'none', border: 'none', color: C.gold, fontFamily: UI, fontSize: '0.875rem', cursor: 'pointer', textDecorationLine: 'underline', fontWeight: 500 }}>
                Clear filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              {visible.map(p => <ProductCard key={p.id} p={p} view="grid" />)}
            </div>
          ) : (
            <div>
              {visible.map(p => <ProductCard key={p.id} p={p} view="list" />)}
            </div>
          )}

          {/* Pagination / Load More */}
          {filtered.length > 0 && (
            <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
              <p style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.45)', marginBottom: '1.25rem' }}>
                Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products
              </p>
              {hasMore ? (
                <button onClick={() => setVisibleCount(v => v + 12)} className="shimmer-cta" style={{ border: `1.5px solid ${C.maroon}`, color: C.maroon, backgroundColor: 'transparent', ...label, padding: '0.875rem 2.5rem', cursor: 'pointer', fontSize: '0.68rem', letterSpacing: '0.14em' }}>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setFilterOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(43,35,32,0.45)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 'min(340px, 90vw)', backgroundColor: C.cream, padding: '2rem', overflowY: 'auto' }}>
            <Sidebar {...sidebarProps} onClose={() => setFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
