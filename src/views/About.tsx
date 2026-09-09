'use client';

import { C, DISPLAY, UI, label } from '../tokens';
import { Link } from '@/lib/router';
import type { AboutContent } from '@/server/content-schema';


const VALUE_ICONS = [
  (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
  ),
  (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
  ),
  (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
  ),
];


export default function About({ content }: { content: AboutContent }) {
  return (
    <div style={{ backgroundColor: C.cream }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative h-[clamp(480px,80vh,760px)] overflow-hidden" style={{ backgroundColor: '#1a1210' }}>
        <img
          src={content.hero.imageUrl}
          alt="Woman in elaborate traditional Yoruba headwear and jewelry"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center top', opacity: 0.72 }}
        />
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-center p-8"
          style={{ background: 'linear-gradient(160deg, rgba(43,35,32,0.55) 0%, rgba(43,35,32,0.2) 50%, rgba(43,35,32,0.7) 100%)' }}
        >
          <div className="mb-5" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.22em' }}>
            {content.hero.eyebrow}
          </div>
          <h1
            className="max-w-[780px] mb-6"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 500,
              color: C.cream,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Timeless Elegance,<br />Rooted in Culture
          </h1>
          <p className="max-w-[480px]" style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.72)', lineHeight: 1.65 }}>
            We exist to carry Yoruba textile tradition into the present — made with care, worn with pride, delivered worldwide.
          </p>
        </div>
      </div>

      {/* ── Narrative 1: Founding Story ───────────────────── */}
      <section className="max-w-[1440px] mx-auto py-28 px-10">
        <div className="about-two-col grid grid-cols-2 gap-20 items-center">
          <div className="rounded-[10px] overflow-hidden aspect-[3/4]" style={{ backgroundColor: '#ccc' }}>
            <img
              src={content.origin.imageUrl}
              alt="Woman in traditional Yoruba crown and attire"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="mb-5" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em' }}>
              {content.origin.eyebrow}
            </div>
            <h2 className="mb-6" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {content.origin.heading}
            </h2>
            {content.origin.body.split('\n\n').map((para, i, all) => (
              <p key={i} style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: i === all.length - 1 ? 0 : '1.25rem' }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Thin divider */}
      <div className="max-w-[1440px] mx-auto px-10">
        <div style={{ borderTop: `1px solid rgba(43,35,32,0.08)` }} />
      </div>

      {/* ── Narrative 2: Craftsmanship ────────────────────── */}
      <section className="max-w-[1440px] mx-auto py-28 px-10">
        <div className="about-two-col about-reverse grid grid-cols-2 gap-20 items-center">
          <div>
            <div className="mb-5" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em' }}>
              {content.craft.eyebrow}
            </div>
            <h2 className="mb-6" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {content.craft.heading}
            </h2>
            {content.craft.body.split('\n\n').map((para, i, all) => (
              <p key={i} style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.78, marginBottom: i === all.length - 1 ? 0 : '1.25rem' }}>
                {para}
              </p>
            ))}
          </div>
          <div className="rounded-[10px] overflow-hidden aspect-[3/4]" style={{ backgroundColor: '#ccc' }}>
            <img
              src={content.craft.imageUrl}
              alt="Artisan painting intricate designs on traditional fabric"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Values row ───────────────────────────────────── */}
      <section className="py-24 px-10" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <div className="mb-3" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em' }}>
              What We Stand For
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Three principles, every piece
            </h2>
          </div>
          <div className="values-grid grid grid-cols-3 gap-12">
            {content.values.map((v, i) => (
              <div key={v.title} className="flex flex-col items-start gap-4 p-10 rounded-[10px]" style={{ border: `1px solid rgba(43,35,32,0.08)` }}>
                <div style={{ color: C.gold }}>{VALUE_ICONS[i % VALUE_ICONS.length]}</div>
                <div>
                  <div className="mb-2" style={{ ...label, fontSize: '0.65rem', color: C.charcoal, letterSpacing: '0.14em' }}>
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
      <section className="max-w-[820px] mx-auto py-28 px-10">
        <blockquote className="pl-10 m-0" style={{ borderLeft: `5px solid ${C.gold}` }}>
          <p
            className="mb-6"
            style={{
              fontFamily: DISPLAY,
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: C.charcoal,
              lineHeight: 1.45,
              letterSpacing: '-0.01em',
            }}
          >
            {content.quote.text}
          </p>
          <footer style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(43,35,32,0.48)' }}>
            — {content.quote.attribution}
          </footer>
        </blockquote>
      </section>

      {/* ── Closing CTA band ─────────────────────────────── */}
      <section className="py-24 px-10 text-center" style={{ backgroundColor: C.maroon }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-5" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.2em' }}>
            Discover the Collection
          </div>
          <h2 className="mb-8" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 500, color: C.cream, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Wear the tradition
          </h2>
          <p className="max-w-[480px] mx-auto mt-0 mb-10" style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.65)', lineHeight: 1.65 }}>
            Filà, Gele, Ìpèlé, Aso-Oke — each piece crafted with the same intention: to be worn with pride, and kept for years.
          </p>
          <Link
            to="/shop"
            className="inline-block no-underline py-3.5 px-10 rounded-[4px]"
            style={{
              ...label,
              fontSize: '0.68rem',
              border: `1px solid ${C.gold}`,
              color: C.gold,
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
