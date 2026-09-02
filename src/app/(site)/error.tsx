'use client';

import { useEffect } from 'react';
import { C, DISPLAY, UI, label } from '@/tokens';

/**
 * Storefront error boundary.
 *
 * Renders inside the site layout, so a failed page keeps the nav and footer
 * and the visitor can carry on browsing. Product data has no sensible default
 * the way page copy does — an empty catalogue would be a lie — so this says
 * plainly that something is wrong and offers to retry.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[storefront] page failed to render:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 1.5rem', backgroundColor: C.cream }}>
      <div style={{ maxWidth: '460px', textAlign: 'center' }}>
        <div style={{ ...label, color: C.gold, fontSize: '0.6rem', letterSpacing: '0.18em' }}>
          Something went wrong
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 400, color: C.charcoal, margin: '0.6rem 0 0.9rem', letterSpacing: '-0.02em' }}>
          We could not load this page
        </h1>
        <p style={{ fontFamily: UI, fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(43,35,32,0.62)', margin: 0 }}>
          This is usually a brief hiccup reaching our catalogue. Try again in a moment.
        </p>

        <button
          onClick={reset}
          style={{
            marginTop: '1.75rem', minHeight: 46, padding: '0 1.75rem',
            border: 'none', borderRadius: 5, backgroundColor: C.gold, color: C.charcoal,
            fontFamily: UI, fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
