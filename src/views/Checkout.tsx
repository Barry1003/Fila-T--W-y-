'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { checkPromoCode, placeOrder } from '@/server/place-order';
import { C, DISPLAY, UI, label } from '../tokens';
import { formatCad, orderTotals, shippingCost, type Discount, type ShippingSpeed, type ShippingZone } from '@/server/pricing';

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

/** Maps the checkout's country groups onto the pricing module's zones. */
const ZONE_OF: Record<CountryGroup, ShippingZone> = {
  'ca-us': 'canada-us',
  uk: 'uk',
  ng: 'nigeria',
  intl: 'rest-of-world',
};

const SHIPPING_MATRIX: Record<CountryGroup, { id: string; label: string; days: string; speed: ShippingSpeed }[]> = {
  'ca-us': [
    { id: 'ca-us-std', label: 'Standard', days: '5–8 business days', speed: 'standard' },
    { id: 'ca-us-exp', label: 'Express', days: '2–3 business days', speed: 'express' },
  ],
  'uk': [
    { id: 'uk-std', label: 'Standard', days: '8–12 business days', speed: 'standard' },
    { id: 'uk-exp', label: 'Express', days: '4–6 business days', speed: 'express' },
  ],
  'ng': [
    { id: 'ng-std', label: 'Standard', days: '7–14 business days', speed: 'standard' },
    { id: 'ng-exp', label: 'Express', days: '4–7 business days', speed: 'express' },
  ],
  'intl': [
    { id: 'intl-std', label: 'Standard', days: '10–18 business days', speed: 'standard' },
    { id: 'intl-exp', label: 'Express', days: '6–10 business days', speed: 'express' },
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
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: C.cream }} />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const { lines, clear, hydrated } = useCart();

  // The cart passes an applied code through the URL. It is re-checked here, and
  // checked a third time on the server — the query string only carries intent.
  const promoParam = searchParams.get('promo') ?? '';
  const [discount, setDiscount] = useState<{ code: string; discount: Discount; description: string } | null>(null);

  useEffect(() => {
    if (!promoParam) {
      setDiscount(null);
      return;
    }

    let current = true;
    checkPromoCode(promoParam).then(result => {
      if (current) setDiscount(result.ok ? { code: result.code, discount: result.discount, description: result.description } : null);
    });
    return () => { current = false; };
  }, [promoParam]);

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

  const [orderNotes, setOrderNotes] = useState('');

  // Validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // Placing the order
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  function touch(field: string) { setTouched(t => ({ ...t, [field]: true })); }

  const errors: Record<string, string> = {};
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (!fullName.trim()) errors.fullName = 'Full name is required.';
  if (!address1.trim()) errors.address1 = 'Address is required.';
  if (!city.trim()) errors.city = 'City is required.';
  if (!postal.trim()) errors.postal = 'Postal / ZIP code is required.';

  // Totals — same module and the same cart the previous screen used, so the two
  // cannot disagree about the bill.
  const totals = orderTotals(
    lines.map(line => ({ unitPriceCents: line.unitPriceCents, quantity: line.quantity })),
    discount?.discount ?? null,
    ZONE_OF[group],
    selectedMethod.speed
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setPlaceError('');

    if (Object.keys(errors).length > 0) return;
    if (lines.length === 0) {
      setPlaceError('Your cart is empty.');
      return;
    }

    setPlacing(true);

    const result = await placeOrder({
      email,
      fullName,
      phone: phone ? `${phoneCode} ${phone}` : '',
      line1: address1,
      line2: address2,
      city,
      state: stateProvince,
      postal,
      country: COUNTRIES.find(c => c.value === country)?.label ?? country,
      shippingZone: ZONE_OF[group],
      shippingSpeed: selectedMethod.speed,
      promoCode: discount?.code ?? '',
      notes: orderNotes,
      // Only what was chosen. The server prices it.
      lines: lines.map(line => ({
        productId: line.productId,
        size: line.size,
        quantity: line.quantity,
      })),
    });

    if (!result.ok) {
      setPlacing(false);
      setPlaceError(result.message);
      return;
    }

    // Empty the cart only once the order is safely written, so a failure
    // leaves the shopper with everything still in it.
    clear();
    navigate(`/order-confirmation?order=${encodeURIComponent(result.orderNumber)}`);
  }

  const showErr = (field: string) => (submitted || touched[field]) && !!errors[field];

  const summaryRef = useRef<HTMLDivElement>(null);

  // Nothing to check out. Wait for the stored cart to load first, or someone
  // arriving with a full cart would see this for a frame.
  if (hydrated && lines.length === 0) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: '2rem', color: C.charcoal, fontWeight: 500, marginBottom: '0.75rem' }}>
          There is nothing to check out
        </div>
        <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.55)', maxWidth: '340px', marginBottom: '2rem' }}>
          Your cart is empty. Once you have added a piece, you can complete your order here.
        </p>
        <Link to="/shop" style={{ textDecorationLine: 'none' }}>
          <span className="shimmer-cta" style={{ display: 'inline-block', backgroundColor: C.gold, color: C.charcoal, ...label, fontSize: '0.68rem', letterSpacing: '0.14em', padding: '0.9rem 2.25rem', cursor: 'pointer' }}>
            Browse the Shop
          </span>
        </Link>
      </div>
    );
  }

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
              AdeClassics
            </div>
            <div style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '2px' }}>
              Timeless Elegance
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
                            <span style={{ fontFamily: UI, fontWeight: 600, fontSize: '0.875rem', color: shippingCost(ZONE_OF[group], m.speed) === 0 ? C.teal : C.charcoal, flexShrink: 0 }}>
                              {shippingCost(ZONE_OF[group], m.speed) === 0 ? 'Free' : formatCad(shippingCost(ZONE_OF[group], m.speed))}
                            </span>
                          </div>
                          <div style={{ fontFamily: UI, fontSize: '0.775rem', color: 'rgba(43,35,32,0.55)', marginTop: '2px' }}>
                            {m.days}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* 4. Payment — see the note below on why there is no card form */}
              <section>
                <SectionLabel>Payment</SectionLabel>
                <div style={{
                  border: `1px solid rgba(43,35,32,0.18)`,
                  borderLeft: `3px solid ${C.gold}`,
                  padding: '1.25rem 1.375rem',
                  backgroundColor: 'rgba(212,169,78,0.06)',
                }}>
                  <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: '0.5rem' }}>
                    We will send you a payment link
                  </div>
                  <p style={{ fontFamily: UI, fontSize: '0.825rem', color: 'rgba(43,35,32,0.65)', lineHeight: 1.65, margin: 0 }}>
                    Place your order now and nothing is charged. We confirm the pieces and the
                    shipping, then email a secure payment link to <strong>{email || 'your email address'}</strong>.
                    Your order is held while you pay.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)', marginRight: '0.25rem' }}>Payment accepted by:</span>
                  <PaymentBadge>VISA</PaymentBadge>
                  <PaymentBadge>Mastercard</PaymentBadge>
                  <PaymentBadge>Amex</PaymentBadge>
                  <PaymentBadge>Paystack</PaymentBadge>
                  <PaymentBadge>Flutterwave</PaymentBadge>
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
                {placeError && (
                  <div role="alert" style={{ fontFamily: UI, fontSize: '0.775rem', color: '#b94a48', marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(185,74,72,0.07)', borderRadius: '5px', border: '1px solid rgba(185,74,72,0.2)' }}>
                    {placeError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={placing}
                  className={placing ? '' : 'shimmer-place-order'}
                  style={{
                    width: '100%', padding: '1.05rem 2rem',
                    backgroundColor: placing ? 'rgba(43,35,32,0.25)' : C.gold, color: C.charcoal,
                    fontFamily: UI, fontWeight: 700, fontSize: '0.875rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: 'none', borderRadius: '5px', cursor: placing ? 'wait' : 'pointer',
                    boxShadow: `0 2px 12px rgba(212,169,78,0.35)`,
                    transition: 'box-shadow 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 22px rgba(212,169,78,0.5)`; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 2px 12px rgba(212,169,78,0.35)`; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
                >
                  {placing ? 'Placing your order…' : `Place Order — ${formatCad(totals.totalCents)}`}
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
                    {lines.map(it => (
                      <div key={`${it.productId}:${it.size}`} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={it.imageUrl}
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
                          }}>{it.quantity}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: UI, fontSize: '0.8rem', fontWeight: 600, color: C.charcoal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {it.title}
                          </div>
                          <div style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(43,35,32,0.5)', marginTop: '2px' }}>{it.color} · {it.size}</div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontFamily: UI, fontSize: '0.825rem', fontWeight: 600, color: C.charcoal }}>
                            {formatCad(it.unitPriceCents * it.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid rgba(43,35,32,0.1)`, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { label: 'Subtotal', cents: totals.subtotalCents },
                      ...(discount ? [{ label: `Promo (${discount.code})`, cents: -totals.discountCents }] : []),
                      { label: `Shipping (${selectedMethod.label})`, cents: totals.shippingCents, isFree: totals.shippingCents === 0 },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)' }}>{row.label}</span>
                        <span style={{ fontFamily: UI, fontSize: '0.8rem', color: row.isFree ? C.teal : C.charcoal, fontWeight: row.isFree ? 600 : 400 }}>
                          {row.isFree ? 'Free' : row.cents < 0 ? `−${formatCad(Math.abs(row.cents))}` : formatCad(row.cents)}
                        </span>
                      </div>
                    ))}
                    {/* Divider */}
                    <div style={{ borderTop: `1px solid rgba(43,35,32,0.12)`, paddingTop: '0.625rem', marginTop: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: UI, fontWeight: 700, fontSize: '0.95rem', color: C.charcoal }}>Total</span>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.charcoal, fontWeight: 600 }}>{formatCad(totals.totalCents)}</div>
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
            © {new Date().getFullYear()} AdeClassics. All rights reserved.
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
