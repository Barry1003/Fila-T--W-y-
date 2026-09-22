'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/lib/router';
import { authClient } from '@/lib/auth/client';
import { C, DISPLAY, UI, label } from '../tokens';

/**
 * Dedicated "forgot your password" page.
 *
 * Enter an email, Neon Auth sends a reset link to /auth/reset. The confirmation
 * is deliberately neutral so it can't be used to discover which addresses have
 * accounts.
 */
export default function AuthForgot() {
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState(params?.get('email') ?? '');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return setError('Enter a valid email address.');
    }

    startTransition(async () => {
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth/reset` : '/auth/reset';
      try {
        await authClient.requestPasswordReset({ email: value, redirectTo });
        setSent(true);
      } catch (err) {
        // The client throws on failure. A rate-limit is worth surfacing;
        // anything else stays neutral so the form can't reveal which addresses
        // have accounts.
        const e = (err ?? {}) as { code?: string; status?: number; message?: string };
        if (e.code === 'TOO_MANY_REQUESTS' || e.status === 429 || (e.message ?? '').toLowerCase().includes('too many')) {
          setError('Too many attempts. Wait a minute and try again.');
        } else {
          setSent(true);
        }
      }
    });
  }

  const field: React.CSSProperties = {
    fontFamily: UI, fontSize: '0.9rem',
    border: '1px solid rgba(43,35,32,0.18)', outline: 'none', color: C.charcoal,
  };

  return (
    <div className="min-h-screen grid place-items-center py-8 px-5" style={{ backgroundColor: C.cream }}>
      <div className="w-full max-w-[420px]">
        <div style={{ ...label, color: C.gold, fontSize: '0.6rem', letterSpacing: '0.18em' }}>AdeClassics</div>
        <h1 className="mt-2 mx-0 mb-3" style={{ fontFamily: DISPLAY, fontSize: '1.9rem', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.02em' }}>
          Reset your password
        </h1>

        {sent ? (
          <>
            <div
              role="status"
              className="rounded-[6px] py-[0.8rem] px-[0.95rem] mb-5"
              style={{ fontFamily: UI, fontSize: '0.85rem', color: C.charcoal, lineHeight: 1.6, backgroundColor: 'rgba(59,138,147,0.09)', border: '1px solid rgba(59,138,147,0.3)' }}
            >
              If an account exists for <strong>{email.trim().toLowerCase()}</strong>, a reset link
              is on its way. Open it to choose a new password — check your spam folder if it
              doesn&rsquo;t arrive within a few minutes.
            </div>
            <Link to="/auth" style={{ fontFamily: UI, fontSize: '0.85rem', color: C.maroon }}>
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <p className="mb-1" style={{ fontFamily: UI, fontSize: '0.88rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.6 }}>
              Enter the email on your account and we&rsquo;ll send a link to reset your password.
            </p>

            {error && (
              <div role="alert" className="rounded-[6px] py-[0.7rem] px-[0.85rem]" style={{ fontFamily: UI, fontSize: '0.82rem', color: C.maroon, backgroundColor: 'rgba(122,46,56,0.07)', border: '1px solid rgba(122,46,56,0.25)' }}>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.65rem', color: C.charcoal }}>Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full py-[0.8rem] px-[0.9rem] rounded-[5px]"
                style={field}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-[0.2rem] w-full p-[0.95rem] rounded-[5px] uppercase"
              style={{
                border: 'none',
                backgroundColor: C.gold, color: C.charcoal, fontFamily: UI, fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '0.14em',
                cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Sending…' : 'Send reset link'}
            </button>

            <Link to="/auth" className="text-center" style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(43,35,32,0.6)' }}>
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
