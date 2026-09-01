'use client';

import { useCallback, useState } from 'react';
import { Link, NavLink } from '@/lib/router';
import { useOverlay } from '@/lib/useOverlay';
import { C, DISPLAY, label, UI } from '../tokens';
import { SearchIcon, HeartIcon, UserIcon, CartIcon, GridIcon } from '../icons';

const IS_OWNER = true;
const CART_COUNT = 3;

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Custom Order', to: '/help' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
];

const ACCOUNT_LINKS = [
  { label: 'My Account', to: '/account', icon: <UserIcon /> },
  { label: 'Wishlist', to: '/account/wishlist', icon: <HeartIcon /> },
  { label: 'Search', to: '/shop', icon: <SearchIcon /> },
];

function CartBadge({ count }: { count: number }) {
  return (
    <span className="nav-cart-badge" aria-hidden="true">
      {count}
    </span>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);

  useOverlay(menuOpen, close);

  return (
    <>
      <nav
        role="navigation"
        style={{
          backgroundColor: C.maroon,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(212,169,78,0.18)',
        }}
      >
        <div className="nav-bar">
          {/* Wordmark */}
          <Link to="/" onClick={close} style={{ textDecorationLine: 'none', flexShrink: 0 }}>
            <div className="nav-wordmark" style={{ fontFamily: DISPLAY, color: C.cream, fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Fila Tó Wúyì
            </div>
            <div className="nav-wordmark-sub" style={{ ...label, color: C.gold, letterSpacing: '0.16em' }}>
              by AdeClassics
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-center">
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
              <Link to="/console" className="nav-dashboard-pill">
                <GridIcon />
                Store Dashboard
              </Link>
            )}
            {([
              { icon: <SearchIcon />, to: '/shop', label: 'Search' },
              { icon: <HeartIcon />, to: '/account/wishlist', label: 'Wishlist' },
              { icon: <UserIcon />, to: '/account', label: 'Account' },
            ] as const).map(({ icon, to, label: lbl }) => (
              <Link key={lbl} to={to} className="nav-icon-btn" aria-label={lbl}>
                {icon}
              </Link>
            ))}
            <Link to="/cart" className="nav-icon-btn" aria-label={`Cart, ${CART_COUNT} items`}>
              <CartIcon />
              <CartBadge count={CART_COUNT} />
            </Link>
          </div>

          {/* Mobile actions — cart stays reachable without opening the menu */}
          <div className="nav-actions-mobile">
            <Link to="/cart" className="nav-icon-btn" aria-label={`Cart, ${CART_COUNT} items`}>
              <CartIcon />
              <CartBadge count={CART_COUNT} />
            </Link>
            <button
              className="nav-icon-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-panel"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${menuOpen ? ' open' : ''}`}>
        <div className="nav-drawer-overlay" onClick={close} />

        <div className="nav-drawer-panel" id="nav-mobile-panel" role="dialog" aria-modal="true" aria-label="Menu" inert={!menuOpen}>
          <div className="nav-drawer-head">
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.cream, fontWeight: 500, lineHeight: 1.1 }}>
                Fila Tó Wúyì
              </div>
              <div style={{ ...label, color: C.gold, fontSize: '0.53rem', letterSpacing: '0.15em', marginTop: '3px' }}>
                by AdeClassics
              </div>
            </div>
            <button onClick={close} className="nav-drawer-close" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="nav-drawer-body">
            <nav aria-label="Main">
              {NAV_LINKS.map(({ label: lbl, to }) => (
                <NavLink key={lbl} to={to} onClick={close} className={({ isActive }) => `nav-drawer-link${isActive ? ' active' : ''}`}>
                  {lbl}
                </NavLink>
              ))}
            </nav>

            <div className="nav-drawer-section-label">My Account</div>

            <nav aria-label="Account">
              {ACCOUNT_LINKS.map(({ label: lbl, to, icon }) => (
                <Link key={lbl} to={to} onClick={close} className="nav-drawer-sublink">
                  <span className="nav-drawer-sublink-icon">{icon}</span>
                  {lbl}
                </Link>
              ))}
              <Link to="/cart" onClick={close} className="nav-drawer-sublink">
                <span className="nav-drawer-sublink-icon"><CartIcon /></span>
                Cart
                <span className="nav-drawer-count">{CART_COUNT}</span>
              </Link>
            </nav>
          </div>

          {IS_OWNER && (
            <div className="nav-drawer-foot">
              <Link to="/console" onClick={close} className="nav-drawer-dashboard">
                <GridIcon /> Store Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
