'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { slugify } from '@/lib/slug';
import type { HomeContent } from '@/server/content-schema';
import HeroCarousel from '../components/HeroCarousel';
import { ShieldIcon, BadgeIcon, GlobeIcon } from '../icons';

const categories = [
  { letter: 'F', name: 'Filà',         img: 'photo-1763823133159-c6f8ec380e33' },
  { letter: 'G', name: 'Gele',         img: 'photo-1714124731489-7eb16af0ac91' },
  { letter: 'I', name: 'Ipele',        img: 'photo-1760086626077-55da1cb1ecb3' },
  { letter: 'K', name: 'Kaftan',       img: 'photo-1765910083971-aa0e3688be46' },
  { letter: 'T', name: 'Trousers',     img: 'photo-1661332360810-28aa035f14db' },
  { letter: 'R', name: 'Roundneck',    img: 'photo-1632948056627-41482f69c38c' },
  { letter: 'S', name: 'Shoes',        img: 'photo-1646133512747-babfd708d662' },
  { letter: 'P', name: 'Pam Slippers', img: 'photo-1542727284-f84ef8478587'   },
  { letter: 'A', name: 'Accessories',  img: 'photo-1665646155658-bdcd66e854db' },
];

const catBgs = [
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
  C.cream,            'rgba(122,46,56,0.055)', 'rgba(212,169,78,0.07)',
];

const products = [
  { id: 1, img: 'photo-1763823133159-c6f8ec380e33', tag: 'NEW',          title: 'Gobi Filà Cap — Burgundy Velvet',  cad: 'CAD $89' },
  { id: 2, img: 'photo-1714124731489-7eb16af0ac91', tag: 'NEW',          title: 'Aso-oke Gele — Ivory & Gold Set',  cad: 'CAD $145' },
  { id: 3, img: 'photo-1765910083971-aa0e3688be46', tag: 'MADE TO ORDER', title: 'Embroidered Agbada Kaftan',        cad: 'CAD $310' },
  { id: 4, img: 'photo-1760086626077-55da1cb1ecb3', tag: 'NEW',          title: 'Ọjọ Ipele — Crimson Drape',        cad: 'CAD $78' },
  { id: 5, img: 'photo-1661332360810-28aa035f14db', tag: 'NEW',          title: 'Tailored Yoruba Trouser Set',      cad: 'CAD $195' },
  { id: 6, img: 'photo-1632948056627-41482f69c38c', tag: 'SOLD OUT',     title: 'Adire Roundneck — Indigo',         cad: 'CAD $125' },
  { id: 7, img: 'photo-1646133512747-babfd708d662', tag: 'NEW',          title: 'Hand-tooled Pam Slippers',         cad: 'CAD $160' },
  { id: 8, img: 'photo-1542727284-f84ef8478587',   tag: 'MADE TO ORDER', title: 'Adire Prayer Mat — Heritage Weave', cad: 'CAD $55' },
];

const craftsmanship = [
  { icon: '✦', color: C.maroon, heading: 'Handmade',         body: 'Every piece is cut, sewn, and finished by hand. No factory shortcuts — each filà, gele, and kaftan carries the mark of the artisan who made it.' },
  { icon: '◈', color: C.teal,   heading: 'Made to Order',    body: 'Many of our styles are crafted specifically for you after purchase. Your measurements, your colours, your occasion — made with intention.' },
  { icon: '◆', color: C.indigo, heading: 'Quality Materials', body: 'We source premium Aso-oke, velvet, and hand-dyed Adire. Materials are chosen for longevity — pieces meant to be kept, not discarded.' },
];

export default function Home({ content }: { content: HomeContent }) {
  const [promoDismissed, setPromoDismissed] = useState(false);

  return (
    <>
      {/* ── HERO ── */}
      <HeroCarousel slides={content.hero.slides} intervalSeconds={content.hero.intervalSeconds} />

      {/* ── PROMO STRIP ── */}
      {content.promo.enabled && !promoDismissed && (
        <div style={{ backgroundColor: C.charcoal, color: C.cream, padding: '0.8rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <p style={{ ...label, fontSize: '0.64rem', margin: 0, textAlign: 'center', letterSpacing: '0.12em' }}>
            {content.promo.text}
          </p>
          <button onClick={() => setPromoDismissed(true)} aria-label="Dismiss" style={{ position: 'absolute', right: '1.5rem', background: 'none', border: 'none', color: C.cream, cursor: 'pointer', fontSize: '1.1rem', opacity: 0.55, lineHeight: 1, padding: '2px 6px' }}>×</button>
        </div>
      )}

      {/* ── TRUST SIGNALS ── */}
      <div className="reveal" style={{ borderTop: '1px solid rgba(43,35,32,0.09)', borderBottom: '1px solid rgba(43,35,32,0.09)', backgroundColor: C.cream }}>
        <div className="trust-row" style={{ maxWidth: '960px', margin: '0 auto', padding: '2.75rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            { icon: <ShieldIcon />, lbl: 'Escrow-Protected Payments' },
            { icon: <BadgeIcon />,  lbl: 'Quality Guaranteed' },
            { icon: <GlobeIcon />,  lbl: 'Worldwide Delivery' },
          ].map(({ icon, lbl }) => (
            <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: C.teal, lineHeight: 0 }}>{icon}</div>
              <span style={{ ...label, fontSize: '0.63rem', color: C.charcoal, textAlign: 'center' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="section-pad" style={{ padding: '6rem 2.5rem 5rem', maxWidth: '1440px', margin: '0 auto' }}>
        <h2 className="reveal" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', marginBottom: '2.75rem', color: C.charcoal }}>
          Shop by Category
        </h2>
        <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '0.875rem' }}>
          {categories.map(({ letter, name, img }, i) => (
            <div key={name} className="flip-card" style={{ aspectRatio: '1', cursor: 'pointer' }}>
              <div className="flip-card-inner">
                <Link to="/shop" className="flip-card-front" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '1.5rem 1rem 1.625rem', backgroundColor: catBgs[i], border: '1px solid rgba(43,35,32,0.07)', textDecorationLine: 'none' }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 'clamp(3.5rem, 6vw, 5rem)', color: C.maroon, fontWeight: 300, lineHeight: 1, marginBottom: '0.875rem', display: 'block', fontStyle: 'italic' }}>{letter}</span>
                  <span style={{ ...label, color: C.charcoal, fontSize: '0.595rem', textAlign: 'center', letterSpacing: '0.14em' }}>{name}</span>
                </Link>
                <Link to="/shop" className="flip-card-back" style={{ display: 'block', textDecorationLine: 'none', overflow: 'hidden' }}>
                  <img src={`https://images.unsplash.com/${img}?w=400&h=400&fit=crop&auto=format`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(43,35,32,0.72) 0%, rgba(43,35,32,0) 55%)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
                    <span style={{ ...label, color: C.cream, fontSize: '0.595rem', letterSpacing: '0.14em' }}>{name}</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEW IN ── */}
      <section className="section-pad" style={{ padding: '0 2.5rem 6.5rem', maxWidth: '1440px', margin: '0 auto' }}>
        <div className="reveal" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.75rem' }}>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, margin: 0 }}>New In.</h2>
          <Link to="/shop" style={{ ...label, color: C.indigo, textDecorationLine: 'none', fontSize: '0.65rem' }}>View All →</Link>
        </div>
        <div className="new-in-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {products.map(p => (
            <Link key={p.id} to={`/product/${slugify(p.title)}`} className="product-card" style={{ textDecorationLine: 'none', color: C.charcoal, display: 'block' }}>
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
              <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 400, marginBottom: '0.7rem', lineHeight: 1.4, color: C.charcoal }}>{p.title}</div>
              <div style={{ fontFamily: UI, fontSize: '1rem', fontWeight: 600, color: C.charcoal, lineHeight: 1 }}>{p.cad}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── OUR CRAFTSMANSHIP ── */}
      <section className="section-pad" style={{ backgroundColor: 'rgba(122,46,56,0.035)', borderTop: '1px solid rgba(43,35,32,0.08)', borderBottom: '1px solid rgba(43,35,32,0.08)', padding: '6rem 2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="reveal" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, letterSpacing: '-0.022em', color: C.charcoal, marginBottom: '2.75rem' }}>Our Craftsmanship.</h2>
          <div className="craftsmanship-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {craftsmanship.map((c, i) => (
              <div key={c.heading} className="reveal" data-delay={String(i + 1) as "1" | "2" | "3"} style={{ backgroundColor: C.cream, padding: '2.5rem', border: '1px solid rgba(43,35,32,0.08)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: c.color, color: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{c.icon}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', fontWeight: 400, color: C.charcoal, marginBottom: '0.875rem', letterSpacing: '-0.01em' }}>{c.heading}</div>
                <p style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(43,35,32,0.7)', margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="section-pad" style={{ maxWidth: '1440px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div className="reveal-left" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#c8beb5' }}>
            <img src={content.story.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%', display: 'block' }} />
            <div style={{ position: 'absolute', inset: '1.25rem', border: '1px solid rgba(212,169,78,0.35)', pointerEvents: 'none' }} />
          </div>
          <div className="reveal-right">
            <div style={{ ...label, color: C.gold, fontSize: '0.625rem', marginBottom: '1.75rem', letterSpacing: '0.17em' }}>Our Story</div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '2rem', lineHeight: 1.18, color: C.charcoal }}>
              {content.story.heading}
            </h2>
            {content.story.body.split('\n\n').map((para, i, all) => (
              <p key={i} style={{ fontFamily: UI, fontSize: '0.9375rem', lineHeight: 1.85, color: 'rgba(43,35,32,0.72)', marginBottom: i === all.length - 1 ? 0 : '1.375rem' }}>
                {para}
              </p>
            ))}
            <a href="#" className="shimmer-cta" style={{ display: 'inline-block', backgroundColor: C.maroon, color: C.cream, ...label, padding: '0.875rem 2rem', textDecorationLine: 'none', fontSize: '0.65rem', letterSpacing: '0.14em' }}>
              Our Story
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
