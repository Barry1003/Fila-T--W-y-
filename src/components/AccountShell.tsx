'use client';

import { NavLink } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

type SidebarItem = {
  key: string;
  label: string;
  to: string;
  icon: React.ReactNode;
};

const ITEMS: SidebarItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    to: '/account',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'orders',
    label: 'Orders & Tracking',
    to: '/account/orders',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: 'custom-orders',
    label: 'My Custom Orders',
    to: '/account/custom-orders',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
  },
  {
    key: 'wishlist',
    label: 'Wishlist',
    to: '/account/wishlist',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    key: 'addresses',
    label: 'Saved Addresses',
    to: '/account/addresses',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: 'payment',
    label: 'Payment Methods',
    to: '/account/payment',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    key: 'settings',
    label: 'Account Settings',
    to: '/account/settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    key: 'reviews',
    label: 'Reviews I\'ve Written',
    to: '/account/reviews',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    key: 'support',
    label: 'Support Inbox',
    to: '/account/support',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const SIGN_OUT_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AccountShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: 'calc(100vh - 70px)', fontFamily: UI }}>

      {/* ── Mobile nav — a scrolling tab strip replaces the sidebar ─────── */}
      <div className="account-mobile-nav">
        <div className="account-mobile-id">
          <div className="account-mobile-avatar">
            <span style={{ fontFamily: DISPLAY, fontSize: '0.95rem', color: C.cream, fontWeight: 500, lineHeight: 1 }}>A</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="account-mobile-name">Adunola Okonkwo</div>
            <div className="account-mobile-email">adunola@example.com</div>
          </div>
        </div>

        <nav className="account-mobile-tabs" aria-label="Account sections">
          {ITEMS.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/account'}
              className={({ isActive }) => `account-tab${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="account-layout" style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem 2.5rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '3rem', alignItems: 'start' }}>

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="account-sidebar-col">
          {/* Avatar block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: `1px solid rgba(43,35,32,0.1)` }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.maroon} 0%, rgba(122,46,56,0.6) 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: DISPLAY, fontSize: '1.1rem', color: C.cream, fontWeight: 500, lineHeight: 1 }}>A</span>
            </div>
            <div>
              <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, lineHeight: 1.3 }}>Adunola Okonkwo</div>
              <div style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.48)', marginTop: '2px' }}>adunola@example.com</div>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {ITEMS.map(item => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === '/account'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '5px',
                  textDecorationLine: 'none',
                  fontFamily: UI,
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.charcoal : 'rgba(43,35,32,0.55)',
                  backgroundColor: isActive ? 'rgba(212,169,78,0.1)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${C.gold}` : '3px solid transparent',
                  transition: 'all 0.15s',
                })}
              >
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? C.gold : 'rgba(43,35,32,0.38)', flexShrink: 0, lineHeight: 0 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}

            {/* Sign out */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.875rem', marginTop: '0.75rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: UI, fontSize: '0.84rem', color: 'rgba(43,35,32,0.45)',
                textAlign: 'left', borderRadius: '5px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.maroon)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.45)')}
            >
              <span style={{ lineHeight: 0 }}>{SIGN_OUT_ICON}</span>
              Sign Out
            </button>
          </nav>
        </aside>

        {/* ── Main content ───────────────────────────────── */}
        <main style={{ minWidth: 0 }}>
          {children}
        </main>
      </div>

    </div>
  );
}
