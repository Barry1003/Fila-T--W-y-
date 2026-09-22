import 'server-only';
import { createNeonAuth } from '@neondatabase/neon-js/auth/next/server';

/**
 * Neon Auth (Better Auth), server side.
 *
 * The auth server itself is hosted by Neon at NEON_AUTH_BASE_URL; this instance
 * proxies to it, signs the local session cookie with NEON_AUTH_COOKIE_SECRET,
 * and exposes the Better Auth server methods (`getSession`, `signIn`, `signUp`,
 * …) for use in Server Components, Server Actions and Route Handlers.
 *
 * `getCurrentUser` in `@/server/auth` is the one place that reads this — it maps
 * the auth account onto the shop's own `User` row. Most of the app never touches
 * `auth` directly.
 */

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const secret = process.env.NEON_AUTH_COOKIE_SECRET;

if (!baseUrl || !secret) {
  throw new Error(
    'Neon Auth is not configured — set NEON_AUTH_BASE_URL and ' +
      'NEON_AUTH_COOKIE_SECRET (see .env.example).'
  );
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret,
    sessionDataTtl: 300, // cache the session for 5 minutes (the default)
  },
});
