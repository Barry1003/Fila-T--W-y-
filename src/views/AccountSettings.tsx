'use client';

import { useState } from 'react';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Shared primitives ──────────────────────────────────────── */
function SectionCard({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div className="rounded-[10px] p-7" style={{
      backgroundColor: danger ? 'rgba(185,45,45,0.03)' : '#fff',
      borderWidth: '1px', borderStyle: 'solid',
      borderColor: danger ? 'rgba(185,45,45,0.22)' : 'rgba(43,35,32,0.1)',
      boxShadow: danger ? 'none' : '0 1px 8px rgba(43,35,32,0.05)',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[1.375rem] pb-[0.875rem]" style={{
      ...label, fontSize: '0.63rem', letterSpacing: '0.13em',
      color: 'rgba(43,35,32,0.45)',
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
    <div className="mb-[1.1rem]">
      <label className="block mb-[0.4rem] uppercase" style={{
        fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em',
        color: 'rgba(43,35,32,0.52)',
      }}>
        {lbl}
      </label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="block w-full py-2.5 px-3.5 rounded-[5px] box-border"
          style={{
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid',
            borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
            outline: 'none',
            transition: 'border-color 0.15s',
            paddingRight: suffix ? '5.5rem' : undefined,
          }}
        />
        {suffix && (
          <div className="absolute right-3.5 pointer-events-none">
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
    <div className="mb-[1.1rem]">
      <label className="block mb-[0.4rem] uppercase" style={{
        fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em',
        color: 'rgba(43,35,32,0.52)',
      }}>
        {lbl}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full py-2.5 pr-10 pl-3.5 rounded-[5px] box-border cursor-pointer appearance-none"
        style={{
          fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
          backgroundColor: '#fff',
          borderWidth: '1.5px', borderStyle: 'solid',
          borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
          outline: 'none',
          transition: 'border-color 0.15s',
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
    <div className="mb-[1.1rem]">
      <label className="block mb-[0.4rem] uppercase" style={{
        fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
        letterSpacing: '0.09em',
        color: 'rgba(43,35,32,0.52)',
      }}>
        Phone Number
      </label>
      <div className="flex gap-2">
        <select
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          className="shrink-0 w-[88px] py-2.5 px-2 rounded-[5px] cursor-pointer appearance-none text-center"
          style={{
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.18)',
            outline: 'none',
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
          className="flex-1 py-2.5 px-3.5 rounded-[5px] box-border"
          style={{
            fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
            backgroundColor: '#fff',
            borderWidth: '1.5px', borderStyle: 'solid',
            borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
            outline: 'none',
            transition: 'border-color 0.15s',
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
      className="py-[0.7rem] px-[1.625rem] rounded-[5px] cursor-pointer uppercase"
      style={{
        backgroundColor: C.gold, color: C.charcoal,
        fontFamily: UI, fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em',
        border: 'none',
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
      className="shrink-0 w-[42px] h-6 rounded-[12px] p-[3px] flex items-center cursor-pointer"
      style={{
        backgroundColor: on ? C.gold : 'rgba(43,35,32,0.18)',
        border: 'none',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'background-color 0.22s',
      }}
    >
      <span className="block w-[18px] h-[18px] rounded-full" style={{
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(43,35,32,0.22)',
        transition: 'transform 0.22s',
      }} />
    </button>
  );
}

function ToggleRow({ title, description, on, onChange }: {
  title: string; description: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-5 py-4" style={{
      borderBottom: '1px solid rgba(43,35,32,0.07)',
    }}>
      <div className="flex-1 min-w-0">
        <div className="mb-[0.2rem]" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal }}>
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
    <span className="inline-flex items-center gap-[3px] py-[1px] px-[7px] rounded-[3px] uppercase" style={{
      fontFamily: UI, fontSize: '0.62rem', fontWeight: 700,
      letterSpacing: '0.08em',
      color: C.teal, backgroundColor: 'rgba(59,138,147,0.1)',
      borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.25)',
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
    <span className="inline-flex items-center gap-1" style={{
      fontFamily: UI, fontSize: '0.75rem', color: C.teal,
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
      className="py-[0.65rem] px-[1.375rem] rounded-[5px] cursor-pointer uppercase"
      style={{
        backgroundColor: hov ? (red ? 'rgba(185,45,45,0.06)' : 'rgba(43,35,32,0.04)') : 'transparent',
        color: hov ? hovColor : baseColor,
        fontFamily: UI, fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.08em',
        borderWidth: '1.5px', borderStyle: 'solid',
        borderColor: hov ? hovColor : baseColor,
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
    <div className="flex items-center gap-5 mb-6">
      <div className="w-[68px] h-[68px] rounded-full shrink-0 flex items-center justify-center" style={{
        background: `linear-gradient(135deg, ${C.maroon} 0%, rgba(122,46,56,0.62) 100%)`,
        boxShadow: '0 2px 12px rgba(122,46,56,0.22)',
      }}>
        <span className="block" style={{ fontFamily: DISPLAY, fontSize: '1.5rem', color: '#fff', fontWeight: 500, lineHeight: 1 }}>A</span>
      </div>
      <div>
        <div className="mb-[0.35rem]" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal }}>
          Profile Photo
        </div>
        <button className="p-0 cursor-pointer no-underline" style={{
          background: 'none', border: 'none',
          fontFamily: UI, fontSize: '0.78rem', fontWeight: 600,
          color: C.indigo,
          transition: 'opacity 0.15s',
        }}>
          Change Photo
        </button>
        <span className="ml-2.5" style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.38)' }}>
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
      <div className="mb-8">
        <h1 style={{
          fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500,
          color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>
          Account Settings
        </h1>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── 1. Profile ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Profile</SectionLabel>
          <AvatarBlock />

          <div className="rg-2 grid grid-cols-2 gap-x-4">
            <FInput label="Full Name" value={fullName} onChange={setFullName} />
            <div className="mb-[1.1rem]">
              <label className="block mb-[0.4rem] uppercase" style={{
                fontFamily: UI, fontSize: '0.67rem', fontWeight: 600,
                letterSpacing: '0.09em',
                color: 'rgba(43,35,32,0.52)',
              }}>
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="block w-full py-2.5 pl-3.5 pr-[6.5rem] rounded-[5px] box-border"
                  style={{
                    fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
                    backgroundColor: 'rgba(43,35,32,0.03)',
                    borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.12)',
                    outline: 'none',
                    cursor: 'default',
                  }}
                />
                <div className="absolute right-3">
                  <VerifiedBadge />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[50%] pr-2">
            <PhoneInput
              value={phone}
              onChange={setPhone}
              code={phoneCode}
              onCodeChange={setPhoneCode}
            />
          </div>

          <div className="flex justify-end items-center gap-4 mt-2">
            <SaveFeedback visible={profileSaved} />
            <GoldButton onClick={() => flash(setProfileSaved)}>Save Changes</GoldButton>
          </div>
        </SectionCard>

        {/* ── 2. Password ─────────────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Password</SectionLabel>
          <div className="max-w-[480px]">
            <FInput label="Current Password" type="password" value={currentPw} onChange={setCurrentPw} placeholder="••••••••••" />
            <div className="rg-2 grid grid-cols-2 gap-x-4">
              <FInput label="New Password" type="password" value={newPw} onChange={setNewPw} placeholder="••••••••••" />
              <FInput label="Confirm New Password" type="password" value={confirmPw} onChange={setConfirmPw} placeholder="••••••••••" />
            </div>
            <div className="mb-[1.375rem]" style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.42)', lineHeight: 1.6 }}>
              Use 8 or more characters with a mix of letters, numbers, and symbols.
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <SaveFeedback visible={pwSaved} />
            <GoldButton onClick={() => flash(setPwSaved)}>Update Password</GoldButton>
          </div>
        </SectionCard>

        {/* ── 3. Notification Preferences ─────────────────────────── */}
        <SectionCard>
          <SectionLabel>Notification Preferences</SectionLabel>
          <div className="flex flex-col">
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
          <div className="flex justify-end items-center gap-4 mt-5">
            <SaveFeedback visible={notifSaved} />
            <GoldButton onClick={() => flash(setNotifSaved)}>Save Preferences</GoldButton>
          </div>
        </SectionCard>

        {/* ── 4. Language & Region ─────────────────────────────────── */}
        <SectionCard>
          <SectionLabel>Language &amp; Region</SectionLabel>
          <div className="rg-2 grid grid-cols-2 gap-x-4 max-w-[560px]">
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
              ]}
            />
          </div>
          <div className="mb-5" style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.42)', lineHeight: 1.6 }}>
            NGN equivalent is always shown as secondary pricing. Your primary currency setting controls the displayed checkout total.
          </div>
          <div className="flex justify-end items-center gap-4">
            <SaveFeedback visible={regionSaved} />
            <GoldButton onClick={() => flash(setRegionSaved)}>Save Preferences</GoldButton>
          </div>
        </SectionCard>

        {/* ── 5. Danger Zone ───────────────────────────────────────── */}
        <div>
          {/* Separator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(43,35,32,0.08)' }} />
            <span className="uppercase" style={{ ...label, fontSize: '0.6rem', color: 'rgba(43,35,32,0.3)', letterSpacing: '0.14em' }}>
              Danger Zone
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(43,35,32,0.08)' }} />
          </div>

          <SectionCard danger>
            <SectionLabel>Account Actions</SectionLabel>
            <div className="flex flex-col gap-[1.375rem]">

              {/* Deactivate */}
              <div className="flex items-start justify-between gap-8">
                <div>
                  <div className="mb-[0.3rem]" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal }}>
                    Deactivate Account
                  </div>
                  <div className="max-w-[400px]" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55 }}>
                    Temporarily disable your account. You can reactivate at any time by signing back in.
                  </div>
                </div>
                <div className="shrink-0">
                  <OutlineBtn>Deactivate</OutlineBtn>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ backgroundColor: 'rgba(185,45,45,0.12)' }} />

              {/* Delete */}
              <div className="flex items-start justify-between gap-8">
                <div>
                  <div className="mb-[0.3rem]" style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: 'rgba(185,45,45,0.85)' }}>
                    Delete Account
                  </div>
                  <div className="max-w-[400px]" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.55 }}>
                    Permanently remove your account and all associated data. Orders and purchase history will be lost.
                  </div>
                  <div className="inline-flex items-center gap-[0.4rem] mt-2" style={{
                    fontFamily: UI, fontSize: '0.72rem', color: 'rgba(185,45,45,0.65)',
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    This action is permanent and cannot be undone.
                  </div>
                </div>
                <div className="shrink-0">
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
