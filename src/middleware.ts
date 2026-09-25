import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth/server';

/**
 * Completes OAuth (Google) sign-in.
 *
 * Neon Auth runs the provider handshake on its own domain, then redirects back
 * with a one-time `verifier`. This exchanges that verifier for an app-domain
 * session cookie so server-side `getCurrentUser` can see the session. Without
 * it, Google sign-in creates a session on Neon's domain the app can never read
 * and the user is bounced back to sign in.
 *
 * The Neon middleware also *protects* every non-auth route by default, which
 * would lock the public storefront — so it is invoked ONLY on the OAuth return
 * (when the verifier is present). Ordinary route protection stays in the
 * account/console layouts.
 *
 * The landing page at "/" is always shown; it is no longer redirected to /shop
 * after a first visit.
 */

/** Query param Neon Auth appends when redirecting back from an OAuth provider. */
const OAUTH_VERIFIER = 'neon_auth_session_verifier';

// null when auth env is not configured (e.g. a build before the vars are set).
const neonAuth = auth?.middleware({ loginUrl: '/auth' }) ?? null;

export async function middleware(request: NextRequest) {
  // OAuth return: let Neon exchange the verifier for a session cookie. (Exchange
  // happens before any protection check, so this never blocks a public page.)
  if (neonAuth && request.nextUrl.searchParams.has(OAUTH_VERIFIER)) {
    return neonAuth(request);
  }
  return NextResponse.next();
}

// Only the private areas where OAuth returns (Google's callbackURL is pinned to
// /account). The Neon SDK — which Next flags for Edge-unsupported APIs — never
// loads on the public storefront, so it cannot take those pages down.
export const config = {
  matcher: ['/account/:path*', '/console/:path*'],
};
