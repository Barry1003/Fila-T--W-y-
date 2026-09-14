'use client';

import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { useCart } from '@/lib/cart';
import type { CatalogueProduct, CatalogueCollection } from '@/server/catalogue';

function ProductCard({ p }: { p: CatalogueProduct }) {
  const { add } = useCart();

  return (
    <Link to={`/product/${p.slug}`} className="product-card no-underline block" style={{ color: 'inherit' }}>
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ backgroundColor: 'rgba(43,35,32,0.05)' }}>
        <img
          src={p.imageUrl}
          alt={p.title}
          loading="lazy"
          className="product-img w-full h-full object-cover block"
        />
        {p.tag && (
          <span
            className="absolute top-3 left-3 py-[0.3rem] px-2"
            style={{
              ...label, fontSize: '0.55rem',
              backgroundColor: p.tag === 'SOLD OUT' ? 'rgba(43,35,32,0.82)' : C.maroon,
              color: C.cream,
            }}
          >
            {p.tag}
          </span>
        )}

        {/* Reveals on hover — same Quick View / Add to Cart as the shop grid. */}
        <div className="product-overlay">
          <div className="product-overlay-btns">
            <button
              onClick={e => e.preventDefault()}
              className="flex-1 cursor-pointer py-[0.55rem]"
              style={{ border: '1px solid rgba(250,246,240,0.55)', color: C.cream, background: 'transparent', ...label, fontSize: '0.585rem', letterSpacing: '0.12em', backdropFilter: 'blur(4px)' }}
            >
              Quick View
            </button>
            <button
              onClick={e => {
                // The whole card is a link to the product; adding must not navigate.
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
      <div style={{ fontFamily: UI, fontSize: '0.85rem', color: C.charcoal, lineHeight: 1.4 }}>{p.title}</div>
      <div className="mt-[0.2rem]" style={{ fontFamily: UI, fontSize: '0.9rem', fontWeight: 600, color: C.charcoal }}>
        CAD ${p.priceCad.toLocaleString()}
      </div>
    </Link>
  );
}

export default function CollectionPage({ collection, products }: {
  collection: CatalogueCollection;
  products: CatalogueProduct[];
}) {
  const grouped = collection.categories.map(name => ({
    name,
    products: products.filter(p => p.category === name),
  }));

  const total = grouped.reduce((n, g) => n + g.products.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream }}>

      {/* ── Collection masthead ── */}
      <header style={{ backgroundColor: C.maroon, color: C.cream }}>
        <div className="collection-masthead">
          <div style={{ ...label, color: C.gold, fontSize: '0.58rem', letterSpacing: '0.16em' }}>
            {collection.tagline}
          </div>
          <h1 className="mt-[0.6rem] mx-0 mb-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            {collection.name}
          </h1>
          <p className="mt-4 mx-0 mb-0 max-w-[54ch]" style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(250,246,240,0.76)' }}>
            {collection.blurb}
          </p>
          <div className="mt-5" style={{ ...label, color: 'rgba(250,246,240,0.5)', fontSize: '0.58rem' }}>
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
          <section key={name} id={name.replace(/\s+/g, '-').toLowerCase()} className="mb-14 scroll-mt-[90px]">
            <div className="flex items-baseline justify-between gap-4 mb-5 pb-3" style={{ borderBottom: '1px solid rgba(43,35,32,0.1)' }}>
              <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.015em' }}>
                {name}
              </h2>
              <span style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)' }}>
                {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {products.length > 0 ? (
              <div className="collection-grid grid gap-6">
                {products.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <p className="m-0 py-6" style={{ fontFamily: UI, fontSize: '0.85rem', color: 'rgba(43,35,32,0.45)' }}>
                Nothing in {name} yet — new pieces are added as they come off the block.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
