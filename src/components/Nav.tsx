'use client';

import { useCallback, useState } from 'react';
import { Link, NavLink, useNavigate } from '@/lib/router';
import { useOverlay } from '@/lib/useOverlay';
import { signOut } from '@/server/auth-actions';
import type { CurrentUser } from '@/server/auth';
import { C, DISPLAY, label, UI } from '../tokens';
import { SearchIcon, HeartIcon, UserIcon, CartIcon, GridIcon } from '../icons';

const CART_COUNT = 3;

/** The collections sit under Shop rather than beside it — they are ways into
 *  the catalogue, not siblings of Lookbook and About. */
const COLLECTION_LINKS = [
  { label: 'Shop All', to: '/shop' },
  { label: 'Filà tó Wüyí', to: '/collections/fila-to-wuyi' },
  { label: 'Gele & Ipele', to: '/collections/gele-ipele' },
  { label: 'Pre-Order', to: '/collections/pre-order' },
];

const NAV_LINKS = [
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
];

const ACCOUNT_LINKS = [
  { label: 'My Account', to: '/account', icon: <UserIcon /> },
  { label: 'Wishlist', to: '/account/wishlist', icon: <HeartIcon /> },
];

function CartBadge({ count }: { count: number }) {
  return (
    <span className="nav-cart-badge" aria-hidden="true">
      {count}
    </span>
  );
}

function SearchField({ className, onSubmitted }: { className: string; onSubmitted?: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  return (
    <form
      className={className}
      role="search"
      onSubmit={e => {
        e.preventDefault();
        const q = query.trim();
        navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
        onSubmitted?.();
      }}
    >
      <span className="nav-search-icon" aria-hidden="true"><SearchIcon /></span>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search caps, gele, kaftans…"
        aria-label="Search products"
      />
    </form>
  );
}

export default function Nav({ user }: { user: CurrentUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);
  const isOwner = user?.role === 'OWNER';

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
              AdeClassics
            </div>
            <div className="nav-wordmark-sub" style={{ ...label, color: C.gold, letterSpacing: '0.16em' }}>
              Timeless Elegance
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-center">
            <div className="nav-dropdown">
              <NavLink
                to="/shop"
                className={({ isActive }) => `nav-link nav-dropdown-trigger${isActive ? ' active' : ''}`}
                style={{ ...label, color: C.cream, textDecorationLine: 'none', fontSize: '0.68rem' }}
              >
                Shop
                <svg width="9" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>

              <div className="nav-dropdown-menu">
                {COLLECTION_LINKS.map(({ label: lbl, to }) => (
                  <Link key={lbl} to={to} className="nav-dropdown-item">{lbl}</Link>
                ))}
              </div>
            </div>

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

          {/* Desktop search */}
          <SearchField className="nav-search" />

          {/* Desktop icons */}
          <div className="nav-icons-desktop">
            {isOwner && (
              <Link to="/console" className="nav-dashboard-pill">
                <GridIcon />
                Store Dashboard
              </Link>
            )}
            {([
              { icon: <HeartIcon />, to: '/account/wishlist', label: 'Wishlist' },
              { icon: <UserIcon />, to: user ? '/account' : '/auth', label: user ? 'Account' : 'Sign in' },
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
                AdeClassics
              </div>
              <div style={{ ...label, color: C.gold, fontSize: '0.53rem', letterSpacing: '0.15em', marginTop: '3px' }}>
                Timeless Elegance
              </div>
            </div>
            <button onClick={close} className="nav-drawer-close" aria-label="Close menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="nav-drawer-body">
            <SearchField className="nav-search nav-search-drawer" onSubmitted={close} />

            <nav aria-label="Shop">
              {COLLECTION_LINKS.map(({ label: lbl, to }) => (
                <NavLink key={lbl} to={to} onClick={close} className={({ isActive }) => `nav-drawer-link${isActive ? ' active' : ''}`}>
                  {lbl}
                </NavLink>
              ))}
            </nav>

            <div className="nav-drawer-section-label">More</div>

            <nav aria-label="Main">
              {NAV_LINKS.map(({ label: lbl, to }) => (
                <NavLink key={lbl} to={to} onClick={close} className={({ isActive }) => `nav-drawer-link${isActive ? ' active' : ''}`}>
                  {lbl}
                </NavLink>
              ))}
            </nav>

            <div className="nav-drawer-section-label">My Account</div>

            <nav aria-label="Account">
              {(user ? ACCOUNT_LINKS : []).map(({ label: lbl, to, icon }) => (
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

              {user ? (
                <form action={signOut}>
                  <button type="submit" className="nav-drawer-sublink" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
                    <span className="nav-drawer-sublink-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </span>
                    Sign out
                  </button>
                </form>
              ) : (
                <Link to="/auth" onClick={close} className="nav-drawer-sublink">
                  <span className="nav-drawer-sublink-icon"><UserIcon /></span>
                  Sign in
                </Link>
              )}
            </nav>
          </div>

          {isOwner && (
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
