'use client';

import { useMemo } from 'react';
import { Link, useParams } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { slugify } from '@/lib/slug';
import { ALL_PRODUCTS, COLLECTIONS, type Product } from '../data/products';

function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/product/${slugify(p.title)}`} style={{ textDecorationLine: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', backgroundColor: 'rgba(43,35,32,0.05)', marginBottom: '0.75rem' }}>
        <img
          src={`https://images.unsplash.com/${p.img}?w=600&h=800&fit=crop&auto=format`}
          alt={p.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          ...label, fontSize: '0.55rem', padding: '0.3rem 0.5rem',
          backgroundColor: p.tag === 'SOLD OUT' ? 'rgba(43,35,32,0.82)' : C.maroon,
          color: C.cream,
        }}>
          {p.tag}
        </span>
      </div>
      <div style={{ fontFamily: UI, fontSize: '0.85rem', color: C.charcoal, lineHeight: 1.4 }}>{p.title}</div>
      <div style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 600, color: C.charcoal, marginTop: '0.2rem' }}>
        CAD ${p.cadNum.toLocaleString()}
      </div>
    </Link>
  );
}

export default function CollectionPage() {
  const { slug } = useParams();
  const collection = COLLECTIONS.find(c => c.slug === slug);

  const grouped = useMemo(() => {
    if (!collection) return [];
    return collection.categories.map(name => ({
      name,
      products: ALL_PRODUCTS.filter(p => p.category === name),
    }));
  }, [collection]);

  if (!collection) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: '1.75rem', color: C.charcoal, margin: 0 }}>Collection not found</h1>
          <Link to="/shop" style={{ fontFamily: UI, fontSize: '0.85rem', color: C.maroon, marginTop: '1rem', display: 'inline-block' }}>
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const total = grouped.reduce((n, g) => n + g.products.length, 0);

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>

      {/* ── Collection masthead ── */}
      <header style={{ backgroundColor: C.maroon, color: C.cream }}>
        <div className="collection-masthead">
          <div style={{ ...label, color: C.gold, fontSize: '0.58rem', letterSpacing: '0.16em' }}>
            {collection.tagline}
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.025em', margin: '0.6rem 0 0', lineHeight: 1.05 }}>
            {collection.name}
          </h1>
          <p style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(250,246,240,0.76)', margin: '1rem 0 0', maxWidth: '54ch' }}>
            {collection.blurb}
          </p>
          <div style={{ ...label, color: 'rgba(250,246,240,0.5)', fontSize: '0.58rem', marginTop: '1.25rem' }}>
            {total} {total === 1 ? 'piece' : 'pieces'} · {collection.categories.length} categories
          </div>
        </div>
      </header>

      {/* ── Category jump links ── */}
      <nav className="collection-jump" aria-label="Categories in this collection">
        {collection.categories.map(name => (
          <a key={name} href={`#${name.replace(/\s+/g, '-').toLowerCase()}`} className="collection-chip">
            {name}
          </a>
        ))}
      </nav>

      {/* ── One block per category ── */}
      <div className="collection-body">
        {grouped.map(({ name, products }) => (
          <section key={name} id={name.replace(/\s+/g, '-').toLowerCase()} style={{ marginBottom: '3.5rem', scrollMarginTop: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(43,35,32,0.1)' }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 400, color: C.charcoal, margin: 0, letterSpacing: '-0.015em' }}>
                {name}
              </h2>
              <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)' }}>
                {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {products.length > 0 ? (
              <div className="rg-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {products.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <p style={{ fontFamily: UI, fontSize: '0.85rem', color: 'rgba(43,35,32,0.45)', margin: 0, padding: '1.5rem 0' }}>
                Nothing in {name} yet — new pieces are added as they come off the block.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
