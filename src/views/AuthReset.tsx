'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/lib/router';
import { completePasswordReset } from '@/server/auth-actions';
import { C, DISPLAY, UI, label } from '../tokens';

export default function AuthReset() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const userId = params?.get('userId') ?? '';
  const secret = params?.get('secret') ?? '';
  const linkValid = Boolean(userId && secret);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('Those passwords do not match.');

    const data = new FormData();
    data.set('userId', userId);
    data.set('secret', secret);
    data.set('password', password);

    startTransition(async () => {
      const result = await completePasswordReset(data);
      if (result.ok) {
        setDone(true);
        setTimeout(() => router.push('/auth'), 2200);
      } else {
        setError(result.message);
      }
    });
  }

  const [show, setShow] = useState(false);

  const field: React.CSSProperties = {
    width: '100%', padding: '0.8rem 0.9rem', fontFamily: UI, fontSize: '0.9rem',
    border: '1px solid rgba(43,35,32,0.18)', borderRadius: 5, outline: 'none', color: C.charcoal,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.cream, display: 'grid', placeItems: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ ...label, color: C.gold, fontSize: '0.6rem', letterSpacing: '0.18em' }}>AdeClassics</div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: '1.9rem', fontWeight: 400, color: C.charcoal, margin: '0.5rem 0 1.5rem', letterSpacing: '-0.02em' }}>
          Choose a new password
        </h1>

        {!linkValid ? (
          <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.6 }}>
            This reset link is incomplete or has already been used.{' '}
            <Link to="/auth" style={{ color: C.maroon }}>Request a new one</Link>.
          </p>
        ) : done ? (
          <p style={{ fontFamily: UI, fontSize: '0.9rem', color: C.teal, lineHeight: 1.6 }}>
            Password updated. Taking you to sign in…
          </p>
        ) : (
          <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div role="alert" style={{ fontFamily: UI, fontSize: '0.82rem', color: C.maroon, backgroundColor: 'rgba(122,46,56,0.07)', border: '1px solid rgba(122,46,56,0.25)', borderRadius: 6, padding: '0.7rem 0.85rem' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="pw" style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>New password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="pw"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  style={{ ...field, paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: 'rgba(43,35,32,0.45)', lineHeight: 0,
                  }}
                >
                  {show ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="pw2" style={{ ...label, fontSize: '0.65rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>Confirm password</label>
              <input
                id="pw2"
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter password"
                style={field}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              style={{
                marginTop: '0.4rem', width: '100%', padding: '0.95rem', border: 'none', borderRadius: 5,
                backgroundColor: C.gold, color: C.charcoal, fontFamily: UI, fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
