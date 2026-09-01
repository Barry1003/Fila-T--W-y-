'use client';

import { useState, useRef } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Seed (same items as Cart) ────────────────────────────── */
const ITEMS = [
  { id: 8, title: 'Embroidered Agbada Kaftan', variant: 'Gold · Size L', cadPrice: 310, ngnPrice: 153950, qty: 1, img: 'photo-1765910083971-aa0e3688be46' },
  { id: 1, title: 'Gobi Filà Cap — Burgundy Velvet', variant: 'Burgundy · Size M', cadPrice: 89, ngnPrice: 44200, qty: 2, img: 'photo-1763823133159-c6f8ec380e33' },
  { id: 4, title: 'Aso-oke Gele — Ivory & Gold Set', variant: 'Gold · One Size', cadPrice: 145, ngnPrice: 71900, qty: 1, img: 'photo-1714124731489-7eb16af0ac91' },
];

/* ─── Country + shipping matrix ──────────────────────────── */
type CountryGroup = 'ca-us' | 'uk' | 'ng' | 'intl';

const COUNTRIES: { value: string; label: string; group: CountryGroup }[] = [
  { value: 'CA', label: 'Canada', group: 'ca-us' },
  { value: 'US', label: 'United States', group: 'ca-us' },
  { value: 'GB', label: 'United Kingdom', group: 'uk' },
  { value: 'NG', label: 'Nigeria', group: 'ng' },
  { value: 'GH', label: 'Ghana', group: 'intl' },
  { value: 'DE', label: 'Germany', group: 'intl' },
  { value: 'FR', label: 'France', group: 'intl' },
  { value: 'AU', label: 'Australia', group: 'intl' },
  { value: 'JP', label: 'Japan', group: 'intl' },
  { value: 'AE', label: 'United Arab Emirates', group: 'intl' },
  { value: 'ZA', label: 'South Africa', group: 'intl' },
  { value: 'OTHER', label: 'Other', group: 'intl' },
];

const SHIPPING_MATRIX: Record<CountryGroup, { id: string; label: string; days: string; cadCost: number; ngnCost: number }[]> = {
  'ca-us': [
    { id: 'ca-us-std', label: 'Standard', days: '5–8 business days', cadCost: 0, ngnCost: 0 },
    { id: 'ca-us-exp', label: 'Express', days: '2–3 business days', cadCost: 25, ngnCost: 12500 },
  ],
  'uk': [
    { id: 'uk-std', label: 'Standard', days: '8–12 business days', cadCost: 5, ngnCost: 2500 },
    { id: 'uk-exp', label: 'Express', days: '4–6 business days', cadCost: 18, ngnCost: 9000 },
  ],
  'ng': [
    { id: 'ng-std', label: 'Standard', days: '7–14 business days', cadCost: 7, ngnCost: 3500 },
    { id: 'ng-exp', label: 'Express', days: '4–7 business days', cadCost: 20, ngnCost: 10000 },
  ],
  'intl': [
    { id: 'intl-std', label: 'Standard', days: '10–18 business days', cadCost: 10, ngnCost: 5000 },
    { id: 'intl-exp', label: 'Express', days: '6–10 business days', cadCost: 25, ngnCost: 12500 },
  ],
};

const PHONE_CODES = [
  { code: '+1', label: '+1 CA/US' },
  { code: '+234', label: '+234 NG' },
  { code: '+44', label: '+44 UK' },
  { code: '+49', label: '+49 DE' },
  { code: '+33', label: '+33 FR' },
  { code: '+61', label: '+61 AU' },
  { code: '+27', label: '+27 ZA' },
  { code: '+971', label: '+971 AE' },
  { code: '+81', label: '+81 JP' },
  { code: '+233', label: '+233 GH' },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function cad(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
}
function ngn(n: number) {
  return '₦' + new Intl.NumberFormat('en-NG').format(n);
}
function getGroup(countryVal: string): CountryGroup {
  return COUNTRIES.find(c => c.value === countryVal)?.group ?? 'intl';
}

/* ─── Input style helpers ──────────────────────────────────── */
const fieldBase: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  fontFamily: UI,
  fontSize: '0.875rem',
  color: C.charcoal,
  backgroundColor: '#fff',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: 'rgba(43,35,32,0.22)',
  borderRadius: '5px',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
};
const fieldError: React.CSSProperties = {
  ...fieldBase,
  borderColor: '#b94a48',
};

/* ─── Sub-components ──────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...label, color: C.maroon, marginBottom: '1.25rem', paddingBottom: '0.6rem', borderBottom: `1px solid rgba(122,46,56,0.18)` }}>
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ fontFamily: UI, fontSize: '0.725rem', color: '#b94a48', marginTop: '0.3rem' }}>{msg}</p>;
}

function FocusInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, style, ...rest } = props;
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...rest}
      style={{ ...(error ? fieldError : fieldBase), ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 2.5px rgba(212,169,78,0.22)` } : {}), ...style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}

function FocusSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  const { error, style, ...rest } = props;
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...rest}
      style={{ ...(error ? fieldError : fieldBase), ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 2.5px rgba(212,169,78,0.22)` } : {}), appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232B2320' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.875rem center', paddingRight: '2.25rem', cursor: 'pointer', ...style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}

function FocusTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  const { error, style, ...rest } = props;
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...rest}
      style={{ ...(error ? fieldError : fieldBase), ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 2.5px rgba(212,169,78,0.22)` } : {}), resize: 'vertical', minHeight: '90px', ...style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
    />
  );
}

/* ─── Progress bar ─────────────────────────────────────────── */
const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
function ProgressBar({ current }: { current: number }) {
  return (
    <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div className="checkout-step-line" style={{ width: '2.5rem', height: '1px', backgroundColor: done ? C.maroon : 'rgba(43,35,32,0.2)' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                backgroundColor: done ? C.maroon : active ? C.gold : 'rgba(43,35,32,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontFamily: UI, fontSize: '0.6rem', fontWeight: 700, color: active ? C.charcoal : 'rgba(43,35,32,0.4)' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span className="checkout-step-label" style={{ ...label, fontSize: '0.575rem', color: active ? C.gold : done ? C.maroon : 'rgba(43,35,32,0.4)', letterSpacing: '0.1em' }}>
                {s}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Payment logos ─────────────────────────────────────────── */
function PaymentBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid rgba(43,35,32,0.18)', borderRadius: '4px', padding: '4px 8px', fontFamily: UI, fontSize: '0.65rem', fontWeight: 600, color: C.charcoal, letterSpacing: '0.03em', backgroundColor: '#fff' }}>
      {children}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function Checkout() {
  const navigate = useNavigate();

  // Contact
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phone, setPhone] = useState('');

  // Address
  const [country, setCountry] = useState('CA');
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postal, setPostal] = useState('');

  // Shipping
  const group = getGroup(country);
  const methods = SHIPPING_MATRIX[group];
  const [methodId, setMethodId] = useState(methods[0].id);
  const selectedMethod = methods.find(m => m.id === methodId) ?? methods[0];

  // When country changes, reset method to first option for that group
  function handleCountryChange(val: string) {
    setCountry(val);
    const g = getGroup(val);
    setMethodId(SHIPPING_MATRIX[g][0].id);
  }

  // Payment
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [billingSame, setBillingSame] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function touch(field: string) { setTouched(t => ({ ...t, [field]: true })); }

  const errors: Record<string, string> = {};
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (!fullName.trim()) errors.fullName = 'Full name is required.';
  if (!address1.trim()) errors.address1 = 'Address is required.';
  if (!city.trim()) errors.city = 'City is required.';
  if (!postal.trim()) errors.postal = 'Postal / ZIP code is required.';
  if (!cardNum.replace(/\s/g, '') || cardNum.replace(/\s/g, '').length < 15) errors.cardNum = 'Please enter a valid card number.';
  if (!cardExp || !/^\d{2}\/\d{2}$/.test(cardExp)) errors.cardExp = 'Use MM/YY format.';
  if (!cardCvc || cardCvc.length < 3) errors.cardCvc = 'Enter 3–4 digit CVC.';

  // Totals
  const subtotalCad = ITEMS.reduce((s, it) => s + it.cadPrice * it.qty, 0);
  const subtotalNgn = ITEMS.reduce((s, it) => s + it.ngnPrice * it.qty, 0);
  const shipCad = selectedMethod.cadCost;
  const shipNgn = selectedMethod.ngnCost;
  const totalCad = subtotalCad + shipCad;
  const totalNgn = subtotalNgn + shipNgn;

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length === 0) {
      navigate('/order-confirmation');
    }
  }

  const showErr = (field: string) => (submitted || touched[field]) && !!errors[field];

  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', fontFamily: UI, color: C.charcoal }}>
      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; align-items: start; }
        .checkout-grid > * { min-width: 0; }
        .checkout-sticky { position: sticky; top: 2rem; }
        .shimmer-place-order { position: relative; overflow: hidden; }
        .shimmer-place-order::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0s;
        }
        .shimmer-place-order:hover::after { transform: translateX(100%); transition: transform 0.6s ease; }
        @media (max-width: 1060px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .checkout-sticky { position: static; }
          .checkout-summary-top { order: -1; }
        }
        @media (max-width: 640px) {
          .checkout-head { padding: 0 1rem !important; }
          .checkout-progress { padding: 0.7rem 1rem !important; }
          .checkout-body { padding: 2rem 1rem 3.5rem !important; }
          .checkout-grid { gap: 2rem; }
        }
        input[type="radio"] { accent-color: ${C.gold}; }
        input[type="checkbox"] { accent-color: ${C.gold}; }
        *:focus-visible { outline: none; }
      `}</style>

      {/* ── Checkout Header ─────────────────────────────────── */}
      <header style={{ backgroundColor: C.maroon, borderBottom: `1px solid rgba(212,169,78,0.22)` }}>
        <div className="checkout-head" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecorationLine: 'none' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              Fila Tó Wúyì
            </div>
            <div style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '2px' }}>
              by AdeClassics
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontFamily: UI, fontSize: '0.7rem', color: C.cream, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
              Secure Checkout
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="checkout-progress" style={{ backgroundColor: 'rgba(0,0,0,0.12)', padding: '0.7rem 2rem' }}>
          <ProgressBar current={1} />
        </div>
      </header>

      {/* ── Page body ─────────────────────────────────────────── */}
      <div className="checkout-body" style={{ maxWidth: '1240px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-grid">

            {/* ══ LEFT COLUMN: Form ════════════════════════════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              {/* 1. Contact */}
              <section>
                <SectionLabel>Contact</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Email address <span style={{ color: '#b94a48' }}>*</span>
                    </label>
                    <FocusInput
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => touch('email')}
                      error={showErr('email')}
                      autoComplete="email"
                    />
                    {showErr('email') && <FieldError msg={errors.email} />}
                  </div>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Phone <span style={{ opacity: 0.5 }}>(optional)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <FocusSelect
                        value={phoneCode}
                        onChange={e => setPhoneCode(e.target.value)}
                        style={{ width: '130px', flexShrink: 0 }}
                      >
                        {PHONE_CODES.map(p => (
                          <option key={p.code} value={p.code}>{p.label}</option>
                        ))}
                      </FocusSelect>
                      <FocusInput
                        type="tel"
                        placeholder="8012345678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        autoComplete="tel-national"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Shipping Address */}
              <section>
                <SectionLabel>Shipping Address</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Country <span style={{ color: '#b94a48' }}>*</span>
                    </label>
                    <FocusSelect
                      value={country}
                      onChange={e => handleCountryChange(e.target.value)}
                      autoComplete="country"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </FocusSelect>
                  </div>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Full name <span style={{ color: '#b94a48' }}>*</span>
                    </label>
                    <FocusInput
                      type="text"
                      placeholder="Adewale Okonkwo"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      onBlur={() => touch('fullName')}
                      error={showErr('fullName')}
                      autoComplete="name"
                    />
                    {showErr('fullName') && <FieldError msg={errors.fullName} />}
                  </div>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Address <span style={{ color: '#b94a48' }}>*</span>
                    </label>
                    <FocusInput
                      type="text"
                      placeholder="Street address or P.O. Box"
                      value={address1}
                      onChange={e => setAddress1(e.target.value)}
                      onBlur={() => touch('address1')}
                      error={showErr('address1')}
                      autoComplete="address-line1"
                    />
                    {showErr('address1') && <FieldError msg={errors.address1} />}
                  </div>
                  <FocusInput
                    type="text"
                    placeholder="Apt, suite, unit (optional)"
                    value={address2}
                    onChange={e => setAddress2(e.target.value)}
                    autoComplete="address-line2"
                  />
                  <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ gridColumn: '1 / 2' }}>
                      <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                        City <span style={{ color: '#b94a48' }}>*</span>
                      </label>
                      <FocusInput
                        type="text"
                        placeholder="Lagos"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onBlur={() => touch('city')}
                        error={showErr('city')}
                        autoComplete="address-level2"
                      />
                      {showErr('city') && <FieldError msg={errors.city} />}
                    </div>
                    <div>
                      <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                        State / Province
                      </label>
                      <FocusInput
                        type="text"
                        placeholder="Lagos"
                        value={stateProvince}
                        onChange={e => setStateProvince(e.target.value)}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div>
                      <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                        Postal / ZIP <span style={{ color: '#b94a48' }}>*</span>
                      </label>
                      <FocusInput
                        type="text"
                        placeholder="100001"
                        value={postal}
                        onChange={e => setPostal(e.target.value)}
                        onBlur={() => touch('postal')}
                        error={showErr('postal')}
                        autoComplete="postal-code"
                      />
                      {showErr('postal') && <FieldError msg={errors.postal} />}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Shipping Method */}
              <section>
                <SectionLabel>Shipping Method</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {SHIPPING_MATRIX[group].map(m => {
                    const active = methodId === m.id;
                    return (
                      <label
                        key={m.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '1rem',
                          padding: '1rem 1.125rem',
                          border: `1.5px solid ${active ? C.gold : 'rgba(43,35,32,0.2)'}`,
                          borderRadius: '6px',
                          backgroundColor: active ? 'rgba(212,169,78,0.07)' : '#fff',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s, background-color 0.15s',
                        }}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={m.id}
                          checked={active}
                          onChange={() => setMethodId(m.id)}
                          style={{ accentColor: C.gold, width: '16px', height: '16px', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontFamily: UI, fontWeight: 600, fontSize: '0.875rem', color: C.charcoal }}>
                              {m.label}
                            </span>
                            <span style={{ fontFamily: UI, fontWeight: 600, fontSize: '0.875rem', color: m.cadCost === 0 ? C.teal : C.charcoal, flexShrink: 0 }}>
                              {m.cadCost === 0 ? 'Free' : cad(m.cadCost)}
                            </span>
                          </div>
                          <div style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.55)', marginTop: '2px' }}>
                            {m.days}
                            {m.ngnCost > 0 && <span style={{ marginLeft: '0.5rem', color: 'rgba(43,35,32,0.4)' }}>· {ngn(m.ngnCost)}</span>}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* 4. Payment */}
              <section>
                <SectionLabel>Payment</SectionLabel>
                {/* Accepted methods */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)', marginRight: '0.25rem' }}>Accepted:</span>
                  <PaymentBadge>VISA</PaymentBadge>
                  <PaymentBadge>Mastercard</PaymentBadge>
                  <PaymentBadge>Amex</PaymentBadge>
                  <PaymentBadge>Paystack</PaymentBadge>
                  <PaymentBadge>Flutterwave</PaymentBadge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                      Card number <span style={{ color: '#b94a48' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FocusInput
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={cardNum}
                        onChange={e => setCardNum(formatCard(e.target.value))}
                        onBlur={() => touch('cardNum')}
                        error={showErr('cardNum')}
                        autoComplete="cc-number"
                      />
                      <div style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}>
                        <svg width="20" height="14" viewBox="0 0 24 16" fill="none">
                          <rect x="0" y="0" width="24" height="16" rx="2" fill={C.charcoal} />
                          <rect x="0" y="5" width="24" height="4" fill="rgba(0,0,0,0.4)" />
                        </svg>
                      </div>
                    </div>
                    {showErr('cardNum') && <FieldError msg={errors.cardNum} />}
                  </div>
                  <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                        Expiry <span style={{ color: '#b94a48' }}>*</span>
                      </label>
                      <FocusInput
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={cardExp}
                        onChange={e => setCardExp(formatExpiry(e.target.value))}
                        onBlur={() => touch('cardExp')}
                        error={showErr('cardExp')}
                        autoComplete="cc-exp"
                        maxLength={5}
                      />
                      {showErr('cardExp') && <FieldError msg={errors.cardExp} />}
                    </div>
                    <div>
                      <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
                        CVC <span style={{ color: '#b94a48' }}>*</span>
                      </label>
                      <FocusInput
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onBlur={() => touch('cardCvc')}
                        error={showErr('cardCvc')}
                        autoComplete="cc-csc"
                        maxLength={4}
                      />
                      {showErr('cardCvc') && <FieldError msg={errors.cardCvc} />}
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={billingSame}
                      onChange={e => setBillingSame(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: C.gold, flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: UI, fontSize: '0.825rem', color: C.charcoal }}>
                      Billing address same as shipping
                    </span>
                  </label>
                </div>
              </section>

              {/* 5. Order notes */}
              <section>
                <SectionLabel>Order Notes <span style={{ fontFamily: UI, fontSize: '0.65rem', letterSpacing: 0, textTransform: 'none', fontWeight: 400, color: 'rgba(43,35,32,0.45)' }}>— optional</span></SectionLabel>
                <FocusTextarea
                  placeholder="Gift message, special delivery instructions, fabric preferences for custom orders…"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  rows={3}
                />
              </section>

              {/* Place Order CTA */}
              <div>
                {submitted && Object.keys(errors).length > 0 && (
                  <div style={{ fontFamily: UI, fontSize: '0.775rem', color: '#b94a48', marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(185,74,72,0.07)', borderRadius: '5px', border: '1px solid rgba(185,74,72,0.2)' }}>
                    Please correct the highlighted fields before placing your order.
                  </div>
                )}
                <button
                  type="submit"
                  className="shimmer-place-order"
                  style={{
                    width: '100%', padding: '1.05rem 2rem',
                    backgroundColor: C.gold, color: C.charcoal,
                    fontFamily: UI, fontWeight: 700, fontSize: '0.875rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: 'none', borderRadius: '5px', cursor: 'pointer',
                    boxShadow: `0 2px 12px rgba(212,169,78,0.35)`,
                    transition: 'box-shadow 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 22px rgba(212,169,78,0.5)`; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 2px 12px rgba(212,169,78,0.35)`; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
                >
                  Place Order — {cad(totalCad)}
                </button>
                {/* Trust row */}
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Escrow-Protected Payments' },
                    { icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2zM2 12h20', label: 'Worldwide Delivery' },
                  ].map(t => (
                    <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={t.icon} />
                      </svg>
                      <span style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.55)', letterSpacing: '0.02em' }}>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ RIGHT COLUMN: Order summary ══════════════════ */}
            <aside className="checkout-summary-top" ref={summaryRef}>
              <div className="checkout-sticky">
                <div style={{
                  backgroundColor: '#fff', border: `1px solid rgba(43,35,32,0.12)`,
                  borderRadius: '8px', overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(43,35,32,0.06)',
                }}>
                  {/* Header */}
                  <div style={{ padding: '1.125rem 1.5rem', borderBottom: `1px solid rgba(43,35,32,0.1)`, backgroundColor: C.cream }}>
                    <div style={{ ...label, color: C.charcoal, fontSize: '0.65rem' }}>Order Summary</div>
                  </div>

                  {/* Items */}
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '260px', overflowY: 'auto' }}>
                    {ITEMS.map(it => (
                      <div key={it.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={`https://images.unsplash.com/${it.img}?w=80&h=80&fit=crop&auto=format`}
                            alt={it.title}
                            width={52} height={52}
                            style={{ borderRadius: '4px', objectFit: 'cover', display: 'block', backgroundColor: 'rgba(43,35,32,0.08)' }}
                          />
                          <span style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            backgroundColor: C.charcoal, color: '#fff',
                            borderRadius: '50%', width: '18px', height: '18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: UI, fontSize: '0.55rem', fontWeight: 700,
                          }}>{it.qty}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {it.title}
                          </div>
                          <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)', marginTop: '2px' }}>{it.variant}</div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontFamily: UI, fontSize: '0.825rem', fontWeight: 600, color: C.charcoal }}>
                            {cad(it.cadPrice * it.qty)}
                          </div>
                          <div style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.45)', marginTop: '1px' }}>
                            {ngn(it.ngnPrice * it.qty)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid rgba(43,35,32,0.1)`, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { label: 'Subtotal', cad: subtotalCad, ngn: subtotalNgn },
                      { label: `Shipping (${selectedMethod.label})`, cad: shipCad, ngn: shipNgn, isFree: shipCad === 0 },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)' }}>{row.label}</span>
                        <span style={{ fontFamily: UI, fontSize: '0.8rem', color: row.isFree ? C.teal : C.charcoal, fontWeight: row.isFree ? 600 : 400 }}>
                          {row.isFree ? 'Free' : cad(row.cad)}
                        </span>
                      </div>
                    ))}
                    {/* Divider */}
                    <div style={{ borderTop: `1px solid rgba(43,35,32,0.12)`, paddingTop: '0.625rem', marginTop: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: UI, fontWeight: 700, fontSize: '0.95rem', color: C.charcoal }}>Total</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.charcoal, fontWeight: 600 }}>{cad(totalCad)}</div>
                          <div style={{ fontFamily: UI, fontSize: '0.725rem', color: 'rgba(43,35,32,0.45)', marginTop: '1px' }}>{ngn(totalNgn)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery estimate */}
                  <div style={{ padding: '0.875rem 1.5rem', backgroundColor: `rgba(59,138,147,0.07)`, borderTop: `1px solid rgba(59,138,147,0.15)`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontFamily: UI, fontSize: '0.72rem', color: C.teal }}>
                      Est. delivery: <strong>{selectedMethod.days}</strong>
                    </span>
                  </div>
                </div>

                {/* Back to cart */}
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <Link to="/cart" style={{ fontFamily: UI, fontSize: '0.75rem', color: C.indigo, textDecorationLine: 'none', letterSpacing: '0.04em' }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    ← Return to cart
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        </form>
      </div>

      {/* ── Minimal Footer ──────────────────────────────────── */}
      <footer style={{ backgroundColor: C.maroon, borderTop: `1px solid rgba(212,169,78,0.15)` }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.45)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Fila Tó Wúyì by AdeClassics. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Returns'].map(lnk => (
              <a key={lnk} href="#" style={{ fontFamily: UI, fontSize: '0.65rem', color: 'rgba(250,246,240,0.5)', textDecorationLine: 'none', letterSpacing: '0.04em' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,246,240,0.5)')}
              >
                {lnk}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
