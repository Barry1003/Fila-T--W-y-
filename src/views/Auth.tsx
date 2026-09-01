'use client';

import { useState, useCallback } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Field styles ─────────────────────────────────────────── */
const fieldBase: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
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

/* ─── FocusInput ───────────────────────────────────────────── */
function FocusInput({
  type = 'text', placeholder, value, onChange, onBlur, error, autoComplete, readOnly,
}: {
  type?: string; placeholder?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void; error?: boolean; autoComplete?: string; readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const style: React.CSSProperties = {
    ...(error ? fieldError : fieldBase),
    ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 3px rgba(212,169,78,0.18)` } : {}),
  };
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={onChange} onBlur={() => { setFocused(false); onBlur?.(); }}
      onFocus={() => setFocused(true)} style={style}
      autoComplete={autoComplete} readOnly={readOnly}
    />
  );
}

/* ─── FocusSelect ─────────────────────────────────────────── */
function FocusSelect({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        ...fieldBase,
        ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 3px rgba(212,169,78,0.18)` } : {}),
        cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232B2320' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.875rem center', paddingRight: '2.5rem',
      }}
    >
      {children}
    </select>
  );
}

/* ─── FieldError ───────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  return <p style={{ fontFamily: UI, fontSize: '0.72rem', color: '#b94a48', marginTop: '0.3rem', letterSpacing: '0.01em' }}>{msg}</p>;
}

/* ─── PasswordInput ────────────────────────────────────────── */
function PasswordInput({ value, onChange, onBlur, error, placeholder, autoComplete }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void; error?: boolean; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const style: React.CSSProperties = {
    ...(error ? fieldError : fieldBase),
    ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 3px rgba(212,169,78,0.18)` } : {}),
    paddingRight: '2.75rem',
  };
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'} placeholder={placeholder ?? 'Password'}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }}
        style={style} autoComplete={autoComplete}
      />
      <button
        type="button" onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 0, color: 'rgba(43,35,32,0.45)' }}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ─── Phone codes ──────────────────────────────────────────── */
const PHONE_CODES = [
  { code: '+1',   flag: '🇨🇦', label: '+1  CA/US' },
  { code: '+234', flag: '🇳🇬', label: '+234 NG' },
  { code: '+44',  flag: '🇬🇧', label: '+44  UK' },
  { code: '+49',  flag: '🇩🇪', label: '+49  DE' },
  { code: '+33',  flag: '🇫🇷', label: '+33  FR' },
  { code: '+61',  flag: '🇦🇺', label: '+61  AU' },
  { code: '+27',  flag: '🇿🇦', label: '+27  ZA' },
  { code: '+971', flag: '🇦🇪', label: '+971 AE' },
  { code: '+81',  flag: '🇯🇵', label: '+81  JP' },
  { code: '+233', flag: '🇬🇭', label: '+233 GH' },
];

/* ─── GoldButton ────────────────────────────────────────────── */
function GoldButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="submit" onClick={onClick}
      className="auth-gold-btn"
      style={{
        width: '100%', padding: '1rem 2rem',
        backgroundColor: C.gold, color: C.charcoal,
        fontFamily: UI, fontWeight: 700, fontSize: '0.82rem',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        border: 'none', borderRadius: '5px', cursor: 'pointer',
        boxShadow: `0 2px 14px rgba(212,169,78,0.35)`,
        transition: 'box-shadow 0.2s, transform 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {children}
    </button>
  );
}

/* ─── GoogleButton ──────────────────────────────────────────── */
function GoogleButton({ label: lbl }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%', padding: '0.85rem 2rem',
        backgroundColor: 'transparent', color: C.charcoal,
        fontFamily: UI, fontWeight: 600, fontSize: '0.82rem',
        letterSpacing: '0.06em',
        borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(43,35,32,0.28)',
        borderRadius: '5px', cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,169,78,0.05)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(43,35,32,0.28)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
    >
      {/* Google G */}
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {lbl}
    </button>
  );
}

/* ─── Divider ───────────────────────────────────────────────── */
function OrDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(43,35,32,0.14)' }} />
      <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>or</span>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(43,35,32,0.14)' }} />
    </div>
  );
}

/* ─── Sign In form ──────────────────────────────────────────── */
function SignInForm({ switchTab }: { switchTab: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<string, string> = {};
  if (submitted && !email.trim()) errors.email = 'Email is required.';
  else if (submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (submitted && !password) errors.password = 'Password is required.';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Email */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
          Email Address
        </label>
        <FocusInput
          type="email" placeholder="adunola@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          error={submitted && !!errors.email} autoComplete="email"
        />
        {submitted && errors.email && <FieldError msg={errors.email} />}
      </div>

      {/* Password */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
          <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Password</label>
          <a href="#" style={{ fontFamily: UI, fontSize: '0.72rem', color: C.indigo, textDecorationLine: 'none', letterSpacing: '0.01em' }}>
            Forgot password?
          </a>
        </div>
        <PasswordInput
          value={password} onChange={e => setPassword(e.target.value)}
          error={submitted && !!errors.password} autoComplete="current-password"
        />
        {submitted && errors.password && <FieldError msg={errors.password} />}
      </div>

      <div style={{ marginTop: '0.4rem' }}>
        <GoldButton>Sign In</GoldButton>
      </div>

      <OrDivider />

      <GoogleButton label="Continue with Google" />

      <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)', textAlign: 'center', marginTop: '0.5rem', letterSpacing: '0.01em' }}>
        {"Don't have an account? "}
        <button type="button" onClick={switchTab} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: '0.8rem', color: C.gold, fontWeight: 600, padding: 0, textDecorationLine: 'underline', textDecorationColor: 'rgba(212,169,78,0.4)' }}>
          Create one
        </button>
      </p>
    </form>
  );
}

/* ─── Register form ─────────────────────────────────────────── */
function RegisterForm({ switchTab }: { switchTab: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<string, string> = {};
  if (submitted && !name.trim()) errors.name = 'Full name is required.';
  if (submitted && !email.trim()) errors.email = 'Email is required.';
  else if (submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (submitted && !phone.trim()) errors.phone = 'Phone number is required.';
  if (submitted && !password) errors.password = 'Password is required.';
  else if (submitted && password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (submitted && confirm !== password) errors.confirm = 'Passwords do not match.';
  if (submitted && !agreed) errors.agreed = 'You must agree to continue.';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {/* Full Name */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
        <FocusInput
          placeholder="Adunola Okonkwo"
          value={name} onChange={e => setName(e.target.value)}
          error={submitted && !!errors.name} autoComplete="name"
        />
        {submitted && errors.name && <FieldError msg={errors.name} />}
      </div>

      {/* Email */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
        <FocusInput
          type="email" placeholder="adunola@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          error={submitted && !!errors.email} autoComplete="email"
        />
        {submitted && errors.email && <FieldError msg={errors.email} />}
      </div>

      {/* Phone */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
        <div className="rg-split" style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.5rem' }}>
          <FocusSelect value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
            {PHONE_CODES.map(p => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </FocusSelect>
          <FocusInput
            type="tel" placeholder="(416) 555-0123"
            value={phone} onChange={e => setPhone(e.target.value)}
            error={submitted && !!errors.phone} autoComplete="tel"
          />
        </div>
        {submitted && errors.phone && <FieldError msg={errors.phone} />}
      </div>

      {/* Password */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Password</label>
        <PasswordInput
          value={password} onChange={e => setPassword(e.target.value)}
          error={submitted && !!errors.password}
          placeholder="Min. 8 characters" autoComplete="new-password"
        />
        {submitted && errors.password && <FieldError msg={errors.password} />}
      </div>

      {/* Confirm password */}
      <div>
        <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Confirm Password</label>
        <PasswordInput
          value={confirm} onChange={e => setConfirm(e.target.value)}
          error={submitted && !!errors.confirm}
          placeholder="Re-enter password" autoComplete="new-password"
        />
        {submitted && errors.confirm && <FieldError msg={errors.confirm} />}
      </div>

      {/* Terms checkbox */}
      <div>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
          <input
            type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            style={{ marginTop: '2px', accentColor: C.gold, flexShrink: 0, width: '15px', height: '15px' }}
          />
          <span style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.5 }}>
            I agree to the{' '}
            <a href="#" style={{ color: C.indigo, textDecorationLine: 'none', borderBottom: `1px solid rgba(46,74,158,0.3)` }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: C.indigo, textDecorationLine: 'none', borderBottom: `1px solid rgba(46,74,158,0.3)` }}>Privacy Policy</a>
          </span>
        </label>
        {submitted && errors.agreed && <FieldError msg={errors.agreed} />}
      </div>

      <div style={{ marginTop: '0.2rem' }}>
        <GoldButton>Create Account</GoldButton>
      </div>

      <OrDivider />

      <GoogleButton label="Sign up with Google" />

      <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)', textAlign: 'center', marginTop: '0.5rem', letterSpacing: '0.01em' }}>
        Already have an account?{' '}
        <button type="button" onClick={switchTab} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: UI, fontSize: '0.8rem', color: C.gold, fontWeight: 600, padding: 0, textDecorationLine: 'underline', textDecorationColor: 'rgba(212,169,78,0.4)' }}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Auth() {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const switchToRegister = useCallback(() => setTab('register'), []);
  const switchToSignin = useCallback(() => setTab('signin'), []);

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', fontFamily: UI, color: C.charcoal }}>
      <style>{`
        .auth-gold-btn { position: relative; overflow: hidden; }
        .auth-gold-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.32) 50%, transparent 70%);
          transform: translateX(-100%); transition: transform 0s;
        }
        .auth-gold-btn:hover { box-shadow: 0 4px 22px rgba(212,169,78,0.52) !important; transform: translateY(-1px); }
        .auth-gold-btn:hover::after { transform: translateX(100%); transition: transform 0.55s ease; }
        .auth-tab-btn {
          background: none; border: none; cursor: pointer;
          font-family: ${UI}; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.75rem 0; position: relative;
          transition: color 0.15s;
        }
        .auth-tab-btn::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: ${C.gold};
          transform: scaleX(0); transition: transform 0.2s ease;
        }
        .auth-tab-btn.active { color: ${C.charcoal}; }
        .auth-tab-btn.active::after { transform: scaleX(1); }
        .auth-tab-btn.inactive { color: rgba(43,35,32,0.4); }
        .auth-split { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 64px - 56px); }
        @media (max-width: 900px) {
          .auth-split { grid-template-columns: 1fr; }
          .auth-photo-col { display: none; }
        }
        input[type="checkbox"] { accent-color: ${C.gold}; }
        *:focus-visible { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(43,35,32,0.15); border-radius: 4px; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{ backgroundColor: C.maroon, borderBottom: `1px solid rgba(212,169,78,0.22)` }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Link to="/" style={{ textDecorationLine: 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              Fila Tó Wúyì
            </div>
            <div style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '2px' }}>
              by AdeClassics
            </div>
          </Link>
          <Link
            to="/shop"
            style={{ position: 'absolute', left: '2rem', fontFamily: UI, fontSize: '0.68rem', color: C.cream, textDecorationLine: 'none', letterSpacing: '0.06em', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Shop
          </Link>
        </div>
      </header>

      {/* ── Split layout ─────────────────────────────────────────── */}
      <div className="auth-split">

        {/* Left — editorial photo */}
        <div className="auth-photo-col" style={{ position: 'relative', overflow: 'hidden', backgroundColor: C.charcoal }}>
          <img
            src="https://images.unsplash.com/photo-1687952622898-4e9514a710d5?w=900&h=1200&fit=crop&crop=faces,top&auto=format"
            alt="Man wearing a red filà cap"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', opacity: 0.9 }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, rgba(43,35,32,0.72) 0%, rgba(43,35,32,0.08) 50%, transparent 100%)`,
          }} />
          {/* Caption */}
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem' }}>
            <p style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: '#fff', lineHeight: 1.25, fontWeight: 500, marginBottom: '0.6rem', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
              Crafted with care.<br />Worn with pride.
            </p>
            <p style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em', lineHeight: 1.6 }}>
              Every filà, gele, and kaftan made by hand for you.
            </p>
          </div>
          {/* Gold accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom, ${C.gold}, transparent)` }} />
        </div>

        {/* Right — form panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem', maxWidth: '520px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          {/* Eyebrow */}
          <p style={{ ...label, fontSize: '0.6rem', color: C.gold, letterSpacing: '0.2em', marginBottom: '0.6rem' }}>
            Welcome to Fila Tó Wúyì
          </p>

          {/* Headline */}
          <h1 style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.75rem' }}>
            {tab === 'signin' ? 'Sign In' : 'Create Your Account'}
          </h1>

          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: `1px solid rgba(43,35,32,0.14)`, marginBottom: '2rem' }}>
            <button
              type="button"
              className={`auth-tab-btn ${tab === 'signin' ? 'active' : 'inactive'}`}
              onClick={() => setTab('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${tab === 'register' ? 'active' : 'inactive'}`}
              onClick={() => setTab('register')}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {tab === 'signin'
            ? <SignInForm switchTab={switchToRegister} />
            : <RegisterForm switchTab={switchToSignin} />
          }
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid rgba(43,35,32,0.1)`, padding: '1.1rem 2rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.42)', letterSpacing: '0.04em' }}>
            © 2026 AdeClassics Ltd. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Returns'].map(l => (
              <a key={l} href="#" style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.5)', textDecorationLine: 'none', letterSpacing: '0.04em', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.indigo)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.5)')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
