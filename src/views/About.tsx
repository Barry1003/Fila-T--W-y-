'use client';

import { C, DISPLAY, UI, label } from '../tokens';
import { Link } from '@/lib/router';

const IMG_HERO  = 'https://images.unsplash.com/photo-1770777353033-e32b07f31a6e?w=1600&h=900&fit=crop&auto=format';
const IMG_STORY = 'https://images.unsplash.com/photo-1590670796065-5c2469672e18?w=900&h=700&fit=crop&auto=format';
const IMG_CRAFT = 'https://images.unsplash.com/photo-1775669954911-fc68d9deae84?w=900&h=700&fit=crop&auto=format';

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Authentic Craft',
    body: "Every piece is sourced from master craftspeople in West Africa, woven and shaped using techniques passed down through generations.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Made to Last',
    body: "We source only the finest Aso-Oke, George lace, and Adire. An AdeClassics piece is meant to outlast the occasion — and be worn again.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Culture, Worldwide',
    body: "Our customers live on every continent. We ship globally because Yoruba elegance belongs wherever our community carries it.",
  },
];

export default function About() {
  return (
    <div style={{ backgroundColor: C.cream }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 'clamp(480px, 80vh, 760px)', overflow: 'hidden', backgroundColor: '#1a1210' }}>
        <img
          src={IMG_HERO}
          alt="Woman in elaborate traditional Yoruba headwear and jewelry"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.72 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(43,35,32,0.55) 0%, rgba(43,35,32,0.2) 50%, rgba(43,35,32,0.7) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', padding: '2rem',
        }}>
          <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.22em', marginBottom: '1.25rem' }}>
            Our Story
          </div>
          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 500,
            color: C.cream,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '780px',
            marginBottom: '1.5rem',
          }}>
            Timeless Elegance,<br />Rooted in Culture
          </h1>
          <p style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.72)', lineHeight: 1.65, maxWidth: '480px' }}>
            We exist to carry Yoruba textile tradition into the present — made with care, worn with pride, delivered worldwide.
          </p>
        </div>
      </div>

      {/* ── Narrative 1: Founding Story ───────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <div className="about-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ccc', aspectRatio: '3/4' }}>
            <img
              src={IMG_STORY}
              alt="Woman in traditional Yoruba crown and attire"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '1.25rem' }}>
              Where We Began
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Born from a love of tradition and a gap in the market
            </h2>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: '1.25rem' }}>
              AdeClassics was founded by Adunola Okonkwo after years of searching for authentic Yoruba headwear outside Nigeria and finding nothing that met the standard her family had held for generations. Its cap line, Filà tó Wüyí — literally "the cap that suits you" in Yoruba — remains the house's signature.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: '1.25rem' }}>
              What she found instead were imitations — machine-made caps in synthetic fabrics, sold without the knowledge of what they were meant to represent. So she went back to the source: the workshops of Iseyin, the weavers of Ondo, the embroiders of Lagos Island, and the master cap-makers of Ibadan.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78 }}>
              The first collection was twelve pieces, handpicked, and sold through word of mouth. A decade later, AdeClassics ships to over forty countries and remains guided by the same principle: every piece must be something you would keep.
            </p>
          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2.5rem' }}>
        <div style={{ borderTop: `1px solid rgba(43,35,32,0.08)` }} />
      </div>

      {/* ── Narrative 2: Craftsmanship ────────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <div className="about-two-col about-reverse" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '1.25rem' }}>
              How We Work
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Craft takes time. We do not rush it.
            </h2>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: '1.25rem' }}>
              Every AdeClassics piece passes through multiple hands before it reaches you. The Aso-Oke is woven on narrow-strip looms by artisans who have spent decades mastering the geometry of the patterns. The Gele fabric is starched by hand, tested for stiffness, and cut to precise lengths.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: '1.25rem' }}>
              Caps are shaped on wooden blocks — the same type of block Nigerian cap-makers have used for at least two hundred years. Embroidery is applied with needle and thread, never machine-stitched. Each completed piece is inspected by eye; we have no sensor more precise than a craftsperson who cares.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78 }}>
              We visit every workshop we source from. We know the names of the people who make your orders. That relationship — direct, respectful, well-compensated — is how we ensure the quality stays consistent and the tradition stays alive.
            </p>
          </div>
          <div style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ccc', aspectRatio: '3/4' }}>
            <img
              src={IMG_CRAFT}
              alt="Artisan painting intricate designs on traditional fabric"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── Values row ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', padding: '6rem 2.5rem' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '0.75rem' }}>
              What We Stand For
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Three principles, every piece
            </h2>
          </div>
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', padding: '2.5rem', border: `1px solid rgba(43,35,32,0.08)`, borderRadius: '10px' }}>
                <div style={{ color: C.gold }}>{v.icon}</div>
                <div>
                  <div style={{ ...label, fontSize: '0.65rem', color: C.charcoal, letterSpacing: '0.14em', marginBottom: '0.5rem' }}>
                    {v.title}
                  </div>
                  <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.62)', lineHeight: 1.7 }}>
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder quote ────────────────────────────────── */}
      <section style={{ maxWidth: '820px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <blockquote style={{ borderLeft: `5px solid ${C.gold}`, paddingLeft: '2.5rem', margin: 0 }}>
          <p style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: C.charcoal,
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem',
          }}>
            "I wanted to build a business where a grandmother in Ibadan and her grandchild in Toronto could both feel seen — where the object that passes between them is beautiful enough to carry that distance."
          </p>
          <footer style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(43,35,32,0.48)' }}>
            — Adunola Okonkwo, Founder
          </footer>
        </blockquote>
      </section>

      {/* ── Closing CTA band ─────────────────────────────── */}
      <section style={{ backgroundColor: C.maroon, padding: '6rem 2.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.2em', marginBottom: '1.25rem' }}>
            Discover the Collection
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 500, color: C.cream, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            Wear the tradition
          </h2>
          <p style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.65)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Filà, Gele, Ìpèlé, Aso-Oke — each piece crafted with the same intention: to be worn with pride, and kept for years.
          </p>
          <Link
            to="/shop"
            style={{
              ...label,
              display: 'inline-block',
              fontSize: '0.68rem',
              padding: '0.875rem 2.5rem',
              border: `1px solid ${C.gold}`,
              borderRadius: '4px',
              color: C.gold,
              textDecorationLine: 'none',
              letterSpacing: '0.16em',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.gold; (e.currentTarget as HTMLAnchorElement).style.color = C.charcoal; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = C.gold; }}
          >
            Explore the Collection
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .about-two-col { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-reverse { direction: ltr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
