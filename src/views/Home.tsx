'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { slugify } from '@/lib/slug';
import type { HomeContent } from '@/server/content-schema';
import type { CatalogueProduct, CatalogueCollection } from '@/server/catalogue';
import HeroCarousel from '../components/HeroCarousel';
import { useCart } from '@/lib/cart';
import { ShieldIcon, BadgeIcon, GlobeIcon, ScissorsIcon, RulerIcon, DiamondIcon } from '../icons';

const catBgs = [
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
];

const craftsmanship = [
  { icon: <ScissorsIcon size={24} />, color: C.maroon, heading: 'Handmade',         body: 'Every piece is cut, sewn, and finished by hand. No factory shortcuts — each filà, gele, and kaftan carries the mark of the artisan who made it.' },
  { icon: <RulerIcon size={24} />, color: C.teal,   heading: 'Made to Order',    body: 'Many of our styles are crafted specifically for you after purchase. Your measurements, your colours, your occasion — made with intention.' },
  { icon: <DiamondIcon size={24} />, color: C.indigo, heading: 'Quality Materials', body: 'We source premium Aso-oke, velvet, and hand-dyed Adire. Materials are chosen for longevity — pieces meant to be kept, not discarded.' },
];

export type HomeProps = {
  content: HomeContent;
  products: CatalogueProduct[];
  collections: CatalogueCollection[];
};

export default function Home({ content, products, collections }: HomeProps) {
  const { add } = useCart();
  const newIn = products.slice(0, 8);

  // One tile per category that actually has stock, borrowing the first
  // product's photo. Derived from the products already loaded rather than
  // queried separately, and it cannot drift from the catalogue the way the old
  // hardcoded list did.
  const tiles = collections.flatMap(collection =>
    collection.categories.flatMap(name => {
      const first = products.find(p => p.category === name);
      return first ? [{ name, letter: name[0], imageUrl: first.imageUrl, href: `/collections/${collection.slug}` }] : [];
    })
  );
  const [promoDismissed, setPromoDismissed] = useState(false);

  return (
    <>
      {/* ── HERO ── */}
      <HeroCarousel slides={content.hero.slides} intervalSeconds={content.hero.intervalSeconds} />

      {/* ── PROMO STRIP ── */}
      {content.promo.enabled && !promoDismissed && (
        <div className="flex items-center justify-center relative py-[0.8rem] px-10" style={{ backgroundColor: C.charcoal, color: C.cream }}>
          <p className="m-0 text-center" style={{ ...label, fontSize: '0.64rem', letterSpacing: '0.12em' }}>
            {content.promo.text}
          </p>
          <button onClick={() => setPromoDismissed(true)} aria-label="Dismiss" className="absolute right-6 cursor-pointer py-[2px] px-[6px]" style={{ background: 'none', border: 'none', color: C.cream, fontSize: '1.1rem', opacity: 0.55, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* ── TRUST SIGNALS ── */}
      <div className="reveal" style={{ borderTop: '1px solid rgba(43,35,32,0.09)', borderBottom: '1px solid rgba(43,35,32,0.09)', backgroundColor: C.cream }}>
        <div className="trust-row max-w-[960px] mx-auto py-11 px-10 grid grid-cols-3 gap-8">
          {[
            { icon: <ShieldIcon />, lbl: 'Clear & Secure Checkout', href: '/escrow-protection' },
            { icon: <BadgeIcon />,  lbl: 'Quality Guaranteed' },
            { icon: <GlobeIcon />,  lbl: 'Worldwide Delivery' },
          ].map(({ icon, lbl, href }) => {
            const content = (
              <>
                <div style={{ color: C.teal, lineHeight: 0 }}>{icon}</div>
                <span className="text-center" style={{ ...label, fontSize: '0.63rem', color: C.charcoal }}>{lbl}</span>
              </>
            );
            return href ? (
              <Link key={lbl} to={href} className="flex flex-col items-center gap-3 no-underline cursor-pointer transition-opacity hover:opacity-75">
                {content}
              </Link>
            ) : (
              <div key={lbl} className="flex flex-col items-center gap-3">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      {tiles.length > 0 && (
      <section className="section-pad pt-16 px-10 pb-16 max-w-[1440px] mx-auto">
        <div className="reveal mb-11">
          <div className="mb-3" style={{ ...label, color: C.gold, fontSize: '0.62rem', letterSpacing: '0.2em' }}>Browse the House</div>
          <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal }}>
            Shop by Category
          </h2>
        </div>
        <div className="cat-grid reveal grid grid-cols-[repeat(auto-fill,minmax(172px,1fr))] gap-4">
          {tiles.map(({ letter, name, imageUrl, href }, i) => (
            <div key={name} className="flip-card cursor-pointer" style={{ aspectRatio: "3 / 4" }}>
              <div className="flip-card-inner">
                {/* Front — the gradient monogram */}
                <Link to={href} className="flip-card-front" style={{ backgroundColor: catBgs[i] }}>
                  <span className="cat-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cat-letter" data-letter={letter}>{letter}</span>
                  <span className="cat-foot">
                    <span className="cat-rule" aria-hidden />
                    <span className="cat-name">{name}</span>
                  </span>
                </Link>
                {/* Back — the product photo, revealed on flip */}
                <Link to={href} className="flip-card-back">
                  <img src={imageUrl} alt="" aria-hidden className="cat-back-img" loading="lazy" />
                  <span className="cat-back-scrim" aria-hidden />
                  <span className="cat-back-foot">
                    <span className="cat-back-name">{name}</span>
                    <span className="cat-back-go">Shop &rarr;</span>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── NEW IN ── */}
      {newIn.length > 0 && (
      <section className="section-pad pt-0 px-10 pb-16 max-w-[1440px] mx-auto">
        <div className="reveal flex items-baseline justify-between mb-11">
          <h2 className="m-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal }}>New In.</h2>
          <Link to="/shop" className="no-underline" style={{ ...label, color: C.indigo, fontSize: '0.65rem' }}>View All →</Link>
        </div>
        <div className="new-in-grid grid grid-cols-4 gap-6">
          {newIn.map(p => (
            <Link key={p.id} to={`/product/${slugify(p.title)}`} className="product-card no-underline block" style={{ color: C.charcoal }}>
              <div className="relative mb-4 overflow-hidden aspect-[3/4]" style={{ backgroundColor: '#ddd5c8' }}>
                <img className="product-img w-full h-full object-cover block" src={p.imageUrl} alt={p.title} style={{ objectPosition: p.imagePosition }} />
                {p.tag && (
                  <span className="absolute top-3 left-3 py-[3px] px-[8px]" style={{ backgroundColor: p.tag === 'NEW' ? C.maroon : p.tag === 'TRENDING' ? C.teal : C.charcoal, color: C.cream, ...label, fontSize: '0.56rem', letterSpacing: '0.12em' }}>
                    {p.tag}
                  </span>
                )}
                <div className="product-overlay">
                  <div className="product-overlay-btns">
                    <span className="flex-1 text-center py-[0.55rem]" style={{ border: '1px solid rgba(250,246,240,0.55)', color: C.cream, background: 'transparent', ...label, fontSize: '0.585rem', letterSpacing: '0.12em', backdropFilter: 'blur(4px)' }}>
                      View Details
                    </span>
                    {p.variants.length === 1 && p.variants[0].inStock && p.tag !== 'SOLD OUT' ? (
                      <button onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        add({ productId: p.id, slug: p.slug, title: p.title, size: p.variants[0].size, color: p.variants[0].color, unitPriceCents: Math.round(p.priceCad * 100), imageUrl: p.imageUrl });
                      }} className="flex-1 cursor-pointer py-[0.55rem]" style={{ border: 'none', color: C.charcoal, background: C.gold, ...label, fontSize: '0.585rem', letterSpacing: '0.12em' }}>
                        Add to Cart
                      </button>
                    ) : <span className="flex-1 text-center py-[0.55rem]" style={{ color: C.charcoal, background: C.gold, ...label, fontSize: '0.585rem', letterSpacing: '0.12em' }}>{p.tag === 'SOLD OUT' ? 'Sold Out' : 'Choose Options'}</span>}
                  </div>
                </div>
              </div>
              <div className="mb-[0.7rem]" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4, color: C.charcoal }}>{p.title}</div>
              <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>{`CAD $${p.priceCad.toLocaleString()}`}</div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* ── OUR CRAFTSMANSHIP ── */}
      <section className="section-pad py-16 px-10" style={{ backgroundColor: 'rgba(122,46,56,0.035)', borderTop: '1px solid rgba(43,35,32,0.08)', borderBottom: '1px solid rgba(43,35,32,0.08)' }}>
        <div className="max-w-[1200px] mx-auto">
          <h2 className="reveal mb-11" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal }}>Our Craftsmanship.</h2>
          <div className="craftsmanship-grid grid grid-cols-3 gap-6">
            {craftsmanship.map((c, i) => (
              <div key={c.heading} className="reveal p-10" data-delay={String(i + 1) as "1" | "2" | "3"} style={{ backgroundColor: C.cream, border: '1px solid rgba(43,35,32,0.08)' }}>
                <div className="w-13 h-13 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: c.color, color: C.cream, fontSize: '1.1rem' }}>{c.icon}</div>
                <div className="mb-3.5" style={{ fontFamily: DISPLAY, fontSize: '1.2rem', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.01em' }}>{c.heading}</div>
                <p className="m-0" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(43,35,32,0.7)' }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="section-pad max-w-[1440px] mx-auto py-20 px-10">
        <div className="story-grid grid grid-cols-2 gap-24 items-center">
          <div className="reveal-left relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#c8beb5' }}>
            <img src={content.story.imageUrl} alt="" className="w-full h-full object-cover block" style={{ objectPosition: 'center 30%' }} />
            <div className="absolute inset-5 pointer-events-none" style={{ border: '1px solid rgba(212,169,78,0.35)' }} />
          </div>
          <div className="reveal-right">
            <div className="mb-7" style={{ ...label, color: C.gold, fontSize: '0.625rem', letterSpacing: '0.17em' }}>Our Story</div>
            <h2 className="mb-8" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.18, color: C.charcoal }}>
              {content.story.heading}
            </h2>
            {content.story.body.split('\n\n').map((para, i, all) => (
              <p key={i} style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)', marginBottom: i === all.length - 1 ? 0 : '1.375rem' }}>
                {para}
              </p>
            ))}
            <Link to="/about" className="shimmer-cta inline-block no-underline py-3.5 px-8" style={{ backgroundColor: C.maroon, color: C.cream, ...label, fontSize: '0.65rem', letterSpacing: '0.14em' }}>
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
