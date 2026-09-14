'use client';

import { useCallback, useState } from 'react';
import { Link, NavLink, useNavigate } from '@/lib/router';
import { useOverlay } from '@/lib/useOverlay';
import { useCart } from '@/lib/cart';
import SignOutForm from './SignOutForm';
import type { CurrentUser } from '@/server/auth';
import { C, DISPLAY, label, UI } from '../tokens';
import { SearchIcon, HeartIcon, UserIcon, CartIcon, GridIcon } from '../icons';
import { COLLECTIONS } from '../data/products';

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
  // Nothing to announce on an empty cart, and a "0" badge reads as an error.
  if (count < 1) return null;

  return (
    <span className="nav-cart-badge" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function SearchField({ className, onSubmitted, autoFocus }: { className: string; onSubmitted?: () => void; autoFocus?: boolean }) {
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
        autoFocus={autoFocus}
      />
    </form>
  );
}

/** Turns a category name into the anchor CollectionPage gives its section. */
function categoryAnchor(name: string): string {
  return name.replace(/\s+/g, '-').toLowerCase();
}

export default function Nav({ user }: { user: CurrentUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);
  const isOwner = user?.role === 'OWNER';

  // Zero until the stored cart has been read, so the server's markup and the
  // first client render agree; the badge appears a moment later.
  const { count: cartCount } = useCart();
  const cartLabel = cartCount === 1 ? 'Cart, 1 item' : `Cart, ${cartCount} items`;

  useOverlay(menuOpen, close);

  return (
    <>
      <nav
        role="navigation"
        className="sticky top-0 z-50"
        style={{
          backgroundColor: C.maroon,
          borderBottom: '1px solid rgba(212,169,78,0.18)',
        }}
      >
        <div className="nav-bar">
          {/* Wordmark */}
          <Link to="/" onClick={close} className="no-underline shrink-0">
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
                className={({ isActive }) => `nav-text-link nav-dropdown-trigger${isActive ? ' active' : ''}`}
                style={label}
              >
                Shop
              </NavLink>

              <div className="nav-dropdown-menu nav-mega">
                <div className="nav-mega-grid">
                  {COLLECTIONS.map(col => (
                    <div key={col.slug} className="nav-mega-col">
                      <Link to={`/collections/${col.slug}`} className="nav-mega-heading">{col.name}</Link>
                      {col.categories.map(cat => (
                        <Link
                          key={cat}
                          to={`/collections/${col.slug}#${categoryAnchor(cat)}`}
                          className="nav-mega-link"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  ))}

                  {/* Featured panel — a way into the made-to-order line, like a
                      shop's promo tile. */}
                  <Link to="/custom-order" className="nav-mega-feature">
                    <span className="nav-mega-feature-eyebrow">Bespoke</span>
                    <span className="nav-mega-feature-title">Made to your measurements</span>
                    <span className="nav-mega-feature-cta">Start a custom order →</span>
                  </Link>
                </div>
              </div>
            </div>

            {NAV_LINKS.map(({ label: lbl, to }) => (
              <NavLink
                key={lbl}
                to={to}
                className={({ isActive }) => `nav-text-link${isActive ? ' active' : ''}`}
                style={label}
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
            <Link to="/cart" className="nav-icon-btn" aria-label={cartLabel}>
              <CartIcon />
              <CartBadge count={cartCount} />
            </Link>
          </div>

          {/* Mobile actions — search and cart stay reachable without opening the menu */}
          <div className="nav-actions-mobile">
            <button
              className="nav-icon-btn"
              onClick={() => setSearchOpen(v => !v)}
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              aria-controls="nav-mobile-search"
            >
              <SearchIcon />
            </button>
            <Link to="/cart" className="nav-icon-btn" aria-label={cartLabel}>
              <CartIcon />
              <CartBadge count={cartCount} />
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

        {/* Mobile search bar — revealed from the header, not buried in the menu */}
        {searchOpen && (
          <div className="nav-mobile-search" id="nav-mobile-search">
            <SearchField
              className="nav-search nav-search-mobilebar"
              onSubmitted={() => setSearchOpen(false)}
              autoFocus
            />
          </div>
        )}
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
              <div className="mt-[3px]" style={{ ...label, color: C.gold, fontSize: '0.53rem', letterSpacing: '0.15em' }}>
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
                {cartCount > 0 && <span className="nav-drawer-count">{cartCount}</span>}
              </Link>

              {user ? (
                <SignOutForm>
                  <button type="submit" className="nav-drawer-sublink w-full cursor-pointer text-left" style={{ background: 'none', border: 'none', font: 'inherit' }}>
                    <span className="nav-drawer-sublink-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </span>
                    Sign out
                  </button>
                </SignOutForm>
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
