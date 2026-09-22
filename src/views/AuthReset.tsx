'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/lib/router';
import { authClient } from '@/lib/auth/client';
import { C, DISPLAY, UI, label } from '../tokens';

export default function AuthReset() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Neon Auth appends a one-time token to the reset link; an invalid or expired
  // link comes back with ?error= instead.
  const token = params?.get('token') ?? '';
  const linkError = params?.get('error');
  const linkValid = Boolean(token) && !linkError;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('Those passwords do not match.');

    startTransition(async () => {
      try {
        await authClient.resetPassword({ newPassword: password, token });
        setDone(true);
        setTimeout(() => router.push('/auth'), 2200);
      } catch {
        // The client throws on failure (expired/invalid token, etc.).
        setError(
          'Could not update your password. Your reset link may have expired — request a new one.'
        );
      }
    });
  }

  const [show, setShow] = useState(false);

  // Layout for the fields is on the elements (FIELD_CLS); colour/type here.
  const field: React.CSSProperties = {
    fontFamily: UI, fontSize: '0.9rem',
    border: '1px solid rgba(43,35,32,0.18)', outline: 'none', color: C.charcoal,
  };
  const FIELD_CLS = 'w-full py-[0.8rem] px-[0.9rem] rounded-[5px]';

  return (
    <div className="min-h-screen grid place-items-center py-8 px-5" style={{ backgroundColor: C.cream }}>
      <div className="w-full max-w-[420px]">
        <div style={{ ...label, color: C.gold, fontSize: '0.6rem', letterSpacing: '0.18em' }}>AdeClassics</div>
        <h1 className="mt-2 mx-0 mb-6" style={{ fontFamily: DISPLAY, fontSize: '1.9rem', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.02em' }}>
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
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            {error && (
              <div role="alert" className="rounded-[6px] py-[0.7rem] px-[0.85rem]" style={{ fontFamily: UI, fontSize: '0.82rem', color: C.maroon, backgroundColor: 'rgba(122,46,56,0.07)', border: '1px solid rgba(122,46,56,0.25)' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="pw" className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>New password</label>
              <div className="relative">
                <input
                  id="pw"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full py-[0.8rem] pl-[0.9rem] pr-11 rounded-[5px]"
                  style={field}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-[0.6rem] top-1/2 -translate-y-1/2 cursor-pointer p-[4px]"
                  style={{ background: 'none', border: 'none', color: 'rgba(43,35,32,0.45)', lineHeight: 0 }}
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
              <label htmlFor="pw2" className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Confirm password</label>
              <input
                id="pw2"
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter password"
                className={FIELD_CLS}
                style={field}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-[0.4rem] w-full p-[0.95rem] rounded-[5px] uppercase"
              style={{
                border: 'none',
                backgroundColor: C.gold, color: C.charcoal, fontFamily: UI, fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.14em',
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
