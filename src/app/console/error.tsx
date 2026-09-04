'use client';

import { C, DISPLAY, UI, label } from '@/tokens';

/**
 * Console-level error boundary.
 *
 * The console reads live — it must not serve cached figures to someone about
 * to make a decision on them — so a database blip surfaces here rather than
 * being papered over. Says which part failed and offers a retry.
 */
export default function ConsoleError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem', backgroundColor: '#EDE9E3' }}>
      <div style={{ maxWidth: 460, textAlign: 'center' }}>
        <div style={{ ...label, fontSize: '0.6rem', color: C.gold }}>Console</div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: C.charcoal, margin: '0.6rem 0 0.9rem', letterSpacing: '-0.02em' }}>
          Could not load your store data
        </h1>
        <p style={{ fontFamily: UI, fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(43,35,32,0.62)', margin: 0 }}>
          The database did not answer. Nothing has been changed — this is a read
          that failed, not a save.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: '1.75rem', minHeight: 46, padding: '0 1.75rem', border: 'none', borderRadius: 5,
            backgroundColor: C.gold, color: C.charcoal, fontFamily: UI, fontSize: '0.72rem',
            fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
