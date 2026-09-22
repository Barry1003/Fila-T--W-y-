'use client';

import { useState, useCallback, useTransition } from 'react';
import { authClient } from '@/lib/auth/client';
import { Link, useNavigate } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

/**
 * Turns a thrown Neon Auth (Better Auth) client error into a line a customer can
 * read. The client throws AuthApiError on failure, so this takes `unknown` and
 * digs the code/status/message out defensively. Sign-in failures stay vague on
 * purpose — naming "no such email" would tell an attacker which addresses are
 * registered.
 */
function authMessage(error: unknown, context: 'signin' | 'signup'): string {
  const e = (error ?? {}) as { code?: string; status?: number; message?: string; body?: { code?: string } };
  const code = (e.code ?? e.body?.code ?? '').toString().toUpperCase();
  const msg = (e.message ?? '').toLowerCase();

  if (code === 'USER_ALREADY_EXISTS' || msg.includes('already exists')) {
    return 'An account with that email already exists. Try signing in instead.';
  }
  if (code === 'EMAIL_NOT_VERIFIED' || msg.includes('not verified') || msg.includes('verify')) {
    return 'Please verify your email first — check your inbox for the link.';
  }
  if (code === 'PASSWORD_TOO_SHORT' || msg.includes('at least') || msg.includes('too short')) {
    return 'Use at least 8 characters for your password.';
  }
  if (code === 'TOO_MANY_REQUESTS' || e.status === 429 || msg.includes('too many')) {
    return 'Too many attempts. Wait a minute and try again.';
  }
  if (
    code === 'INVALID_EMAIL_OR_PASSWORD' ||
    e.status === 401 ||
    msg.includes('invalid email or password') ||
    msg.includes('invalid credentials')
  ) {
    return 'Those details did not match an account.';
  }
  return context === 'signup'
    ? 'Could not create the account. Check the details and try again.'
    : 'Could not sign in. Check the details and try again.';
}

/**
 * Where to land after signing in — the `?next=` the visitor was gated with when
 * they were bounced here (e.g. from checkout), falling back to their account.
 * Only same-origin paths are honoured, so the param can't push them off-site.
 */
function returnTo(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const next = new URLSearchParams(window.location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

/* ─── Field styles ─────────────────────────────────────────── */
const fieldBase: React.CSSProperties = {
  fontFamily: UI,
  fontSize: '0.875rem',
  color: C.charcoal,
  backgroundColor: '#fff',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: 'rgba(43,35,32,0.22)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
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
      className="w-full py-[0.7rem] px-[0.9rem] rounded-[5px] box-border"
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
      className="w-full py-[0.7rem] px-[0.9rem] pr-10 rounded-[5px] box-border cursor-pointer appearance-none"
      style={{
        ...fieldBase,
        ...(focused ? { borderColor: C.gold, boxShadow: `0 0 0 3px rgba(212,169,78,0.18)` } : {}),
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232B2320' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.875rem center',
      }}
    >
      {children}
    </select>
  );
}

/* ─── FieldError ───────────────────────────────────────────── */
function FieldError({ msg }: { msg?: string }) {
  return <p className="mt-[0.3rem] text-[#b94a48] tracking-[0.01em]" style={{ fontFamily: UI, fontSize: '0.72rem' }}>{msg}</p>;
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
  };
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'} placeholder={placeholder ?? 'Password'}
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }}
        style={style} autoComplete={autoComplete}
        className="w-full py-[0.7rem] pl-[0.9rem] pr-[2.75rem] rounded-[5px] box-border"
      />
      <button
        type="button" onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-[2px] cursor-pointer bg-none border-none leading-none"
        style={{ color: 'rgba(43,35,32,0.45)' }}
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
function GoldButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="submit" onClick={onClick} disabled={disabled}
      className={`auth-gold-btn w-full py-4 px-8 rounded-[5px] overflow-hidden uppercase font-bold tracking-[0.14em] border-none transition-all duration-200 ${disabled ? 'cursor-wait opacity-70' : 'cursor-pointer opacity-100'}`}
      style={{
        backgroundColor: C.gold, color: C.charcoal,
        fontFamily: UI, fontSize: '0.82rem',
        boxShadow: `0 2px 14px rgba(212,169,78,0.35)`,
      }}
    >
      {children}
    </button>
  );
}

/* ─── GoogleButton ──────────────────────────────────────────── */
function GoogleButton({ label: lbl, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-[0.85rem] px-8 rounded-[5px] cursor-pointer flex items-center justify-center gap-[0.6rem] font-semibold tracking-[0.06em] bg-transparent border-[1.5px] border-solid border-[rgba(43,35,32,0.28)] transition-colors duration-150"
      style={{
        color: C.charcoal,
        fontFamily: UI, fontSize: '0.82rem',
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

/* ─── Form banner ─────────────────────────────────────────── */
function FormBanner({ tone, children }: { tone: 'error' | 'info'; children: React.ReactNode }) {
  const error = tone === 'error';
  return (
    <div
      role={error ? 'alert' : 'status'}
      className="py-[0.7rem] px-[0.85rem] rounded-[6px] leading-[1.5]"
      style={{
        fontFamily: UI, fontSize: '0.8rem',
        color: error ? C.maroon : C.charcoal,
        backgroundColor: error ? 'rgba(122,46,56,0.07)' : 'rgba(59,138,147,0.09)',
        border: `1px solid ${error ? 'rgba(122,46,56,0.25)' : 'rgba(59,138,147,0.3)'}`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Divider ───────────────────────────────────────────────── */
function OrDivider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[rgba(43,35,32,0.14)]" />
      <span className="uppercase tracking-[0.08em]" style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.42)' }}>or</span>
      <div className="flex-1 h-px bg-[rgba(43,35,32,0.14)]" />
    </div>
  );
}

/* ─── Sign In form ──────────────────────────────────────────── */
function SignInForm({ switchTab }: { switchTab: () => void }) {
  const navigate = useNavigate();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const errors: Record<string, string> = {};
  if (submitted && !email.trim()) errors.email = 'Email is required.';
  else if (submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (submitted && !password) errors.password = 'Password is required.';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.keys(errors).length) return;

    startTransition(async () => {
      try {
        await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
        navigate(returnTo('/account'));
      } catch (err) {
        setServerError(authMessage(err, 'signin'));
      }
    });
  }

  // Carry whatever they have typed over to the dedicated reset page.
  const forgotHref = `/auth/forgot${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.1rem]">
      {serverError && <FormBanner tone="error">{serverError}</FormBanner>}

      {/* Email */}
      <div>
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>
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
        <div className="flex justify-between items-baseline mb-[0.4rem]">
          <label style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Password</label>
          <Link
            to={forgotHref}
            className="tracking-[0.01em] no-underline"
            style={{ fontFamily: UI, fontSize: '0.72rem', color: C.indigo }}
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          value={password} onChange={e => setPassword(e.target.value)}
          error={submitted && !!errors.password} autoComplete="current-password"
        />
        {submitted && errors.password && <FieldError msg={errors.password} />}
      </div>

      <div className="mt-[0.4rem]">
        <GoldButton disabled={pending}>{pending ? 'Signing in…' : 'Sign In'}</GoldButton>
      </div>

      <OrDivider />

      <GoogleButton
        label="Continue with Google"
        onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: returnTo('/account') })}
      />

      <p className="text-center mt-2 tracking-[0.01em]" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)' }}>
        {"Don't have an account? "}
        <button type="button" onClick={switchTab} className="p-0 bg-transparent border-none cursor-pointer underline font-semibold decoration-[rgba(212,169,78,0.4)]" style={{ fontFamily: UI, fontSize: '0.8rem', color: C.gold }}>
          Create one
        </button>
      </p>
    </form>
  );
}

/* ─── Register form ─────────────────────────────────────────── */
function RegisterForm({ switchTab }: { switchTab: () => void }) {
  const navigate = useNavigate();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [verifySent, setVerifySent] = useState<string | null>(null);
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
    setServerError(null);
    if (Object.keys(errors).length) return;

    startTransition(async () => {
      // Phone is collected for delivery contact; sign-in by phone needs an SMS
      // provider, so it is not part of the account yet.
      try {
        await authClient.signUp.email({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        });
      } catch (err) {
        setServerError(authMessage(err, 'signup'));
        return;
      }
      // If email verification is required there is no session yet — send them to
      // their inbox. Otherwise sign-up creates a session and we go on in.
      const session = await authClient.getSession().catch(() => null);
      if (session?.data?.user) navigate(returnTo('/account?welcome=1'));
      else setVerifySent(email.trim().toLowerCase());
    });
  }

  if (verifySent) {
    return (
      <div className="flex flex-col gap-4">
        <FormBanner tone="info">
          We&rsquo;ve sent a verification link to <strong>{verifySent}</strong>. Click it to
          activate your account, then sign in.
        </FormBanner>
        <button
          type="button"
          onClick={switchTab}
          className="p-0 bg-transparent border-none cursor-pointer underline font-semibold text-left decoration-[rgba(212,169,78,0.4)]"
          style={{ fontFamily: UI, fontSize: '0.8rem', color: C.gold }}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[1.1rem]">
      {serverError && <FormBanner tone="error">{serverError}</FormBanner>}

      {/* Full Name */}
      <div>
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Full Name</label>
        <FocusInput
          placeholder="Adunola Okonkwo"
          value={name} onChange={e => setName(e.target.value)}
          error={submitted && !!errors.name} autoComplete="name"
        />
        {submitted && errors.name && <FieldError msg={errors.name} />}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Email Address</label>
        <FocusInput
          type="email" placeholder="adunola@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          error={submitted && !!errors.email} autoComplete="email"
        />
        {submitted && errors.email && <FieldError msg={errors.email} />}
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Phone Number</label>
        <div className="rg-split grid grid-cols-[130px_1fr] gap-2">
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
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Password</label>
        <PasswordInput
          value={password} onChange={e => setPassword(e.target.value)}
          error={submitted && !!errors.password}
          placeholder="Min. 8 characters" autoComplete="new-password"
        />
        {submitted && errors.password && <FieldError msg={errors.password} />}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Confirm Password</label>
        <PasswordInput
          value={confirm} onChange={e => setConfirm(e.target.value)}
          error={submitted && !!errors.confirm}
          placeholder="Re-enter password" autoComplete="new-password"
        />
        {submitted && errors.confirm && <FieldError msg={errors.confirm} />}
      </div>

      {/* Terms checkbox */}
      <div>
        <label className="flex items-start gap-[0.65rem] cursor-pointer">
          <input
            type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="shrink-0 w-[15px] h-[15px] mt-[2px]" style={{ accentColor: C.gold }}
          />
          <span className="leading-[1.5]" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.7)' }}>
            I agree to the{' '}
            <a href="#" className="no-underline border-b border-solid border-[rgba(46,74,158,0.3)]" style={{ color: C.indigo }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="no-underline border-b border-solid border-[rgba(46,74,158,0.3)]" style={{ color: C.indigo }}>Privacy Policy</a>
          </span>
        </label>
        {submitted && errors.agreed && <FieldError msg={errors.agreed} />}
      </div>

      <div className="mt-[0.2rem]">
        <GoldButton disabled={pending}>{pending ? 'Creating account…' : 'Create Account'}</GoldButton>
      </div>

      <OrDivider />

      <GoogleButton
        label="Sign up with Google"
        onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: returnTo('/account') })}
      />

      <p className="text-center mt-2 tracking-[0.01em]" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)' }}>
        Already have an account?{' '}
        <button type="button" onClick={switchTab} className="p-0 bg-transparent border-none cursor-pointer underline font-semibold decoration-[rgba(212,169,78,0.4)]" style={{ fontFamily: UI, fontSize: '0.8rem', color: C.gold }}>
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
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: UI, color: C.charcoal }}>
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
      <header className="border-b border-solid border-[rgba(212,169,78,0.22)]" style={{ backgroundColor: C.maroon }}>
        <div className="max-w-[1240px] mx-auto px-8 h-16 flex items-center justify-center relative">
          <Link to="/" className="text-center no-underline">
            <div className="font-medium tracking-[-0.01em] leading-[1.05]" style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.cream }}>
              AdeClassics
            </div>
            <div className="mt-[2px] uppercase tracking-[0.16em]" style={{ fontFamily: UI, fontSize: '0.525rem', color: C.gold }}>
              Timeless Elegance
            </div>
          </Link>
          <Link
            to="/shop"
            className="absolute left-8 flex items-center gap-[0.35rem] no-underline tracking-[0.06em] opacity-70"
            style={{ fontFamily: UI, fontSize: '0.68rem', color: C.cream }}
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
        <div className="auth-photo-col relative overflow-hidden" style={{ backgroundColor: C.charcoal }}>
          <img
            src="https://images.unsplash.com/photo-1687952622898-4e9514a710d5?w=900&h=1200&fit=crop&crop=faces,top&auto=format"
            alt="Man wearing a red filà cap"
            className="w-full h-full object-cover object-top block" style={{ opacity: 0.9 }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to top, rgba(43,35,32,0.72) 0%, rgba(43,35,32,0.08) 50%, transparent 100%)`,
          }} />
          {/* Caption */}
          <div className="absolute bottom-10 left-10 right-10">
            <p className="mb-[0.6rem] font-medium leading-[1.25] shadow-[0_1px_8px_rgba(0,0,0,0.3)]" style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
              Crafted with care.<br />Worn with pride.
            </p>
            <p className="tracking-[0.04em] leading-[1.6]" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
              Every filà, gele, and kaftan made by hand for you.
            </p>
          </div>
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: `linear-gradient(to bottom, ${C.gold}, transparent)` }} />
        </div>

        {/* Right — form panel */}
        <div className="flex flex-col justify-center py-12 px-10 max-w-[520px] mx-auto w-full box-border">

          {/* Eyebrow */}
          <p className="mb-[0.6rem] tracking-[0.2em]" style={{ ...label, fontSize: '0.6rem', color: C.gold }}>
            Welcome to AdeClassics
          </p>

          {/* Headline */}
          <h1 className="mb-7 font-medium leading-[1.1] tracking-[-0.01em]" style={{ fontFamily: DISPLAY, fontSize: '2rem', color: C.charcoal }}>
            {tab === 'signin' ? 'Sign In' : 'Create Your Account'}
          </h1>

          {/* Tab toggle */}
          <div className="flex gap-8 mb-8 border-b border-solid border-[rgba(43,35,32,0.14)]">
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
      <footer className="py-[1.1rem] px-8 border-t border-solid border-[rgba(43,35,32,0.1)]">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <span className="tracking-[0.04em]" style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.42)' }}>
            © 2026 AdeClassics Ltd. All rights reserved.
          </span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Returns'].map(l => (
              <a key={l} href="#" className="no-underline tracking-[0.04em] transition-colors duration-150" style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.5)' }}
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
