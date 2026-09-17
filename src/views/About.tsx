'use client';

import { useEffect, useRef, useState } from 'react';
import { C, DISPLAY, UI, label } from '../tokens';
import { Link } from '@/lib/router';

const VALUES = [
  {
    num: '01',
    title: 'Authentic Craft',
    body: "Every piece is sourced from master craftspeople in West Africa — woven and shaped using techniques passed down through generations of Yoruba artisans.",
  },
  {
    num: '02',
    title: 'Made to Last',
    body: "We source only the finest Aso-Oke, George lace, and Adire. A Fila Tó Wúyì piece is meant to outlast the occasion, and be worn again.",
  },
  {
    num: '03',
    title: 'Culture, Worldwide',
    body: "Our customers live on every continent. We ship globally because Yoruba elegance belongs wherever our community carries it.",
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Source & Select', desc: 'We visit workshops in Iseyin, Ibadan, and Lagos — choosing master craftspeople by the quality of their work alone.' },
  { step: '02', title: 'Weave & Shape', desc: 'Aso-oke is woven on narrow-strip looms. Caps are formed on hand-carved wooden blocks unchanged for two centuries.' },
  { step: '03', title: 'Embroider & Finish', desc: 'Every stitch of embroidery is applied by needle. No machines touch the finishing that defines a piece.' },
  { step: '04', title: 'Inspect & Ship', desc: "Each item is examined by hand. If it does not meet standard, it does not leave Nigeria." },
];

const STATS = [
  { num: 40, suffix: '+', lbl: 'Countries shipped' },
  { num: 100, suffix: '+', lbl: 'Master artisans' },
  { num: 12, suffix: '', lbl: 'Years in craft' },
  { num: 5, suffix: 'k+', lbl: 'Pieces delivered' },
];

const REGIONS = ['Iseyin', 'Ibadan', 'Lagos Island', 'Ondo', 'Abeokuta', 'Benin City', 'Kano'];

// Shipping-map routes — arc path from Lagos to each region hub, and the hub
// point, reused for the flying-parcel animation.
const SHIP_ROUTES = [
  { path: 'M509.4,232.6 Q520,170 527.8,111.1', x: 527.8, y: 111.1 },
  { path: 'M509.4,232.6 Q570,190 625.0,166.7', x: 625.0, y: 166.7 },
  { path: 'M509.4,232.6 Q650,220 791.7,236.1', x: 791.7, y: 236.1 },
  { path: 'M509.4,232.6 Q540,280 569.4,333.3', x: 569.4, y: 333.3 },
  { path: 'M509.4,232.6 Q400,180 294.4,138.9', x: 294.4, y: 138.9 },
  { path: 'M509.4,232.6 Q420,260 347.2,291.7', x: 347.2, y: 291.7 },
];

// New — founding timeline milestones
const TIMELINE = [
  { year: '2014', desc: 'Twelve pieces, handpicked, sold entirely by word of mouth in Lagos.' },
  { year: '2017', desc: 'Formal partnerships begin with weaving workshops in Iseyin and Ondo.' },
  { year: '2020', desc: 'First shipments reach customers across 40 countries.' },
  { year: '2026', desc: '100+ artisans, 5,000+ pieces delivered, one standard unchanged.' },
];

// New — artisan spotlight cards
const SPOTLIGHT = [
  { initials: 'OW', name: 'Ondo Weavers', craft: 'Aso-Oke, narrow-strip loom', detail: 'Patterns woven on narrow-strip looms, a geometry passed down through three generations of the same families.' },
  { initials: 'LE', name: 'Lagos Island Embroiderers', craft: 'Hand needlework, gold thread', detail: 'Every embroidered edge is stitched by needle — never machine — using techniques suited to George lace and Aso-Oke alike.' },
  { initials: 'IC', name: 'Ibadan Cap-Makers', craft: 'Block-shaped, hand-finished', detail: 'Caps are shaped on wooden blocks unchanged for two centuries, then inspected by hand before they ever leave Nigeria.' },
];

// Lightweight SVG pattern — suggests Aso-oke narrow-strip weave
function WeavePattern({ opacity = 0.06, color = C.gold }: { opacity?: number; color?: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="none"
      viewBox="0 0 1200 800"
    >
      {Array.from({ length: 55 }, (_, i) => (
        <line key={i} x1="0" y1={i * 16} x2="1200" y2={i * 16} stroke={color} strokeWidth="0.6" opacity={opacity} />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={`d${i}`} opacity={opacity * 1.5}>
          <rect
            x={i * 175 + 88 - 10} y={400 - 10}
            width="20" height="20"
            transform={`rotate(45 ${i * 175 + 88} 400)`}
            fill="none" stroke={color} strokeWidth="0.8"
          />
        </g>
      ))}
    </svg>
  );
}

// New — small single-line "craft mark" icons used beside eyebrow labels
function CraftIcon({ type, color = C.gold }: { type: 'cap' | 'needle'; color?: string }) {
  if (type === 'needle') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} style={{ flexShrink: 0 }}>
        <path d="M4 20 L15 9" />
        <circle cx="17" cy="7" r="2.4" />
        <path d="M17 7 Q20 4 21 3" opacity="0.6" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.4} style={{ flexShrink: 0 }}>
      <path d="M6 11 C6 6 9 3 12 3 C15 3 18 6 18 11 L18 12 L6 12 Z" />
      <path d="M4 12 L20 12" />
      <path d="M9 12 L9 15" opacity="0.5" />
      <path d="M15 12 L15 15" opacity="0.5" />
    </svg>
  );
}

// New — count-up number, triggers once when scrolled into view
function StatCounter({ target, suffix = '', style }: { target: number; suffix?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        setDone(true);
        if (reduced) { setDisplay(target); return; }
        let start: number | null = null;
        const duration = 1100;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(step);
          else setDisplay(target);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, done]);

  return <div ref={ref} style={style}>{display}{suffix}</div>;
}

export default function About() {
  // Scroll-reveal: fade + slide each tagged element in the first time it enters
  // the viewport. Elements already on screen reveal immediately; reduced-motion
  // shows everything at once.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('reveal-in'));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Gate the shipping-map motion on the viewer's reduced-motion preference.
  const [motionOK, setMotionOK] = useState(true);
  useEffect(() => {
    setMotionOK(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div style={{ backgroundColor: C.cream }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        minHeight: 'clamp(520px, 82vh, 780px)',
        backgroundColor: C.charcoal,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '3rem 2rem 6rem',
      }}>
        <WeavePattern />

        {/* Giant watermark brand name */}
        <div aria-hidden="true" style={{
          position: 'absolute', fontFamily: DISPLAY,
          fontSize: 'clamp(5rem, 16vw, 14rem)',
          fontWeight: 700, color: 'rgba(250,246,240,0.028)',
          top: '50%', left: '50%', transform: 'translate(-50%, -56%)',
          lineHeight: 1, letterSpacing: '-0.04em', whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none',
        }}>
          AdeClassics
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...label, fontSize: '0.6rem', color: C.gold, letterSpacing: '0.24em', marginBottom: '1.5rem' }}>
            Our Story
          </div>
          <div style={{ width: '2.5rem', height: '1px', backgroundColor: C.gold, margin: '0 auto 1.75rem' }} />
          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(2.1rem, 5vw, 4rem)',
            fontWeight: 500, color: C.cream,
            lineHeight: 1.08, letterSpacing: '-0.022em',
            maxWidth: '800px', margin: '0 auto 1.625rem',
          }}>
            Timeless Elegance,<br />Rooted in Culture
          </h1>
          <p style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.58)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto' }}>
            We exist to carry Yoruba textile tradition into the present — made with care, worn with pride, delivered worldwide.
          </p>

          {/* Founding seal — fills the space between the subtext and the stats strip */}
          <div style={{ marginTop: '2.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
            <svg width="82" height="82" viewBox="0 0 82 82" fill="none">
              <circle cx="41" cy="41" r="38.5" stroke={C.gold} strokeWidth="1" />
              <circle cx="41" cy="41" r="32" stroke={C.gold} strokeWidth="0.6" opacity="0.5" />
              <path d="M28 44 C28 34 34 28 41 28 C48 28 54 34 54 44" stroke={C.gold} strokeWidth="1.3" />
              <line x1="24" y1="44" x2="58" y2="44" stroke={C.gold} strokeWidth="1.3" />
            </svg>
            <div style={{ ...label, fontSize: '0.56rem', letterSpacing: '0.22em', color: 'rgba(250,246,240,0.4)' }}>
              Est. 2014 · Lagos
            </div>
          </div>
        </div>

        {/* Stats strip — anchored to bottom, now counts up on scroll into view */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderTop: '1px solid rgba(212,169,78,0.18)',
          backgroundColor: 'rgba(212,169,78,0.07)',
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
          gap: '0',
        }}>
          {STATS.map((s, i) => (
            <div key={s.lbl} style={{
              flex: '1 1 auto', minWidth: '120px',
              textAlign: 'center', padding: '1.375rem 1.5rem',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(212,169,78,0.13)' : 'none',
            }}>
              <StatCounter
                target={s.num}
                suffix={s.suffix}
                style={{ fontFamily: DISPLAY, fontSize: '1.6rem', fontWeight: 400, color: C.gold, lineHeight: 1 }}
              />
              <div style={{ ...label, fontSize: '0.5rem', color: 'rgba(250,246,240,0.36)', letterSpacing: '0.12em', marginTop: '0.35rem' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Founding Story ───────────────────────────────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '8rem 2.5rem' }}>
        <div className="about-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* Decorative panel — replaces photo */}
          <div className="reveal-left" style={{
            aspectRatio: '3/4', borderRadius: '10px',
            backgroundColor: '#1a1210',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '3rem 2.5rem',
          }}>
            <WeavePattern opacity={0.055} />

            {/* Year watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute', fontFamily: DISPLAY,
              fontSize: 'clamp(6rem, 12vw, 10rem)',
              fontWeight: 700, color: 'rgba(250,246,240,0.04)',
              bottom: '5%', right: '-4%',
              lineHeight: 1, letterSpacing: '-0.05em',
              userSelect: 'none', pointerEvents: 'none',
            }}>
              2014
            </div>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              {/* Cap mark */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.3} style={{ opacity: 0.85, marginBottom: '1.25rem' }}>
                <path d="M6 11 C6 6 9 3 12 3 C15 3 18 6 18 11 L18 12 L6 12 Z" />
                <path d="M4 12 L20 12" />
              </svg>

              {/* Gold rule top */}
              <div style={{ width: '2.5rem', height: '1px', backgroundColor: C.gold, margin: '0 auto 2rem' }} />

              {/* Yoruba title */}
              <div style={{
                fontFamily: DISPLAY, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: C.cream, letterSpacing: '-0.02em', lineHeight: 1.2,
                marginBottom: '0.875rem',
              }}>
                Filà tó wúyì
              </div>

              <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(250,246,240,0.36)', letterSpacing: '0.08em', marginBottom: '3rem' }}>
                &ldquo;The cap that suits you&rdquo; — Yoruba
              </div>

              {/* Gold rule bottom */}
              <div style={{ width: '2.5rem', height: '1px', backgroundColor: C.gold, margin: '0 auto 2.5rem' }} />

              {/* Mini stats */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.9rem' }}>
                {[{ n: '40+', t: 'Countries' }, { n: '100+', t: 'Artisans' }, { n: '12', t: 'Years' }].map(s => (
                  <div key={s.n} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 400, color: C.gold, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ ...label, fontSize: '0.52rem', color: 'rgba(250,246,240,0.32)', letterSpacing: '0.12em', marginTop: '0.4rem' }}>{s.t}</div>
                  </div>
                ))}
              </div>

              {/* Founded label */}
              <div style={{ ...label, fontSize: '0.52rem', color: 'rgba(250,246,240,0.22)', letterSpacing: '0.18em', marginTop: '2.5rem' }}>
                Founded 2014 · Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Story text */}
          <div className="reveal-right">
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <CraftIcon type="cap" />
              Where We Began
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Born from a love of tradition and a gap in the market
            </h2>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              Fila Tó Wúyì — literally &ldquo;the cap that suits you&rdquo; in Yoruba — was founded by Adunola Okonkwo after years of searching for authentic Yoruba headwear outside Nigeria and finding nothing that met the standard her family had held for generations.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              What she found instead were imitations — machine-made caps in synthetic fabrics, sold without the knowledge of what they were meant to represent. So she went back to the source: the workshops of Iseyin, the weavers of Ondo, the embroiders of Lagos Island, and the master cap-makers of Ibadan.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82 }}>
              The first collection was twelve pieces, handpicked and sold through word of mouth. A decade later, Fila Tó Wúyì ships to over forty countries and remains guided by the same principle: every piece must be something you would keep.
            </p>
          </div>
        </div>
      </section>

      {/* ── NEW: Founding Timeline (ivory contrast section) ──────────── */}
      <section style={{ padding: '7rem 2.5rem 8rem', backgroundColor: C.cream }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4.5rem' }}>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', justifyContent: 'center', display: 'flex' }}>
              A Decade of Craft
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: '1.1rem' }}>
              Twelve years, one country at a time
            </h2>
          </div>

          <div className="timeline-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative', padding: '0 1rem' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: '8px', left: '6%', right: '6%', height: '1px', backgroundColor: 'rgba(43,35,32,0.15)' }} />
            {TIMELINE.map((t, i) => (
              <div key={t.year} className="reveal" data-delay={`${(i % 3) + 1}`} style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: C.cream, border: `2px solid ${C.gold}`, margin: '0 auto 1.5rem', position: 'relative', zIndex: 1 }} />
                <div style={{ fontFamily: DISPLAY, fontSize: '1.5rem', color: C.gold, marginBottom: '0.6rem' }}>{t.year}</div>
                <p style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(43,35,32,0.62)', lineHeight: 1.6, maxWidth: '210px', margin: '0 auto' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artisan Regions band ─────────────────────────────────────── */}
      <div style={{
        backgroundColor: C.maroon,
        padding: '2.25rem 2.5rem',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ ...label, fontSize: '0.52rem', color: 'rgba(250,246,240,0.38)', letterSpacing: '0.18em', marginBottom: '1rem', textAlign: 'center' }}>
            Artisan Communities We Source From
          </div>
          {/* Live-scrolling marquee — duplicated list for a seamless loop, pauses on hover */}
          <div className="marquee-mask" style={{ overflow: 'hidden' }}>
            <div className="marquee-track" style={{ display: 'flex', width: 'max-content' }}>
              {[...REGIONS, ...REGIONS].map((r, i) => (
                <span key={`${r}-${i}`} style={{
                  fontFamily: DISPLAY, fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                  color: i % REGIONS.length % 2 === 0 ? C.cream : 'rgba(250,246,240,0.5)',
                  letterSpacing: '-0.01em',
                  padding: '0.25rem 1.25rem',
                  whiteSpace: 'nowrap',
                  borderRight: '1px solid rgba(250,246,240,0.15)',
                }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW: Artisan Spotlight cards ──────────────────────────────── */}
      <section style={{ padding: '6rem 2.5rem', backgroundColor: C.cream }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', justifyContent: 'center', display: 'flex' }}>
              The Hands Behind It
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', marginTop: '1.1rem' }}>
              Three workshops, one standard
            </h2>
          </div>
          <div className="spotlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {SPOTLIGHT.map((s, i) => (
              <div key={s.initials} className="spot-card reveal" data-delay={`${i + 1}`} tabIndex={0} style={{
                border: '1px solid rgba(43,35,32,0.1)', borderRadius: '10px',
                padding: '2.5rem 2rem', textAlign: 'center', position: 'relative',
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  border: `1.5px solid ${C.gold}`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem',
                  fontFamily: DISPLAY, fontSize: '1.1rem', color: C.gold,
                }}>
                  {s.initials}
                </div>
                <div style={{ ...label, fontSize: '0.68rem', color: C.charcoal, marginBottom: '0.4rem' }}>{s.name}</div>
                <div style={{ fontFamily: DISPLAY, fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(43,35,32,0.5)', marginBottom: '1rem' }}>{s.craft}</div>
                <div className="spot-detail" style={{ fontFamily: UI, fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(43,35,32,0.62)' }}>
                  {s.detail}
                </div>
                <div className="spot-hint" style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.28)', marginTop: '0.75rem' }}>
                  Hover to read more
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craftsmanship ────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '8rem 2.5rem' }}>
        <div className="about-two-col about-reverse" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* Craft text */}
          <div className="reveal-left">
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <CraftIcon type="needle" />
              How We Work
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 500, color: C.charcoal, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              Craft takes time.<br />We do not rush it.
            </h2>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              Every Fila Tó Wúyì piece passes through multiple hands before it reaches you. The Aso-Oke is woven on narrow-strip looms by artisans who have spent decades mastering the geometry of the patterns. The Gele fabric is starched by hand, tested for stiffness, and cut to precise lengths.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82, marginBottom: '1.25rem' }}>
              Caps are shaped on wooden blocks — the same type of block Nigerian cap-makers have used for at least two hundred years. Embroidery is applied with needle and thread, never machine-stitched.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.68)', lineHeight: 1.82 }}>
              We visit every workshop we source from. We know the names of the people who make your orders. That relationship — direct, respectful, well-compensated — is how the quality stays consistent and the tradition stays alive.
            </p>
          </div>

          {/* Process panel — replaces photo */}
          <div className="reveal-right" style={{
            aspectRatio: '3/4', borderRadius: '10px',
            border: '1px solid rgba(43,35,32,0.08)',
            backgroundColor: '#fff',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: '3rem 2.75rem',
          }}>
            {/* Background watermark number */}
            <div aria-hidden="true" style={{
              position: 'absolute', fontFamily: DISPLAY,
              fontSize: '18rem', fontWeight: 700,
              color: 'rgba(43,35,32,0.025)',
              bottom: '-3rem', right: '-2rem',
              lineHeight: 1, letterSpacing: '-0.06em',
              userSelect: 'none', pointerEvents: 'none',
            }}>
              04
            </div>

            <div style={{ ...label, fontSize: '0.6rem', color: C.teal, letterSpacing: '0.18em', marginBottom: '2.25rem' }}>
              Our Process
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.step} style={{
                  display: 'flex', gap: '1.375rem', alignItems: 'flex-start',
                  paddingTop: i > 0 ? '1.5rem' : 0,
                  paddingBottom: i < PROCESS_STEPS.length - 1 ? '1.5rem' : 0,
                  borderBottom: i < PROCESS_STEPS.length - 1 ? '1px solid rgba(43,35,32,0.07)' : 'none',
                }}>
                  <div style={{
                    fontFamily: DISPLAY, fontSize: '1.5rem', fontWeight: 400,
                    color: C.gold, flexShrink: 0, lineHeight: 1.15,
                    letterSpacing: '-0.02em', minWidth: '2rem',
                  }}>
                    {s.step}
                  </div>
                  <div>
                    <div style={{ ...label, fontSize: '0.57rem', color: C.charcoal, letterSpacing: '0.12em', marginBottom: '0.375rem' }}>
                      {s.title}
                    </div>
                    <p style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(43,35,32,0.55)', lineHeight: 1.7, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW: Shipping Map ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, padding: '7rem 2.5rem 6rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', justifyContent: 'center', display: 'flex' }}>
            Where We Ship
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 500, color: C.cream, letterSpacing: '-0.02em', margin: '1.1rem 0 0.75rem' }}>
            Lagos to everywhere
          </h2>
          <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(250,246,240,0.5)', maxWidth: '460px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Every order begins in the same workshops and travels from there — an abstract picture of a genuinely global reach.
          </p>

          <div style={{ position: 'relative', maxWidth: '1040px', margin: '0 auto', border: '1px solid rgba(212,169,78,0.18)', borderRadius: '6px', padding: '1.5rem 1.5rem 0.75rem', backgroundColor: 'rgba(0,0,0,0.15)' }}><svg viewBox="0 0 1000 500" style={{ width: '100%', height: 'auto', display: 'block' }}><g opacity={1}><line x1="0" y1="100" x2="1000" y2="100" stroke={C.gold} strokeWidth="0.5" opacity="0.12" /><line x1="0" y1="200" x2="1000" y2="200" stroke={C.gold} strokeWidth="0.5" opacity="0.12" /><line x1="0" y1="300" x2="1000" y2="300" stroke={C.gold} strokeWidth="0.5" opacity="0.12" /><line x1="0" y1="400" x2="1000" y2="400" stroke={C.gold} strokeWidth="0.5" opacity="0.12" /><line x1="125" y1="0" x2="125" y2="500" stroke={C.gold} strokeWidth="0.5" opacity="0.1" /><line x1="375" y1="0" x2="375" y2="500" stroke={C.gold} strokeWidth="0.5" opacity="0.1" /><line x1="625" y1="0" x2="625" y2="500" stroke={C.gold} strokeWidth="0.5" opacity="0.1" /><line x1="875" y1="0" x2="875" y2="500" stroke={C.gold} strokeWidth="0.5" opacity="0.1" /></g><g><circle cx="851.1" cy="50.4" r="1.3" fill={C.gold} opacity="0.36"/><circle cx="865.9" cy="50.4" r="0.98" fill={C.gold} opacity="0.41"/><circle cx="886.0" cy="48.0" r="1.35" fill={C.gold} opacity="0.38"/><circle cx="745.7" cy="58.1" r="1.18" fill={C.gold} opacity="0.43"/><circle cx="756.5" cy="60.3" r="1.27" fill={C.gold} opacity="0.37"/><circle cx="768.6" cy="59.0" r="1.01" fill={C.gold} opacity="0.38"/><circle cx="779.6" cy="60.4" r="1.23" fill={C.gold} opacity="0.48"/><circle cx="791.6" cy="60.8" r="1.5" fill={C.gold} opacity="0.4"/><circle cx="803.7" cy="59.7" r="1.1" fill={C.gold} opacity="0.33"/><circle cx="813.6" cy="60.6" r="1.28" fill={C.gold} opacity="0.44"/><circle cx="827.9" cy="58.7" r="1.05" fill={C.gold} opacity="0.43"/><circle cx="841.3" cy="61.4" r="1.5" fill={C.gold} opacity="0.37"/><circle cx="851.8" cy="58.4" r="1.46" fill={C.gold} opacity="0.38"/><circle cx="863.9" cy="58.0" r="1.29" fill={C.gold} opacity="0.47"/><circle cx="874.1" cy="59.7" r="1.02" fill={C.gold} opacity="0.36"/><circle cx="886.0" cy="59.7" r="1.49" fill={C.gold} opacity="0.29"/><circle cx="717.5" cy="73.7" r="1.35" fill={C.gold} opacity="0.42"/><circle cx="733.2" cy="71.8" r="1.46" fill={C.gold} opacity="0.43"/><circle cx="754.6" cy="70.0" r="0.92" fill={C.gold} opacity="0.37"/><circle cx="779.2" cy="73.2" r="1.28" fill={C.gold} opacity="0.32"/><circle cx="805.1" cy="70.8" r="1.48" fill={C.gold} opacity="0.36"/><circle cx="829.4" cy="72.1" r="1.06" fill={C.gold} opacity="0.45"/><circle cx="854.3" cy="70.6" r="1.09" fill={C.gold} opacity="0.47"/><circle cx="874.8" cy="70.7" r="1.08" fill={C.gold} opacity="0.41"/><circle cx="901.2" cy="71.1" r="1.37" fill={C.gold} opacity="0.37"/><circle cx="697.4" cy="84.4" r="1.16" fill={C.gold} opacity="0.5"/><circle cx="721.9" cy="82.7" r="1.34" fill={C.gold} opacity="0.43"/><circle cx="745.0" cy="85.7" r="1.4" fill={C.gold} opacity="0.43"/><circle cx="766.7" cy="83.1" r="1.06" fill={C.gold} opacity="0.48"/><circle cx="791.1" cy="82.4" r="1.1" fill={C.gold} opacity="0.36"/><circle cx="814.0" cy="86.3" r="1.44" fill={C.gold} opacity="0.46"/><circle cx="842.4" cy="85.5" r="0.97" fill={C.gold} opacity="0.44"/><circle cx="862.5" cy="84.7" r="1.38" fill={C.gold} opacity="0.31"/><circle cx="887.4" cy="81.7" r="1.41" fill={C.gold} opacity="0.46"/><circle cx="913.0" cy="84.0" r="1.41" fill={C.gold} opacity="0.31"/><circle cx="682.0" cy="94.2" r="1.49" fill={C.gold} opacity="0.37"/><circle cx="707.2" cy="94.3" r="1.25" fill={C.gold} opacity="0.5"/><circle cx="730.3" cy="98.0" r="1.48" fill={C.gold} opacity="0.3"/><circle cx="756.8" cy="98.0" r="1.09" fill={C.gold} opacity="0.36"/><circle cx="778.5" cy="97.0" r="1.16" fill={C.gold} opacity="0.31"/><circle cx="803.7" cy="97.9" r="1.32" fill={C.gold} opacity="0.39"/><circle cx="826.7" cy="94.2" r="1.15" fill={C.gold} opacity="0.44"/><circle cx="851.8" cy="94.2" r="1.09" fill={C.gold} opacity="0.47"/><circle cx="876.2" cy="97.8" r="1.14" fill={C.gold} opacity="0.4"/><circle cx="899.8" cy="96.3" r="1.09" fill={C.gold} opacity="0.31"/><circle cx="516.7" cy="106.6" r="1.34" fill={C.gold} opacity="0.42"/><circle cx="537.5" cy="108.9" r="1.4" fill={C.gold} opacity="0.42"/><circle cx="685.1" cy="105.6" r="1.28" fill={C.gold} opacity="0.49"/><circle cx="709.6" cy="105.9" r="1.21" fill={C.gold} opacity="0.29"/><circle cx="730.3" cy="109.8" r="1.19" fill={C.gold} opacity="0.48"/><circle cx="755.3" cy="108.4" r="1.25" fill={C.gold} opacity="0.45"/><circle cx="778.2" cy="109.5" r="1.49" fill={C.gold} opacity="0.45"/><circle cx="804.6" cy="107.6" r="1.03" fill={C.gold} opacity="0.42"/><circle cx="830.2" cy="109.4" r="1.2" fill={C.gold} opacity="0.28"/><circle cx="865.0" cy="109.6" r="1.06" fill={C.gold} opacity="0.33"/><circle cx="890.4" cy="109.7" r="1.12" fill={C.gold} opacity="0.35"/><circle cx="168.4" cy="122.0" r="1.44" fill={C.gold} opacity="0.38"/><circle cx="202.4" cy="118.5" r="1.2" fill={C.gold} opacity="0.4"/><circle cx="239.5" cy="120.1" r="1.28" fill={C.gold} opacity="0.42"/><circle cx="504.7" cy="122.3" r="1.42" fill={C.gold} opacity="0.48"/><circle cx="542.3" cy="122.5" r="1.02" fill={C.gold} opacity="0.47"/><circle cx="578.0" cy="122.0" r="1.06" fill={C.gold} opacity="0.41"/><circle cx="648.9" cy="119.0" r="1.3" fill={C.gold} opacity="0.33"/><circle cx="682.8" cy="118.1" r="0.98" fill={C.gold} opacity="0.34"/><circle cx="720.9" cy="117.6" r="1.35" fill={C.gold} opacity="0.33"/><circle cx="754.6" cy="122.2" r="0.95" fill={C.gold} opacity="0.36"/><circle cx="790.0" cy="122.1" r="1.25" fill={C.gold} opacity="0.4"/><circle cx="826.4" cy="143.1" r="0.96" fill={C.gold} opacity="0.41"/><circle cx="180.5" cy="132.0" r="1.48" fill={C.gold} opacity="0.49"/><circle cx="217.6" cy="132.4" r="1.04" fill={C.gold} opacity="0.45"/><circle cx="253.1" cy="129.8" r="1.32" fill={C.gold} opacity="0.44"/><circle cx="288.0" cy="129.6" r="1.3" fill={C.gold} opacity="0.39"/><circle cx="502.8" cy="133.6" r="1.19" fill={C.gold} opacity="0.3"/><circle cx="537.6" cy="132.5" r="1.22" fill={C.gold} opacity="0.37"/><circle cx="577.8" cy="133.1" r="1.07" fill={C.gold} opacity="0.36"/><circle cx="646.2" cy="132.4" r="1.2" fill={C.gold} opacity="0.46"/><circle cx="683.4" cy="131.6" r="1.14" fill={C.gold} opacity="0.36"/><circle cx="721.4" cy="131.2" r="1.29" fill={C.gold} opacity="0.41"/><circle cx="757.5" cy="134.1" r="1.22" fill={C.gold} opacity="0.41"/><circle cx="794.3" cy="134.2" r="1.07" fill={C.gold} opacity="0.48"/><circle cx="828.2" cy="129.8" r="1.06" fill={C.gold} opacity="0.39"/><circle cx="866.3" cy="133.4" r="0.95" fill={C.gold} opacity="0.37"/><circle cx="193.8" cy="142.7" r="1.39" fill={C.gold} opacity="0.38"/><circle cx="227.0" cy="145.4" r="1.2" fill={C.gold} opacity="0.29"/><circle cx="261.8" cy="143.4" r="0.99" fill={C.gold} opacity="0.39"/><circle cx="302.3" cy="145.2" r="1.33" fill={C.gold} opacity="0.39"/><circle cx="515.4" cy="143.1" r="0.98" fill={C.gold} opacity="0.39"/><circle cx="550.4" cy="143.0" r="1.33" fill={C.gold} opacity="0.4"/><circle cx="601.7" cy="145.7" r="1.49" fill={C.gold} opacity="0.3"/><circle cx="648.3" cy="144.0" r="1.2" fill={C.gold} opacity="0.49"/><circle cx="684.1" cy="144.1" r="1.21" fill={C.gold} opacity="0.45"/><circle cx="719.3" cy="146.2" r="1.27" fill={C.gold} opacity="0.3"/><circle cx="755.5" cy="144.3" r="1.43" fill={C.gold} opacity="0.33"/><circle cx="791.7" cy="144.6" r="1.48" fill={C.gold} opacity="0.36"/><circle cx="826.4" cy="143.1" r="0.96" fill={C.gold} opacity="0.41"/><circle cx="866.0" cy="144.9" r="0.97" fill={C.gold} opacity="0.3"/><circle cx="192.4" cy="155.2" r="1.28" fill={C.gold} opacity="0.49"/><circle cx="228.4" cy="158.3" r="1.36" fill={C.gold} opacity="0.38"/><circle cx="266.2" cy="157.8" r="0.98" fill={C.gold} opacity="0.41"/><circle cx="529.7" cy="154.1" r="1.06" fill={C.gold} opacity="0.47"/><circle cx="563.3" cy="157.1" r="1.27" fill={C.gold} opacity="0.28"/><circle cx="611.8" cy="154.2" r="1.36" fill={C.gold} opacity="0.39"/><circle cx="660.5" cy="154.6" r="1.38" fill={C.gold} opacity="0.4"/><circle cx="694.9" cy="157.4" r="1.24" fill={C.gold} opacity="0.47"/><circle cx="731.4" cy="153.9" r="1.28" fill={C.gold} opacity="0.32"/><circle cx="766.0" cy="156.3" r="0.91" fill={C.gold} opacity="0.39"/><circle cx="803.1" cy="154.6" r="1.28" fill={C.gold} opacity="0.34"/><circle cx="842.0" cy="157.4" r="1.36" fill={C.gold} opacity="0.39"/><circle cx="194.2" cy="167.6" r="1.46" fill={C.gold} opacity="0.33"/><circle cx="228.6" cy="167.8" r="1.31" fill={C.gold} opacity="0.35"/><circle cx="266.1" cy="166.1" r="1.37" fill={C.gold} opacity="0.43"/><circle cx="515.3" cy="166.5" r="0.92" fill={C.gold} opacity="0.42"/><circle cx="551.7" cy="166.1" r="1.18" fill={C.gold} opacity="0.39"/><circle cx="585.9" cy="165.6" r="0.9" fill={C.gold} opacity="0.36"/><circle cx="626.4" cy="168.3" r="1.46" fill={C.gold} opacity="0.45"/><circle cx="660.2" cy="165.5" r="1.29" fill={C.gold} opacity="0.39"/><circle cx="696.8" cy="166.8" r="0.93" fill={C.gold} opacity="0.31"/><circle cx="733.7" cy="167.0" r="1.45" fill={C.gold} opacity="0.47"/><circle cx="766.3" cy="169.4" r="1.39" fill={C.gold} opacity="0.36"/><circle cx="805.6" cy="167.1" r="0.94" fill={C.gold} opacity="0.4"/><circle cx="838.7" cy="165.7" r="1.25" fill={C.gold} opacity="0.32"/><circle cx="213.6" cy="178.4" r="1.29" fill={C.gold} opacity="0.42"/><circle cx="251.4" cy="180.4" r="1.23" fill={C.gold} opacity="0.49"/><circle cx="286.1" cy="178.4" r="1.49" fill={C.gold} opacity="0.4"/><circle cx="514.7" cy="179.4" r="1.33" fill={C.gold} opacity="0.38"/><circle cx="553.0" cy="179.6" r="0.99" fill={C.gold} opacity="0.39"/><circle cx="590.1" cy="181.9" r="1.06" fill={C.gold} opacity="0.45"/><circle cx="624.9" cy="181.6" r="1.37" fill={C.gold} opacity="0.29"/><circle cx="661.1" cy="177.7" r="1.19" fill={C.gold} opacity="0.43"/><circle cx="694.1" cy="182.1" r="1.09" fill={C.gold} opacity="0.47"/><circle cx="733.7" cy="180.4" r="1.13" fill={C.gold} opacity="0.4"/><circle cx="766.4" cy="180.3" r="1.44" fill={C.gold} opacity="0.42"/><circle cx="805.9" cy="180.2" r="1.29" fill={C.gold} opacity="0.41"/><circle cx="839.2" cy="178.3" r="1.35" fill={C.gold} opacity="0.46"/><circle cx="239.1" cy="194.4" r="1.43" fill={C.gold} opacity="0.43"/><circle cx="491.5" cy="190.5" r="1.11" fill={C.gold} opacity="0.43"/><circle cx="529.2" cy="194.3" r="1.3" fill={C.gold} opacity="0.36"/><circle cx="563.2" cy="190.2" r="1.21" fill={C.gold} opacity="0.3"/><circle cx="602.1" cy="190.6" r="1.36" fill={C.gold} opacity="0.36"/><circle cx="710.1" cy="192.3" r="1.41" fill={C.gold} opacity="0.3"/><circle cx="743.1" cy="190.0" r="1.27" fill={C.gold} opacity="0.4"/><circle cx="781.6" cy="191.6" r="1.37" fill={C.gold} opacity="0.42"/><circle cx="816.5" cy="191.2" r="1.12" fill={C.gold} opacity="0.38"/><circle cx="469.1" cy="205.9" r="1.28" fill={C.gold} opacity="0.29"/><circle cx="504.9" cy="201.7" r="1.48" fill={C.gold} opacity="0.46"/><circle cx="537.6" cy="206.5" r="1.39" fill={C.gold} opacity="0.46"/><circle cx="574.2" cy="203.6" r="1.1" fill={C.gold} opacity="0.47"/><circle cx="623.3" cy="204.0" r="0.94" fill={C.gold} opacity="0.35"/><circle cx="719.3" cy="201.6" r="1.12" fill={C.gold} opacity="0.37"/><circle cx="757.0" cy="206.4" r="1.18" fill={C.gold} opacity="0.49"/><circle cx="791.6" cy="206.4" r="0.99" fill={C.gold} opacity="0.39"/><circle cx="481.1" cy="215.0" r="0.93" fill={C.gold} opacity="0.42"/><circle cx="515.4" cy="216.4" r="1.16" fill={C.gold} opacity="0.37"/><circle cx="551.4" cy="216.8" r="1.01" fill={C.gold} opacity="0.31"/><circle cx="588.1" cy="216.0" r="1.31" fill={C.gold} opacity="0.36"/><circle cx="721.3" cy="217.3" r="1.22" fill={C.gold} opacity="0.34"/><circle cx="754.0" cy="213.9" r="1.17" fill={C.gold} opacity="0.4"/><circle cx="793.1" cy="215.9" r="0.97" fill={C.gold} opacity="0.31"/><circle cx="297.8" cy="229.0" r="1.44" fill={C.gold} opacity="0.33"/><circle cx="336.4" cy="227.1" r="1.25" fill={C.gold} opacity="0.34"/><circle cx="503.0" cy="227.2" r="1.16" fill={C.gold} opacity="0.41"/><circle cx="539.9" cy="229.8" r="1.47" fill={C.gold} opacity="0.36"/><circle cx="574.9" cy="230.0" r="1.12" fill={C.gold} opacity="0.36"/><circle cx="612.5" cy="230.3" r="1.31" fill={C.gold} opacity="0.39"/><circle cx="742.0" cy="228.7" r="1.47" fill={C.gold} opacity="0.49"/><circle cx="780.8" cy="226.3" r="0.98" fill={C.gold} opacity="0.49"/><circle cx="298.0" cy="241.1" r="1.15" fill={C.gold} opacity="0.31"/><circle cx="337.2" cy="238.2" r="1.24" fill={C.gold} opacity="0.47"/><circle cx="529.5" cy="240.9" r="1.07" fill={C.gold} opacity="0.46"/><circle cx="564.8" cy="241.7" r="0.95" fill={C.gold} opacity="0.39"/><circle cx="597.5" cy="239.9" r="1.08" fill={C.gold} opacity="0.46"/><circle cx="299.0" cy="251.4" r="1.32" fill={C.gold} opacity="0.39"/><circle cx="338.2" cy="250.5" r="1.23" fill={C.gold} opacity="0.37"/><circle cx="529.6" cy="252.3" r="1.11" fill={C.gold} opacity="0.34"/><circle cx="561.8" cy="252.2" r="1.26" fill={C.gold} opacity="0.4"/><circle cx="598.1" cy="251.0" r="1.24" fill={C.gold} opacity="0.28"/><circle cx="300.1" cy="263.7" r="1.49" fill={C.gold} opacity="0.43"/><circle cx="336.3" cy="265.0" r="1.41" fill={C.gold} opacity="0.29"/><circle cx="373.1" cy="265.1" r="0.95" fill={C.gold} opacity="0.41"/><circle cx="539.9" cy="265.6" r="1.0" fill={C.gold} opacity="0.43"/><circle cx="574.5" cy="262.8" r="1.31" fill={C.gold} opacity="0.37"/><circle cx="301.2" cy="277.7" r="1.48" fill={C.gold} opacity="0.49"/><circle cx="337.3" cy="274.2" r="1.38" fill={C.gold} opacity="0.38"/><circle cx="369.9" cy="274.1" r="1.42" fill={C.gold} opacity="0.29"/><circle cx="538.0" cy="275.7" r="0.95" fill={C.gold} opacity="0.47"/><circle cx="577.7" cy="278.5" r="1.15" fill={C.gold} opacity="0.41"/><circle cx="298.5" cy="286.6" r="1.31" fill={C.gold} opacity="0.3"/><circle cx="337.8" cy="285.8" r="1.11" fill={C.gold} opacity="0.3"/><circle cx="371.7" cy="286.1" r="1.01" fill={C.gold} opacity="0.44"/><circle cx="549.9" cy="286.8" r="1.34" fill={C.gold} opacity="0.38"/><circle cx="587.8" cy="287.1" r="1.03" fill={C.gold} opacity="0.39"/><circle cx="876.0" cy="290.5" r="0.91" fill={C.gold} opacity="0.49"/><circle cx="301.0" cy="298.8" r="0.94" fill={C.gold} opacity="0.33"/><circle cx="333.9" cy="301.2" r="1.06" fill={C.gold} opacity="0.39"/><circle cx="369.5" cy="299.9" r="1.04" fill={C.gold} opacity="0.41"/><circle cx="554.2" cy="300.4" r="1.29" fill={C.gold} opacity="0.3"/><circle cx="587.9" cy="297.6" r="1.45" fill={C.gold} opacity="0.41"/><circle cx="851.9" cy="298.8" r="1.32" fill={C.gold} opacity="0.46"/><circle cx="888.6" cy="301.0" r="1.42" fill={C.gold} opacity="0.4"/><circle cx="298.1" cy="312.0" r="1.13" fill={C.gold} opacity="0.38"/><circle cx="337.4" cy="310.0" r="1.0" fill={C.gold} opacity="0.35"/><circle cx="372.8" cy="310.6" r="0.92" fill={C.gold} opacity="0.49"/><circle cx="549.8" cy="310.9" r="1.02" fill={C.gold} opacity="0.29"/><circle cx="586.3" cy="312.2" r="0.97" fill={C.gold} opacity="0.36"/><circle cx="827.6" cy="313.6" r="1.11" fill={C.gold} opacity="0.44"/><circle cx="864.5" cy="314.0" r="1.45" fill={C.gold} opacity="0.48"/><circle cx="898.8" cy="311.3" r="1.03" fill={C.gold} opacity="0.32"/><circle cx="300.4" cy="322.0" r="1.4" fill={C.gold} opacity="0.3"/><circle cx="335.6" cy="325.9" r="1.32" fill={C.gold} opacity="0.37"/><circle cx="552.0" cy="324.8" r="1.35" fill={C.gold} opacity="0.28"/><circle cx="841.1" cy="325.1" r="1.33" fill={C.gold} opacity="0.35"/><circle cx="878.2" cy="323.7" r="1.21" fill={C.gold} opacity="0.34"/><circle cx="910.2" cy="323.8" r="1.44" fill={C.gold} opacity="0.36"/><circle cx="302.0" cy="337.5" r="1.43" fill={C.gold} opacity="0.44"/><circle cx="335.3" cy="338.0" r="1.28" fill={C.gold} opacity="0.3"/><circle cx="563.7" cy="334.5" r="1.3" fill={C.gold} opacity="0.34"/><circle cx="874.2" cy="334.4" r="0.94" fill={C.gold} opacity="0.46"/><circle cx="913.4" cy="336.1" r="1.43" fill={C.gold} opacity="0.3"/><circle cx="299.8" cy="349.8" r="1.38" fill={C.gold} opacity="0.43"/><circle cx="337.2" cy="346.2" r="1.48" fill={C.gold} opacity="0.41"/><circle cx="889.8" cy="348.8" r="1.34" fill={C.gold} opacity="0.43"/><circle cx="298.3" cy="360.0" r="1.06" fill={C.gold} opacity="0.47"/><circle cx="323.6" cy="360.2" r="1.31" fill={C.gold} opacity="0.39"/><circle cx="299.9" cy="373.2" r="1.24" fill={C.gold} opacity="0.43"/><circle cx="309.6" cy="382.6" r="1.48" fill={C.gold} opacity="0.33"/></g><g opacity={0.9}><path d="M509.4,232.6 Q520,170 527.8,111.1" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><path d="M509.4,232.6 Q570,190 625.0,166.7" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><path d="M509.4,232.6 Q650,220 791.7,236.1" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><path d="M509.4,232.6 Q540,280 569.4,333.3" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><path d="M509.4,232.6 Q400,180 294.4,138.9" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><path d="M509.4,232.6 Q420,260 347.2,291.7" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.5" /><circle cx="527.8" cy="111.1" r="3.5" fill={C.gold} opacity="0.9" /><circle cx="625.0" cy="166.7" r="3.5" fill={C.gold} opacity="0.9" /><circle cx="791.7" cy="236.1" r="3.5" fill={C.gold} opacity="0.9" /><circle cx="569.4" cy="333.3" r="3.5" fill={C.gold} opacity="0.9" /><circle cx="294.4" cy="138.9" r="3.5" fill={C.gold} opacity="0.9" /><circle cx="347.2" cy="291.7" r="3.5" fill={C.gold} opacity="0.9" /><text x="527.8" y="98" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">EUROPE</text><text x="625.0" y="153" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">MIDDLE EAST</text><text x="791.7" y="223" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">ASIA-PACIFIC</text><text x="569.4" y="352" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">SOUTHERN AFRICA</text><text x="294.4" y="126" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">AMERICAS</text><text x="347.2" y="310" textAnchor="middle" fill="rgba(250,246,240,0.55)" fontSize="11" fontFamily={UI} letterSpacing="0.06em">SOUTH AMERICA</text><circle cx="509.4" cy="232.6" r="7" fill="none" stroke={C.gold} strokeWidth="1.4" /><circle cx="509.4" cy="232.6" r="3" fill={C.gold} /><text x="509.4" y="256" textAnchor="middle" fill={C.gold} fontSize="13" fontFamily={DISPLAY} fontStyle="italic">Lagos</text></g>{motionOK && (<g>{SHIP_ROUTES.map((r, i) => (<g key={i}>{/* soft glow trail */}<circle r="15" fill={C.gold} opacity="0"><animateMotion dur="2.9s" begin={`${i * 0.42}s`} repeatCount="indefinite" path={r.path} /><animate attributeName="opacity" values="0;0.22;0.22;0" keyTimes="0;0.12;0.82;1" dur="2.9s" begin={`${i * 0.42}s`} repeatCount="indefinite" /></circle>{/* parcel */}<circle r="7.5" fill={C.cream} opacity="0"><animateMotion dur="2.9s" begin={`${i * 0.42}s`} repeatCount="indefinite" path={r.path} /><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.9s" begin={`${i * 0.42}s`} repeatCount="indefinite" /></circle>{/* arrival pulse */}<circle cx={r.x} cy={r.y} r="3" fill="none" stroke={C.gold} strokeWidth="1.6" opacity="0"><animate attributeName="r" values="3;13" dur="1s" begin={`${i * 0.42 + 2.45}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="0.9;0" dur="1s" begin={`${i * 0.42 + 2.45}s`} repeatCount="indefinite" /></circle></g>))}{/* Lagos ping */}<circle cx="509.4" cy="232.6" r="7" fill="none" stroke={C.gold} strokeWidth="2" opacity="0"><animate attributeName="r" values="7;28" dur="2.9s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.65;0" dur="2.9s" repeatCount="indefinite" /></circle></g>)}</svg></div>

          <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(250,246,240,0.4)', letterSpacing: '0.05em', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.4rem', alignItems: 'baseline' }}>
            Shipping to
            <StatCounter target={40} suffix="+" style={{ fontFamily: DISPLAY, fontSize: '1rem', color: C.gold }} />
            countries and counting
          </div>
        </div>
      </section>

      {/* ── Founder Quote ────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: C.maroon,
        padding: '7rem 2.5rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <WeavePattern opacity={0.045} color={C.cream} />

        {/* Decorative oversized open-quote */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-1rem', left: '3rem',
          fontFamily: DISPLAY, fontSize: '18rem', fontWeight: 700,
          color: 'rgba(250,246,240,0.04)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>
          &ldquo;
        </div>

        <div className="reveal" style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Gold top rule */}
          <div style={{ width: '3rem', height: '1px', backgroundColor: C.gold, marginBottom: '2.5rem' }} />

          <p style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(1.45rem, 3vw, 2.1rem)',
            fontStyle: 'italic', fontWeight: 400,
            color: C.cream, lineHeight: 1.5,
            letterSpacing: '-0.01em', margin: '0 0 2.25rem',
          }}>
            &ldquo;I wanted to build a business where a grandmother in Ibadan and her grandchild in Toronto could both feel seen — where the object that passes between them is beautiful enough to carry that distance.&rdquo;
          </p>

          {/* Attribution */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2rem', height: '1px', backgroundColor: C.gold, flexShrink: 0 }} />
            <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(250,246,240,0.5)', letterSpacing: '0.03em' }}>
              Adunola Okonkwo, Founder · Fila Tó Wúyì by AdeClassics
            </span>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section style={{ padding: '8rem 2.5rem', backgroundColor: C.cream }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

          {/* Section header */}
          <div className="reveal" style={{ marginBottom: '5rem' }}>
            <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
              What We Stand For
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0 }}>
                Three principles, every piece
              </h2>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(43,35,32,0.1)', minWidth: '2rem' }} />
            </div>
          </div>

          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid rgba(43,35,32,0.08)' }}>
            {VALUES.map((v, i) => (
              <div
                key={v.num}
                className="reveal"
                data-delay={`${i + 1}`}
                style={{
                  padding: '3.5rem 2.75rem',
                  borderRight: i < VALUES.length - 1 ? '1px solid rgba(43,35,32,0.08)' : 'none',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}
              >
                {/* Oversized ordinal watermark */}
                <div aria-hidden="true" style={{
                  position: 'absolute', fontFamily: DISPLAY,
                  fontSize: '9rem', fontWeight: 700,
                  color: 'rgba(43,35,32,0.03)',
                  bottom: '-1.5rem', right: '1rem',
                  lineHeight: 1, letterSpacing: '-0.05em',
                  userSelect: 'none', pointerEvents: 'none',
                }}>
                  {v.num}
                </div>

                {/* Gold ordinal */}
                <div style={{ fontFamily: DISPLAY, fontSize: '2.25rem', fontWeight: 400, color: C.gold, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {v.num}
                </div>

                {/* Gold thin rule */}
                <div style={{ width: '2rem', height: '1px', backgroundColor: C.gold }} />

                <div style={{ ...label, fontSize: '0.65rem', color: C.charcoal, letterSpacing: '0.14em' }}>
                  {v.title}
                </div>
                <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.62)', lineHeight: 1.78, margin: 0, position: 'relative', zIndex: 1 }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: C.charcoal,
        padding: '7rem 2.5rem',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <WeavePattern opacity={0.04} />

        <div className="reveal" style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.22em', marginBottom: '1.25rem' }}>
            Discover the Collection
          </div>
          <div style={{ width: '2.5rem', height: '1px', backgroundColor: C.gold, margin: '0 auto 2rem' }} />
          <h2 style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 500, color: C.cream,
            lineHeight: 1.1, letterSpacing: '-0.022em',
            marginBottom: '1.5rem',
          }}>
            Wear the tradition
          </h2>
          <p style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(250,246,240,0.52)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 2.75rem' }}>
            Filà, Gele, Ìpèlé, Aso-Oke — each piece crafted with one intention: to be worn with pride, and kept for years.
          </p>
          <Link
            to="/shop"
            className="shimmer-cta"
            style={{
              ...label,
              display: 'inline-block',
              fontSize: '0.68rem',
              padding: '0.925rem 2.75rem',
              border: `1.5px solid ${C.gold}`,
              color: C.gold,
              textDecorationLine: 'none',
              letterSpacing: '0.17em',
              backgroundColor: 'transparent',
            }}
          >
            Explore the Collection
          </Link>
        </div>
      </section>

      <style>{`
        /* Scroll-reveal — hidden until .reveal-in is added by the observer */
        .reveal, .reveal-left, .reveal-right {
          opacity: 0;
          transition: opacity .75s cubic-bezier(.22,.61,.36,1), transform .75s cubic-bezier(.22,.61,.36,1);
          will-change: opacity, transform;
        }
        .reveal { transform: translateY(30px); }
        .reveal-left { transform: translateX(-34px); }
        .reveal-right { transform: translateX(34px); }
        .reveal-in { opacity: 1 !important; transform: none !important; }
        .reveal[data-delay="1"] { transition-delay: .09s; }
        .reveal[data-delay="2"] { transition-delay: .18s; }
        .reveal[data-delay="3"] { transition-delay: .27s; }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal-left, .reveal-right {
            opacity: 1 !important; transform: none !important; transition: none !important;
          }
        }

        @media (max-width: 900px) {
          .about-two-col { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-two-col > *:first-child { aspect-ratio: unset !important; min-height: 300px; }
          .about-reverse > *:first-child { order: 2; }
          .about-reverse > *:last-child { order: 1; }
          .values-grid { grid-template-columns: 1fr !important; }
          .values-grid > * { border-right: none !important; border-bottom: 1px solid rgba(43,35,32,0.08); }
          .values-grid > *:last-child { border-bottom: none; }
          .timeline-row { grid-template-columns: 1fr 1fr !important; gap: 2rem 0 !important; }
          .timeline-row > div:first-child { display: none; }
          .spotlight-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .about-two-col > *:first-child { min-height: 260px; }
        }

        /* Marquee — pauses on hover, disabled under reduced motion */
        .marquee-track { animation: about-scroll-left 26s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes about-scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        /* Artisan spotlight cards — reveal detail on hover/focus */
        .spot-card { transition: border-color .25s ease, box-shadow .25s ease; }
        .spot-card:hover, .spot-card:focus-within { border-color: ${C.gold}; box-shadow: 0 8px 28px rgba(43,35,32,0.08); }
        .spot-detail { max-height: 0; opacity: 0; overflow: hidden; transition: max-height .35s ease, opacity .3s ease; }
        .spot-card:hover .spot-detail, .spot-card:focus-within .spot-detail { max-height: 140px; opacity: 1; }
        .spot-card:hover .spot-hint, .spot-card:focus-within .spot-hint { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
