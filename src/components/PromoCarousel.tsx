'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

export type Promo = {
  id: string;
  badge: string | null;
  text: string;
  subtext: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageUrl: string;
  productTitle: string | null;
  productPriceCad: number | null;
};

const AUTOPLAY_MS = 6000;

export default function PromoCarousel({ promos }: { promos: Promo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = promos.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Honour the OS "reduce motion" setting: no auto-advance, no slide transition.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const id = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reducedMotion, count, go]);

  if (count === 0) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  };

  return (
    <section
      className="promo-carousel"
      aria-roledescription="carousel"
      aria-label="Current promotions"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="promo-viewport">
        <div
          className="promo-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: reducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {promos.map((p, i) => (
            <article
              key={p.id}
              className="promo-slide"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              {...(i === index ? {} : { inert: true })}
            >
              <div className="promo-media">
                <img src={p.imageUrl} alt={p.productTitle ?? ''} loading={i === 0 ? 'eager' : 'lazy'} />
                {p.badge && <span className="promo-badge">{p.badge}</span>}
              </div>

              <div className="promo-body">
                {p.productTitle && (
                  <div style={{ ...label, color: C.gold, fontSize: '0.58rem', letterSpacing: '0.16em' }}>
                    {p.productTitle}
                  </div>
                )}

                <h2 style={{ fontFamily: DISPLAY, color: C.cream, margin: '0.5rem 0 0', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }} className="promo-headline">
                  {p.text}
                </h2>

                {p.subtext && (
                  <p style={{ fontFamily: UI, color: 'rgba(250,246,240,0.72)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0.75rem 0 0', maxWidth: '42ch' }}>
                    {p.subtext}
                  </p>
                )}

                {p.productPriceCad !== null && (
                  <div style={{ fontFamily: UI, color: C.cream, fontSize: '1.05rem', fontWeight: 600, marginTop: '0.9rem' }}>
                    CAD ${p.productPriceCad.toLocaleString()}
                  </div>
                )}

                {p.ctaLabel && p.ctaHref && (
                  <Link to={p.ctaHref} className="promo-cta">{p.ctaLabel}</Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="promo-dots" role="tablist" aria-label="Choose promotion">
          {promos.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Promotion ${i + 1}`}
              className={`promo-dot${i === index ? ' active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
