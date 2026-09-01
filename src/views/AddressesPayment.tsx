'use client';

import { useState } from 'react';
import { useLocation, useNavigate } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Types ─────────────────────────────────────────────────── */
type Address = {
  id: number;
  isDefault: boolean;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone: string;
};

type Payment = {
  id: number;
  isDefault: boolean;
  brand: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
};

type AddrForm = Omit<Address, 'id'>;
type PayForm = { cardNumber: string; expiry: string; cvc: string; nameOnCard: string; sameAsShipping: boolean };

/* ─── Seed data ──────────────────────────────────────────────── */
const SEED_ADDR: Address[] = [
  {
    id: 1, isDefault: true, name: 'Adunola Okonkwo',
    line1: '14 Adeola Hopewell Street', line2: '',
    city: 'Victoria Island', state: 'Lagos', postal: '101001', country: 'Nigeria',
    phone: '+234 806 123 4567',
  },
  {
    id: 2, isDefault: false, name: 'Adunola Okonkwo',
    line1: '3120 Bathurst Street', line2: 'Apt 4B',
    city: 'Toronto', state: 'ON', postal: 'M6A 2A1', country: 'Canada',
    phone: '+1 416 555 0198',
  },
];

const SEED_PAY: Payment[] = [
  { id: 1, isDefault: true, brand: 'visa', last4: '4242', expiry: '09/27' },
  { id: 2, isDefault: false, brand: 'mastercard', last4: '8804', expiry: '03/26' },
];

const COUNTRIES = [
  'Nigeria', 'Canada', 'United Kingdom', 'United States',
  'Ghana', 'Kenya', 'South Africa', 'France', 'Germany', 'Australia',
];

const BLANK_ADDR: AddrForm = {
  isDefault: false, name: '', line1: '', line2: '',
  city: '', state: '', postal: '', country: 'Nigeria', phone: '',
};

const BLANK_PAY: PayForm = {
  cardNumber: '', expiry: '', cvc: '', nameOnCard: '', sameAsShipping: true,
};

/* ─── Card brand icons ───────────────────────────────────────── */
function VisaIcon() {
  return (
    <svg width="42" height="28" viewBox="0 0 42 28" style={{ display: 'block', flexShrink: 0 }}>
      <rect width="42" height="28" rx="4" fill="#1A1F71" />
      <text x="50%" y="19" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800"
        fontFamily="Arial,Helvetica,sans-serif" letterSpacing="1.5">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg width="42" height="28" viewBox="0 0 42 28" style={{ display: 'block', flexShrink: 0 }}>
      <rect width="42" height="28" rx="4" fill="#1D1D1B" />
      <circle cx="16" cy="14" r="8" fill="#EB001B" />
      <circle cx="26" cy="14" r="8" fill="#F79E1B" />
      <path d="M21 7.2a8 8 0 0 1 0 13.6A8 8 0 0 1 21 7.2z" fill="#FF5F00" />
    </svg>
  );
}

/* ─── Form field primitives ──────────────────────────────────── */
function FInput({ label: lbl, placeholder, type = 'text', value, onChange, required }: {
  label: string; placeholder?: string; type?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.05rem' }}>
      <label style={{
        display: 'block', fontFamily: UI, fontSize: '0.66rem', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(43,35,32,0.52)', marginBottom: '0.38rem',
      }}>
        {lbl}{required && <span style={{ color: C.maroon }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
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
        }}
      />
    </div>
  );
}

function FSelect({ label: lbl, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.05rem' }}>
      <label style={{
        display: 'block', fontFamily: UI, fontSize: '0.66rem', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(43,35,32,0.52)', marginBottom: '0.38rem',
      }}>
        {lbl}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
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
          boxSizing: 'border-box', cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(43,35,32,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.875rem center',
          paddingRight: '2.5rem',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FCheckbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: '15px', height: '15px', accentColor: C.gold, cursor: 'pointer', flexShrink: 0 }}
      />
      <span style={{ fontFamily: UI, fontSize: '0.82rem', color: C.charcoal, lineHeight: 1.4 }}>{children}</span>
    </label>
  );
}

/* ─── Slide-over shell ───────────────────────────────────────── */
function SlideOver({ title, onClose, onSave, saveLabel, children }: {
  title: string; onClose: () => void; onSave: () => void; saveLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'stretch' }}>
      <div
        onClick={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(43,35,32,0.42)', backdropFilter: 'blur(3px)', cursor: 'pointer' }}
      />
      <div style={{
        width: 'min(520px, 92vw)', backgroundColor: C.cream,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-16px 0 56px rgba(43,35,32,0.18)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.75rem 2rem', borderBottom: `1px solid rgba(43,35,32,0.1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h2 style={{
            fontFamily: DISPLAY, fontSize: '1.375rem', fontWeight: 500,
            color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.2,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px', lineHeight: 0,
              color: 'rgba(43,35,32,0.38)', borderRadius: '4px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.charcoal)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.38)')}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.25rem 2rem', borderTop: `1px solid rgba(43,35,32,0.1)`,
          display: 'flex', gap: '0.75rem', flexShrink: 0,
          backgroundColor: '#fff',
        }}>
          <button
            onClick={onSave}
            style={{
              flex: 1, padding: '0.8rem 1.25rem',
              backgroundColor: C.gold, color: C.charcoal,
              fontFamily: UI, fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', borderRadius: '5px', cursor: 'pointer',
              boxShadow: '0 2px 14px rgba(212,169,78,0.38)', transition: 'opacity 0.15s',
            }}
          >
            {saveLabel}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.8rem 1.125rem',
              backgroundColor: 'transparent', color: 'rgba(43,35,32,0.52)',
              fontFamily: UI, fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.2)',
              borderRadius: '5px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.charcoal; e.currentTarget.style.color = C.charcoal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(43,35,32,0.2)'; e.currentTarget.style.color = 'rgba(43,35,32,0.52)'; }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Address slide-over form ────────────────────────────────── */
function AddressSlideOver({ initial, isEdit, onSave, onClose }: {
  initial: AddrForm; isEdit: boolean; onSave: (d: AddrForm) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<AddrForm>(initial);
  const set = <K extends keyof AddrForm>(k: K) => (v: AddrForm[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <SlideOver
      title={isEdit ? 'Edit Address' : 'Add New Address'}
      onClose={onClose}
      onSave={() => onSave(form)}
      saveLabel="Save Address"
    >
      <FInput label="Full Name" value={form.name} onChange={set('name')} required />
      <FInput label="Address Line 1" value={form.line1} onChange={set('line1')} required />
      <FInput label="Address Line 2" placeholder="Apartment, suite, etc. (optional)" value={form.line2} onChange={set('line2')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
        <FInput label="City" value={form.city} onChange={set('city')} required />
        <FInput label="State / Province" value={form.state} onChange={set('state')} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
        <FInput label="Postal / ZIP" value={form.postal} onChange={set('postal')} required />
        <FSelect label="Country" value={form.country} onChange={set('country')} options={COUNTRIES} />
      </div>
      <FInput label="Phone Number" type="tel" placeholder="+1 000 000 0000" value={form.phone} onChange={set('phone')} required />
      <div style={{ paddingTop: '0.75rem', marginTop: '0.25rem', borderTop: `1px solid rgba(43,35,32,0.08)` }}>
        <FCheckbox checked={form.isDefault} onChange={v => set('isDefault')(v)}>
          Set as default shipping address
        </FCheckbox>
      </div>
    </SlideOver>
  );
}

/* ─── Payment slide-over form ────────────────────────────────── */
function PaymentSlideOver({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState<PayForm>(BLANK_PAY);
  const set = <K extends keyof PayForm>(k: K) => (v: PayForm[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <SlideOver
      title="Add Payment Method"
      onClose={onClose}
      onSave={onSave}
      saveLabel="Save Card"
    >
      <FInput label="Card Number" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={set('cardNumber')} required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
        <FInput label="Expiry (MM / YY)" placeholder="09/27" value={form.expiry} onChange={set('expiry')} required />
        <FInput label="CVC" type="password" placeholder="•••" value={form.cvc} onChange={set('cvc')} required />
      </div>
      <FInput label="Name on Card" placeholder="As it appears on card" value={form.nameOnCard} onChange={set('nameOnCard')} required />

      <div style={{ paddingTop: '1rem', marginTop: '0.5rem', borderTop: `1px solid rgba(43,35,32,0.08)` }}>
        <div style={{ ...label, fontSize: '0.65rem', color: 'rgba(43,35,32,0.52)', marginBottom: '0.875rem' }}>
          Billing Address
        </div>
        <FCheckbox checked={form.sameAsShipping} onChange={v => set('sameAsShipping')(v)}>
          Same as default shipping address
        </FCheckbox>
      </div>

      {/* Trust note */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
        marginTop: '1.5rem', padding: '0.875rem 1rem',
        backgroundColor: 'rgba(59,138,147,0.06)',
        borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.18)',
        borderRadius: '6px',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.5)', lineHeight: 1.6 }}>
          Payments processed securely via Paystack / Flutterwave — we never store your full card details.
        </span>
      </div>
    </SlideOver>
  );
}

/* ─── Address card ───────────────────────────────────────────── */
function AddressCard({ addr, onEdit, onDelete, onSetDefault }: {
  addr: Address; onEdit: () => void; onDelete: () => void; onSetDefault: () => void;
}) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '8px', padding: '1.375rem',
      borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.11)',
      boxShadow: '0 1px 8px rgba(43,35,32,0.05)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Default badge — same height whether visible or not */}
      <div style={{ height: '22px', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
        {addr.isDefault && (
          <span style={{
            ...label, fontSize: '0.58rem', letterSpacing: '0.12em',
            backgroundColor: C.gold, color: C.charcoal,
            padding: '2px 8px', borderRadius: '3px', display: 'inline-block',
          }}>
            Default
          </span>
        )}
      </div>

      <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.4rem' }}>
        {addr.name}
      </div>
      <div style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)', lineHeight: 1.72, flex: 1 }}>
        {addr.line1}
        {addr.line2 && <><br />{addr.line2}</>}
        <br />{addr.city}, {addr.state} {addr.postal}
        <br />{addr.country}
        <br />{addr.phone}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        marginTop: '1.125rem', paddingTop: '0.875rem',
        borderTop: `1px solid rgba(43,35,32,0.07)`,
      }}>
        <TextBtn color={C.indigo} onClick={onEdit}>Edit</TextBtn>
        {!addr.isDefault && (
          <>
            <TextBtn color="rgba(43,35,32,0.42)" hoverColor={C.charcoal} onClick={onSetDefault}>
              Set Default
            </TextBtn>
            <TextBtn color="rgba(185,45,45,0.65)" hoverColor="#b92d2d" onClick={onDelete} right>
              Delete
            </TextBtn>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Payment card ───────────────────────────────────────────── */
function PaymentCard({ pay, onEdit, onRemove, onSetDefault }: {
  pay: Payment; onEdit: () => void; onRemove: () => void; onSetDefault: () => void;
}) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '8px', padding: '1.25rem 1.5rem',
      borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.11)',
      boxShadow: '0 1px 8px rgba(43,35,32,0.05)',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      {pay.brand === 'visa' ? <VisaIcon /> : <MastercardIcon />}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, letterSpacing: '0.04em' }}>
          •••• •••• •••• {pay.last4}
        </div>
        <div style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.48)', marginTop: '3px' }}>
          Expires {pay.expiry}
        </div>
      </div>

      {pay.isDefault && (
        <span style={{
          ...label, fontSize: '0.58rem', letterSpacing: '0.12em',
          backgroundColor: 'rgba(212,169,78,0.12)', color: 'rgba(43,35,32,0.7)',
          borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(212,169,78,0.45)',
          padding: '2px 8px', borderRadius: '3px', flexShrink: 0,
        }}>
          Default
        </span>
      )}

      <div style={{ display: 'flex', gap: '0.875rem', flexShrink: 0 }}>
        <TextBtn color={C.indigo} onClick={onEdit}>Edit</TextBtn>
        {!pay.isDefault && (
          <TextBtn color="rgba(43,35,32,0.42)" hoverColor={C.charcoal} onClick={onSetDefault}>
            Set Default
          </TextBtn>
        )}
        <TextBtn color="rgba(185,45,45,0.65)" hoverColor="#b92d2d" onClick={onRemove}>
          Remove
        </TextBtn>
      </div>
    </div>
  );
}

/* ─── Add new (dashed) card ──────────────────────────────────── */
function AddNewCard({ text, onClick }: { text: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '0.6rem', padding: '2.75rem 1rem', width: '100%',
        backgroundColor: hov ? 'rgba(43,35,32,0.03)' : 'transparent',
        borderWidth: '1.5px', borderStyle: 'dashed',
        borderColor: hov ? 'rgba(43,35,32,0.5)' : 'rgba(43,35,32,0.25)',
        borderRadius: '8px', cursor: 'pointer',
        transition: 'border-color 0.18s, background 0.18s',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={hov ? C.charcoal : 'rgba(43,35,32,0.32)'} strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span style={{
        fontFamily: UI, fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.09em', textTransform: 'uppercase',
        color: hov ? C.charcoal : 'rgba(43,35,32,0.4)',
        transition: 'color 0.18s',
      }}>
        {text}
      </span>
    </button>
  );
}

/* ─── Shared text button ─────────────────────────────────────── */
function TextBtn({ color, hoverColor, onClick, right, children }: {
  color: string; hoverColor?: string; onClick: () => void; right?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        fontFamily: UI, fontSize: '0.77rem', fontWeight: 600,
        color, transition: 'color 0.15s',
        marginLeft: right ? 'auto' : undefined,
      }}
      onMouseEnter={e => { if (hoverColor) e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { if (hoverColor) e.currentTarget.style.color = color; }}
    >
      {children}
    </button>
  );
}

/* ─── Trust note (payment tab) ───────────────────────────────── */
function TrustNote() {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
      padding: '0.875rem 1.125rem', marginTop: '0.5rem',
      backgroundColor: 'rgba(59,138,147,0.055)',
      borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(59,138,147,0.16)',
      borderRadius: '6px',
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal}
        strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '2px' }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span style={{ fontFamily: UI, fontSize: '0.74rem', color: 'rgba(43,35,32,0.52)', lineHeight: 1.65 }}>
        Payments processed securely via Paystack / Flutterwave — we never store your full card details.
      </span>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function AddressesPayment() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab: 'addresses' | 'payment' = pathname.includes('/payment') ? 'payment' : 'addresses';

  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDR);
  const [payments, setPayments] = useState<Payment[]>(SEED_PAY);

  // Modal state: null=closed, 'add'=new, number=editing that id
  const [addrModal, setAddrModal] = useState<'add' | number | null>(null);
  const [payModal, setPayModal] = useState<'add' | number | null>(null);

  /* Address actions */
  function saveAddress(data: AddrForm) {
    if (addrModal === 'add') {
      const newAddr: Address = { id: Date.now(), ...data };
      setAddresses(prev =>
        data.isDefault
          ? [...prev.map(a => ({ ...a, isDefault: false })), newAddr]
          : [...prev, newAddr]
      );
    } else if (typeof addrModal === 'number') {
      setAddresses(prev =>
        prev.map(a => {
          if (a.id === addrModal) return { ...a, ...data };
          return data.isDefault ? { ...a, isDefault: false } : a;
        })
      );
    }
    setAddrModal(null);
  }

  /* Payment actions */
  function removePayment(id: number) {
    setPayments(prev => prev.filter(p => p.id !== id));
  }

  function setDefaultPayment(id: number) {
    setPayments(prev => prev.map(p => ({ ...p, isDefault: p.id === id })));
  }

  const editingAddr = typeof addrModal === 'number'
    ? addresses.find(a => a.id === addrModal)
    : undefined;

  return (
    <AccountShell>
      <style>{`
        .ap-tab { position: relative; }
        .ap-tab::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: ${C.gold};
          transform: scaleX(0);
          transition: transform 0.22s ease;
          transform-origin: left;
        }
        .ap-tab.active::after { transform: scaleX(1); }
        .addr-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 720px) {
          .addr-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Page title */}
      <div style={{ marginBottom: '1.375rem' }}>
        <h1 style={{
          fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500,
          color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>
          Addresses &amp; Payment Methods
        </h1>
      </div>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', borderBottom: `1px solid rgba(43,35,32,0.12)`,
        marginBottom: '2rem',
      }}>
        {(['addresses', 'payment'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => navigate(tab === 'addresses' ? '/account/addresses' : '/account/payment')}
            className={`ap-tab${activeTab === tab ? ' active' : ''}`}
            style={{
              fontFamily: UI, fontSize: '0.7rem', fontWeight: activeTab === tab ? 700 : 500,
              letterSpacing: '0.11em', textTransform: 'uppercase',
              color: activeTab === tab ? C.charcoal : 'rgba(43,35,32,0.42)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.6rem 1.375rem 0.85rem',
              transition: 'color 0.15s',
            }}
          >
            {tab === 'addresses' ? 'Addresses' : 'Payment Methods'}
          </button>
        ))}
      </div>

      {/* ── Addresses tab ───────────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div className="addr-grid">
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={() => setAddrModal(addr.id)}
              onDelete={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
              onSetDefault={() => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })))}
            />
          ))}
          <AddNewCard text="Add New Address" onClick={() => setAddrModal('add')} />
        </div>
      )}

      {/* ── Payment Methods tab ─────────────────────────────────── */}
      {activeTab === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {payments.map(pay => (
            <PaymentCard
              key={pay.id}
              pay={pay}
              onEdit={() => setPayModal(pay.id)}
              onRemove={() => removePayment(pay.id)}
              onSetDefault={() => setDefaultPayment(pay.id)}
            />
          ))}
          <AddNewCard text="Add New Payment Method" onClick={() => setPayModal('add')} />
          <TrustNote />
        </div>
      )}

      {/* ── Slide-overs ──────────────────────────────────────────── */}
      {addrModal !== null && (
        <AddressSlideOver
          initial={editingAddr ? { ...editingAddr } : { ...BLANK_ADDR }}
          isEdit={typeof addrModal === 'number'}
          onSave={saveAddress}
          onClose={() => setAddrModal(null)}
        />
      )}

      {payModal !== null && (
        <PaymentSlideOver
          onSave={() => setPayModal(null)}
          onClose={() => setPayModal(null)}
        />
      )}
    </AccountShell>
  );
}
