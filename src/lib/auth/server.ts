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

/**
 * The auth instance, or null when the env is not set.
 *
 * Missing env (e.g. a build before the vars are added) must read as "signed out"
 * rather than throw at import — otherwise it takes the whole build down, not
 * just auth. Auth of course needs the env set to actually work at runtime.
 */
export const auth =
  baseUrl && secret
    ? createNeonAuth({
        baseUrl,
        cookies: {
          secret,
          sessionDataTtl: 300, // cache the session for 5 minutes (the default)
        },
      })
    : null;
