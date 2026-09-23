'use client';

import { useState } from 'react';
import { C, DISPLAY, label, UI } from '../tokens';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer role="contentinfo" className="pt-[5.5rem] px-10 pb-10" style={{ backgroundColor: C.maroon, color: C.cream }}>
      <div className="max-w-[1440px] mx-auto">

        {/* Brand row */}
        <div
          className="footer-brand-row flex items-end justify-between mb-16 pb-12"
          style={{ borderBottom: '1px solid rgba(250,246,240,0.12)' }}
        >
          <div>
            <div className="mb-1.5" style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.cream, letterSpacing: '-0.01em' }}>
              AdeClassics
            </div>
            <div style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.16em' }}>
              Timeless Elegance · One Brand. Endless Style.
            </div>
          </div>
          <div className="flex gap-5">
            {['IG', 'FB', 'TT', 'TW'].map(s => (
              <a key={s} href="#" className="no-underline" style={{ ...label, color: 'rgba(250,246,240,0.5)', fontSize: '0.6rem' }}>{s}</a>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="footer-cols grid grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-[1.375rem]" style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.15em' }}>Shop</div>
            {[
              { label: 'Filà', href: '/shop?q=fila' },
              { label: 'Gele', href: '/shop?q=gele' },
              { label: 'Ipele', href: '/shop?q=ipele' },
              { label: 'Kaftan', href: '/shop?q=kaftan' },
              { label: 'Shoes', href: '/shop?q=shoes' },
              { label: 'Pam Slippers', href: '/shop?q=pam%20slippers' },
              { label: 'Accessories', href: '/shop?q=accessories' }
            ].map(l => (
              <a key={l.label} href={l.href} className="block no-underline mb-2.5" style={{ color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', lineHeight: 1.5, fontFamily: UI }}>{l.label}</a>
            ))}
          </div>
          <div>
            <div className="mb-[1.375rem]" style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.15em' }}>Company</div>
            {[
              { label: 'About', href: '/about' },
              { label: 'Custom Order', href: '/custom-order' },
              { label: 'Lookbook', href: '/lookbook' },
              { label: 'Blog', href: '#' },
              { label: 'Press', href: '#' }
            ].map(l => (
              <a key={l.label} href={l.href} className="block no-underline mb-2.5" style={{ color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', lineHeight: 1.5, fontFamily: UI }}>{l.label}</a>
            ))}
          </div>
          <div>
            <div className="mb-[1.375rem]" style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.15em' }}>Support</div>
            {[
              { label: 'Help Centre', href: '/help' },
              { label: 'FAQ', href: '/help' },
              { label: 'Returns', href: '/help#returns' },
              { label: 'Contact Us', href: '/help' },
              { label: 'Size Guide', href: '#' },
              { label: 'Track Order', href: '/account/orders' }
            ].map(l => (
              <a key={l.label} href={l.href} className="block no-underline mb-2.5" style={{ color: 'rgba(250,246,240,0.65)', fontSize: '0.875rem', lineHeight: 1.5, fontFamily: UI }}>{l.label}</a>
            ))}
          </div>
          <div>
            <div className="mb-[1.375rem]" style={{ ...label, color: C.gold, fontSize: '0.595rem', letterSpacing: '0.15em' }}>Stay in the Loop</div>
            <p className="mb-5" style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(250,246,240,0.6)', lineHeight: 1.7 }}>
              New drops, behind-the-scenes craft stories, and exclusive offers — delivered weekly.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 py-[0.7rem] px-3.5 min-w-0"
                style={{
                  border: '1px solid rgba(250,246,240,0.2)',
                  backgroundColor: 'rgba(250,246,240,0.07)',
                  color: C.cream, fontFamily: UI, fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button
                className="shimmer-cta px-[1.125rem] py-0 cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: C.gold, color: C.charcoal,
                  border: 'none', ...label, fontSize: '0.595rem',
                  letterSpacing: '0.12em',
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex justify-between items-center flex-wrap gap-4 pt-7"
          style={{ borderTop: '1px solid rgba(250,246,240,0.1)' }}
        >
          <span style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(250,246,240,0.4)' }}>
            © 2026 AdeClassics — Worldwide delivery available.
          </span>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Use', href: '#' },
              { label: 'Cookies', href: '#' }
            ].map(l => (
              <a key={l.label} href={l.href} className="no-underline" style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(250,246,240,0.4)' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
