'use client';

import { useState } from 'react';
import { Link, NavLink } from '@/lib/router';
import { C, DISPLAY, label, UI } from '../tokens';
import { SearchIcon, HeartIcon, UserIcon, CartIcon, GridIcon } from '../icons';

const IS_OWNER = true;

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Custom Order', to: '/help' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav role="navigation" style={{
        backgroundColor: C.maroon,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(212,169,78,0.18)',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          gap: '1rem',
        }}>

          {/* Wordmark */}
          <Link to="/" onClick={close} style={{ textDecorationLine: 'none', flexShrink: 0 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: '1.4rem', color: C.cream, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Fila Tó Wúyì
            </div>
            <div style={{ ...label, color: C.gold, fontSize: '0.575rem', marginTop: '2px', letterSpacing: '0.16em' }}>
              by AdeClassics
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-center" style={{ display: 'flex', gap: '2.25rem' }}>
            {NAV_LINKS.map(({ label: lbl, to }) => (
              <NavLink
                key={lbl}
                to={to}
                className="nav-link"
                style={({ isActive }) => ({
                  ...label,
                  color: C.cream,
                  textDecorationLine: 'none',
                  opacity: isActive ? 1 : 0.82,
                  fontSize: '0.68rem',
                  borderBottom: isActive ? `1px solid ${C.gold}` : '1px solid transparent',
                  paddingBottom: '2px',
                })}
              >
                {lbl}
              </NavLink>
            ))}
          </div>

          {/* Desktop icons */}
          <div className="nav-icons-desktop">
            {IS_OWNER && (
              <Link
                to="/console"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 11px',
                  border: `1px solid ${C.gold}`,
                  borderRadius: 100,
                  color: C.gold,
                  textDecorationLine: 'none',
                  fontSize: '0.62rem',
                  fontFamily: UI,
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.gold;
                  (e.currentTarget as HTMLAnchorElement).style.color = C.charcoal;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = C.gold;
                }}
              >
                <GridIcon />
                Store Dashboard
              </Link>
            )}
            {([
              { icon: <SearchIcon />, to: '/shop' },
              { icon: <HeartIcon />, to: '/account/wishlist' },
              { icon: <UserIcon />, to: '/account' },
            ] as const).map(({ icon, to }) => (
              <Link key={to} to={to} style={{ color: C.cream, display: 'flex', opacity: 0.8, lineHeight: 0, textDecorationLine: 'none' }}>
                {icon}
              </Link>
            ))}
            <Link to="/cart" style={{ textDecorationLine: 'none', color: 'inherit', lineHeight: 0, position: 'relative', display: 'flex', opacity: 0.8 }}>
              <CartIcon />
              <span style={{
                position: 'absolute', top: '1px', right: '1px',
                backgroundColor: C.gold, color: C.charcoal,
                borderRadius: '50%', width: '15px', height: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 700, lineHeight: 1,
              }}>3</span>
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-mobile-overlay" onClick={close} />
        <div className="nav-mobile-panel">
          {/* Panel header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(250,246,240,0.1)' }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream, fontWeight: 500 }}>Fila Tó Wúyì</div>
              <div style={{ ...label, color: C.gold, fontSize: '0.55rem', letterSpacing: '0.15em', marginTop: '2px' }}>by AdeClassics</div>
            </div>
            <button onClick={close} style={{ background: 'none', border: 'none', color: 'rgba(250,246,240,0.6)', cursor: 'pointer', padding: '4px', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
            {NAV_LINKS.map(({ label: lbl, to }) => (
              <NavLink
                key={lbl}
                to={to}
                onClick={close}
                style={({ isActive }) => ({
                  fontFamily: UI,
                  fontSize: '1rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.gold : 'rgba(250,246,240,0.85)',
                  textDecorationLine: 'none',
                  padding: '0.75rem 0.5rem',
                  borderBottom: '1px solid rgba(250,246,240,0.07)',
                  display: 'block',
                  letterSpacing: '0.01em',
                })}
              >
                {lbl}
              </NavLink>
            ))}

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/account" onClick={close} style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(250,246,240,0.7)', textDecorationLine: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon /> My Account
              </Link>
              <Link to="/account/wishlist" onClick={close} style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(250,246,240,0.7)', textDecorationLine: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HeartIcon /> Wishlist
              </Link>
              <Link to="/cart" onClick={close} style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(250,246,240,0.7)', textDecorationLine: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CartIcon /> Cart <span style={{ backgroundColor: C.gold, color: C.charcoal, borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>3</span>
              </Link>
            </div>

            {IS_OWNER && (
              <Link
                to="/console"
                onClick={close}
                style={{
                  marginTop: '1.5rem',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '0.65rem 1rem',
                  border: `1px solid ${C.gold}`,
                  borderRadius: 6,
                  color: C.gold,
                  fontFamily: UI,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textDecorationLine: 'none',
                }}
              >
                <GridIcon /> Store Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
