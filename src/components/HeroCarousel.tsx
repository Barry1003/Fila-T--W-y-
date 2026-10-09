'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, label } from '../tokens';
import type { HeroSlide } from '@/server/content-schema';

/**
 * Editorial hero with an optional slideshow.
 *
 * Indicators are labelled bars rather than anonymous dots, so a screen reader
 * announces which slide it is moving to, and there is an explicit pause
 * control — autoplay that cannot be stopped is a genuine accessibility problem
 * for anyone who needs longer to read.
 */
export default function HeroCarousel({
  slides,
  intervalSeconds,
}: {
  slides: HeroSlide[];
  intervalSeconds: number;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const preloaded = useRef(new Map<string, HTMLImageElement>());

  const count = slides.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // The next frame is ready before autoplay crossfades to it. Limit the preload
  // to one image so an owner with eight slides does not download all eight at once.
  useEffect(() => {
    if (count < 2) return;
    const id = window.setTimeout(() => {
      const url = slides[(index + 1) % count].imageUrl;
      if (!preloaded.current.has(url)) {
        const next = new Image();
        next.src = url;
        preloaded.current.set(url, next);
      }
    }, 500);
    return () => window.clearTimeout(id);
  }, [count, index, slides]);

  const advancing = playing && !hovered && !reducedMotion && count > 1;

  useEffect(() => {
    if (!advancing) return;
    const id = setTimeout(() => go(index + 1), intervalSeconds * 1000);
    return () => clearTimeout(id);
  }, [advancing, index, intervalSeconds, go]);

  if (count === 0) return null;

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero-slide${i === index ? ' active' : ''}`}
          aria-hidden={i !== index}
          {...(i === index ? {} : { inert: true })}
        >
          <img
            src={slide.imageUrl}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
            style={{ objectFit: slide.objectFit, objectPosition: slide.objectPosition, animationDuration: `${intervalSeconds}s`, animationPlayState: i === index && advancing ? 'running' : 'paused' }}
          />
          <div className="hero-scrim" />

          <div className="hero-content">
            <div className="mb-7" style={{ fontFamily: DISPLAY, color: C.gold, fontSize: '1.5rem', letterSpacing: '0.08em', fontWeight: 600 }}>
              {slide.eyebrow}
            </div>
            <h1 className="mb-10" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.6rem, 5.2vw, 4.75rem)', color: C.cream, fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.025em' }}>
              {slide.headline.split('\n').map((line, n) => (
                <span key={n} className="block">{line}</span>
              ))}
            </h1>
            <Link
              to={slide.ctaHref}
              className="shimmer-cta inline-block no-underline w-fit py-[1rem] px-12"
              style={{ border: '1.5px solid rgba(250,246,240,0.7)', color: C.cream, ...label, letterSpacing: '0.15em', fontSize: '0.95rem', fontWeight: 600, backgroundColor: 'transparent' }}
            >
              {slide.ctaLabel}
            </Link>
          </div>
        </div>
      ))}

      <div className="hero-fade" />

      {count > 1 && (
        <div className="hero-controls">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={`hero-bar${i === index ? ' active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1} of ${count}: ${slide.eyebrow}`}
              aria-current={i === index}
            >
              <span
                className="hero-bar-fill"
                style={{
                  animationDuration: `${intervalSeconds}s`,
                  animationPlayState: i === index && advancing ? 'running' : 'paused',
                  width: i < index ? '100%' : undefined,
                }}
              />
            </button>
          ))}

          <button
            className="hero-play"
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
          >
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <rect x="2" y="1" width="3" height="10" rx="1" />
                <rect x="7" y="1" width="3" height="10" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M3 1.5v9l7-4.5z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
