'use client';

import { useState } from 'react';
import { C, DISPLAY, label, UI } from '../tokens';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer role="contentinfo" style={{ backgroundColor: C.maroon, color: C.cream, padding: '5.5rem 2.5rem 2.5rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Brand row */}
        <div className="footer-brand-row" style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: '4rem', paddingBottom: '3rem',
          borderBottom: '1px solid rgba(250,246,240,0.12)',
        }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.cream, letterSpacing: '-0.01em', marginBottom: '0.375rem' }}>
              Fila Tó Wúyì
            </div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.16em' }}>
              by AdeClassics · One Brand. Endless Style. Timeless Elegance.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['IG', 'FB', 'TT', 'TW'].map(s => (
              <a key={s} href="#" style={{ ...label, color: 'rgba(250,246,240,0.5)', textDecorationLine: 'none', fontSize: '0.6rem' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', marginBottom: '1.375rem', letterSpacing: '0.15em' }}>Shop</div>
            {['Filà', 'Gele', 'Ipele', 'Kaftan', 'Shoes', 'Pam Slippers', 'Accessories'].map(l => (
              <a key={l} href="/shop" style={{ display: 'block', color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', textDecorationLine: 'none', marginBottom: '0.625rem', lineHeight: 1.5, fontFamily: UI }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', marginBottom: '1.375rem', letterSpacing: '0.15em' }}>Company</div>
            {['About', 'Custom Order', 'Lookbook', 'Blog', 'Press'].map(l => (
              <a key={l} href="#" style={{ display: 'block', color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', textDecorationLine: 'none', marginBottom: '0.625rem', lineHeight: 1.5, fontFamily: UI }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', marginBottom: '1.375rem', letterSpacing: '0.15em' }}>Support</div>
            {['Help Centre', 'FAQ', 'Returns', 'Contact Us', 'Size Guide', 'Track Order'].map(l => (
              <a key={l} href="#" style={{ display: 'block', color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', textDecorationLine: 'none', marginBottom: '0.625rem', lineHeight: 1.5, fontFamily: UI }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', marginBottom: '1.375rem', letterSpacing: '0.15em' }}>Stay in the Loop</div>
            <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(250,246,240,0.6)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              New drops, behind-the-scenes craft stories, and exclusive offers — delivered weekly.
            </p>
            <div style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: '0.7rem 0.875rem',
                  border: '1px solid rgba(250,246,240,0.2)',
                  backgroundColor: 'rgba(250,246,240,0.07)',
                  color: C.cream, fontFamily: UI, fontSize: '0.8rem',
                  outline: 'none', minWidth: 0,
                }}
              />
              <button className="shimmer-cta" style={{
                backgroundColor: C.gold, color: C.charcoal,
                border: 'none', ...label, fontSize: '0.595rem',
                padding: '0 1.125rem', cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '0.12em',
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(250,246,240,0.1)', paddingTop: '1.75rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(250,246,240,0.4)' }}>
            © 2026 Fila Tó Wúyì by AdeClassics — Worldwide delivery available.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use', 'Cookies'].map(l => (
              <a key={l} href="#" style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(250,246,240,0.4)', textDecorationLine: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
