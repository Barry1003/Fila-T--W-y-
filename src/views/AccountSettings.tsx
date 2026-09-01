'use client';

import { useState } from 'react';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Shared primitives ──────────────────────────────────────── */
function SectionCard({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{
      backgroundColor: danger ? 'rgba(185,45,45,0.03)' : '#fff',
      borderRadius: '10px',
      borderWidth: '1px', borderStyle: 'solid',
      borderColor: danger ? 'rgba(185,45,45,0.22)' : 'rgba(43,35,32,0.1)',
      padding: '1.75rem',
      boxShadow: danger ? 'none' : '0 1px 8px rgba(43,35,32,0.05)',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      ...label, fontSize: '0.63rem', letterSpacing: '0.13em',
      color: 'rgba(43,35,32,0.45)', marginBottom: '1.375rem',
      paddingBottom: '0.875rem',
      borderBottom: '1px solid rgba(43,35,32,0.08)',
    }}>
      {children}
    </div>
  );
}

function FInput({ label: lbl, type = 'text', value, onChange, placeholder, suffix }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{
        display: 'block', fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em', textTransform: 'uppercase',
        color: 'rgba(43,35,32,0.52)', marginBottom: '0.4rem',
      }}>
        {lbl}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: 'block', width: '100%', padding: '0.625rem 0.875rem',
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid',
            borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
            borderRadius: '5px', outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
            paddingRight: suffix ? '5.5rem' : undefined,
          }}
        />
        {suffix && (
          <div style={{ position: 'absolute', right: '0.875rem', pointerEvents: 'none' }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

function FSelect({ label: lbl, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{
        display: 'block', fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em', textTransform: 'uppercase',
        color: 'rgba(43,35,32,0.52)', marginBottom: '0.4rem',
      }}>
        {lbl}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: 'block', width: '100%', padding: '0.625rem 2.5rem 0.625rem 0.875rem',
          fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
          backgroundColor: '#fff',
          borderWidth: '1.5px', borderStyle: 'solid',
          borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
          borderRadius: '5px', outline: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box', cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(43,35,32,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.875rem center',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function PhoneInput({ value, onChange, code, onCodeChange }: {
  value: string; onChange: (v: string) => void;
  code: string; onCodeChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const CODES = ['+234', '+1', '+44', '+33', '+49', '+61', '+254', '+233', '+27', '+32'];
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{
        display: 'block', fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em', textTransform: 'uppercase',
        color: 'rgba(43,35,32,0.52)', marginBottom: '0.4rem',
      }}>
        Phone Number
      </label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <select
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          style={{
            flexShrink: 0, width: '88px',
            padding: '0.625rem 0.5rem',
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.18)',
            borderRadius: '5px', outline: 'none', cursor: 'pointer',
            appearance: 'none', textAlign: 'center',
          }}
        >
          {CODES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="tel"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="806 123 4567"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '0.625rem 0.875rem',
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid',
            borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
            borderRadius: '5px', outline: 'none',
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}

function GoldButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '0.7rem 1.625rem',
        backgroundColor: C.gold, color: C.charcoal,
        fontFamily: UI, fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        border: 'none', borderRadius: '5px', cursor: 'pointer',
        boxShadow: hov ? '0 4px 18px rgba(212,169,78,0.45)' : '0 2px 12px rgba(212,169,78,0.3)',
        transition: 'box-shadow 0.2s, transform 0.15s',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Toggle switch ──────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        flexShrink: 0,
        width: '42px', height: '24px', borderRadius: '12px',
        backgroundColor: on ? C.gold : 'rgba(43,35,32,0.18)',
        border: 'none', cursor: 'pointer', padding: '3px',
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'background-color 0.22s',
      }}
    >
      <span style={{
        width: '18px', height: '18px', borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(43,35,32,0.22)',
        display: 'block',
        transition: 'transform 0.22s',
      }} />
    </button>
  );
}

function ToggleRow({ title, description, on, onChange }: {
  title: string; description: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.25rem',
      padding: '1rem 0',
      borderBottom: '1px solid rgba(43,35,32,0.07)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.2rem' }}>
          {title}
        </div>
        <div style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.5 }}>
          {description}
        </div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

/* ─── Verified badge ─────────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontFamily: UI, fontSize: '0.62rem', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: C.teal, backgroundColor: 'rgba(59,138,147,0.1)',
      borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.25)',
      padding: '1px 7px', borderRadius: '3px',
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Verified
    </span>
  );
}

/* ─── Save confirmation flash ────────────────────────────────── */
function SaveFeedback({ visible }: { visible: boolean }) {
  return (
    <span style={{
      fontFamily: UI, fontSize: '0.75rem', color: C.teal,
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Saved
    </span>
  );
}

/* ─── Danger Zone buttons ────────────────────────────────────── */
function OutlineBtn({ children, red, onClick }: { children: React.ReactNode; red?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  const baseColor = red ? 'rgba(185,45,45,0.65)' : C.charcoal;
  const hovColor = red ? '#b92d2d' : C.charcoal;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '0.65rem 1.375rem',
        backgroundColor: hov ? (red ? 'rgba(185,45,45,0.06)' : 'rgba(43,35,32,0.04)') : 'transparent',
        color: hov ? hovColor : baseColor,
        fontFamily: UI, fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        borderWidth: '1.5px', borderStyle: 'solid',
        borderColor: hov ? hovColor : baseColor,
        borderRadius: '5px', cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Avatar block ───────────────────────────────────────────── */
function AvatarBlock() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{
        width: '68px', height: '68px', borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${C.maroon} 0%, rgba(122,46,56,0.62) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(122,46,56,0.22)',
      }}>
        <span style={{ fontFamily: DISPLAY, fontSize: '1.5rem', color: '#fff', fontWeight: 500, lineHeight: 1 }}>A</span>
      </div>
      <div>
        <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.35rem' }}>
          Profile Photo
        </div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: UI, fontSize: '0.78rem', fontWeight: 600,
          color: C.indigo, textDecorationLine: 'none',
          transition: 'opacity 0.15s',
        }}>
          Change Photo
        </button>
        <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.38)', marginLeft: '0.625rem' }}>
          JPG, PNG · max 5MB
        </span>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function AccountSettings() {
  /* Profile */
  const [fullName, setFullName] = useState('Adunola Okonkwo');
  const [email] = useState('adunola@example.com');
  const [phoneCode, setPhoneCode] = useState('+234');
  const [phone, setPhone] = useState('806 123 4567');
  const [profileSaved, setProfileSaved] = useState(false);

  /* Password */
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  /* Notifications */
  const [notif, setNotif] = useState({
    orderUpdates: true,
    promotions: false,
    restockAlerts: true,
    sms: false,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  /* Region */
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('cad');
  const [regionSaved, setRegionSaved] = useState(false);

  function flash(set: (v: boolean) => void) {
    set(true);
    setTimeout(() => set(false), 2200);
  }

  return (
    <AccountShell>
      {/* Page title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500,
          color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>
          Account Settings
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── 1. Profile ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Profile</SectionLabel>
          <AvatarBlock />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <FInput label="Full Name" value={fullName} onChange={setFullName} />
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{
                display: 'block', fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
                letterSpacing: '0.09em', textTransform: 'uppercase',
                color: 'rgba(43,35,32,0.52)', marginBottom: '0.4rem',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{
                    display: 'block', width: '100%', padding: '0.625rem 0.875rem',
                    fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
                    backgroundColor: 'rgba(43,35,32,0.03)',
                    borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.12)',
                    borderRadius: '5px', outline: 'none',
                    boxSizing: 'border-box', paddingRight: '6.5rem',
                    cursor: 'default',
                  }}
                />
                <div style={{ position: 'absolute', right: '0.75rem' }}>
                  <VerifiedBadge />
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '50%', paddingRight: '0.5rem' }}>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              code={phoneCode}
              onCodeChange={setPhoneCode}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <SaveFeedback visible={profileSaved} />
            <GoldButton onClick={() => flash(setProfileSaved)}>Save Changes</GoldButton>
          </div>
        </SectionCard>

        {/* ── 2. Password ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Password</SectionLabel>
          <div style={{ maxWidth: '480px' }}>
            <FInput label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} placeholder="••••••••••" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <FInput label="New Password" type="password" value={newPw} onChange={setNewPw} placeholder="••••••••••" />
              <FInput label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="••••••••••" />
            </div>
            <div style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.42)', lineHeight: 1.6, marginBottom: '1.375rem' }}>
              Use 8 or more characters with a mix of letters, numbers, and symbols.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <SaveFeedback visible={pwSaved} />
            <GoldButton onClick={() => flash(setPwSaved)}>Update Password</GoldButton>
          </div>
        </SectionCard>

        {/* ── 3. Notification Preferences ─────────────────────────── */}
        <SectionCard>
          <SectionLabel>Notification Preferences</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ToggleRow
              title="Order updates"
              description="Shipping and delivery notifications for your orders"
              on={notif.orderUpdates}
              onChange={v => setNotif(n => ({ ...n, orderUpdates: v }))}
            />
            <ToggleRow
              title="Promotions & offers"
              description="Marketing emails with new arrivals and exclusive discounts"
              on={notif.promotions}
              onChange={v => setNotif(n => ({ ...n, promotions: v }))}
            />
            <ToggleRow
              title="Restock alerts"
              description="Notifications when wishlist items become available again"
              on={notif.restockAlerts}
              onChange={v => setNotif(n => ({ ...n, restockAlerts: v }))}
            />
            <ToggleRow
              title="SMS notifications"
              description="Order updates and delivery alerts sent via text message"
              on={notif.sms}
              onChange={v => setNotif(n => ({ ...n, sms: v }))}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
            <SaveFeedback visible={notifSaved} />
            <GoldButton onClick={() => flash(setNotifSaved)}>Save Preferences</GoldButton>
          </div>
        </SectionCard>

        {/* ── 4. Language & Region ─────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Language &amp; Region</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem', maxWidth: '560px' }}>
            <FSelect
              label="Language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'Français' },
                { value: 'yo', label: 'Yorùbá' },
                { value: 'ig', label: 'Igbo' },
                { value: 'ha', label: 'Hausa' },
              ]}
            />
            <FSelect
              label="Primary Currency"
              value={currency}
              onChange={setCurrency}
              options={[
                { value: 'cad', label: 'CAD — Canadian Dollar' },
                { value: 'ngn', label: 'NGN — Nigerian Naira' },
                { value: 'usd', label: 'USD — US Dollar' },
                { value: 'gbp', label: 'GBP — British Pound' },
              ]}
            />
          </div>
          <div style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.42)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            NGN equivalent is always shown as secondary pricing. Your primary currency setting controls the displayed checkout total.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            <SaveFeedback visible={regionSaved} />
            <GoldButton onClick={() => flash(setRegionSaved)}>Save Preferences</GoldButton>
          </div>
        </SectionCard>

        {/* ── 5. Danger Zone ───────────────────────────────────────── */}
        <div>
          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(43,35,32,0.08)' }} />
            <span style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.3)', letterSpacing: '0.14em' }}>
              Danger Zone
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(43,35,32,0.08)' }} />
          </div>

          <SectionCard danger>
            <SectionLabel>Account Actions</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>

              {/* Deactivate */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
                <div>
                  <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.3rem' }}>
                    Deactivate Account
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55, maxWidth: '400px' }}>
                    Temporarily disable your account. You can reactivate at any time by signing back in.
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <OutlineBtn>Deactivate</OutlineBtn>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'rgba(185,45,45,0.12)' }} />

              {/* Delete */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
                <div>
                  <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: 'rgba(185,45,45,0.85)', marginBottom: '0.3rem' }}>
                    Delete Account
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55, maxWidth: '400px' }}>
                    Permanently remove your account and all associated data. Orders and purchase history will be lost.
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    marginTop: '0.5rem',
                    fontFamily: UI, fontSize: '0.72rem', color: 'rgba(185,45,45,0.65)',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    This action is permanent and cannot be undone.
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <OutlineBtn red>Delete Account</OutlineBtn>
                </div>
              </div>

            </div>
          </SectionCard>
        </div>

      </div>
    </AccountShell>
  );
}
