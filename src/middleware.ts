import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/auth/server';

/**
 * Two jobs:
 *
 * 1. Complete OAuth (Google) sign-in. Neon Auth runs the provider handshake on
 *    its own domain, then redirects back with a one-time `verifier`. This
 *    exchanges that verifier for an app-domain session cookie so server-side
 *    `getCurrentUser` can see the session. Without it, Google sign-in creates a
 *    session on Neon's domain that this app can never read — the user appears
 *    signed out and gets bounced back to sign in.
 *
 *    The Neon middleware also *protects* every non-auth route by default, which
 *    would lock the public storefront — so it is invoked ONLY on the OAuth
 *    return (when the verifier is present). Ordinary route protection stays in
 *    the account/console layouts.
 *
 * 2. The landing page. Once someone has seen it, "/" takes them straight to the
 *    shop. Runs on the server against a cookie so returning visitors never see
 *    the landing page flash before the redirect.
 */

const SEEN_LANDING = 'ac_seen_landing';
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Query param Neon Auth appends when redirecting back from an OAuth provider. */
const OAUTH_VERIFIER = 'neon_auth_session_verifier';

// null when auth env is not configured (e.g. a build before the vars are set).
const neonAuth = auth?.middleware({ loginUrl: '/auth' }) ?? null;

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. OAuth return: let Neon exchange the verifier for a session cookie,
  //    wherever the provider redirected back to. (Exchange happens before any
  //    protection check, so this never blocks a public page.)
  if (neonAuth && searchParams.has(OAUTH_VERIFIER)) {
    return neonAuth(request);
  }

  // 2. Landing page redirect.
  if (pathname === '/') {
    // ?preview=landing always shows the landing page, so it stays reviewable.
    if (searchParams.get('preview') === 'landing') return NextResponse.next();

    if (request.cookies.has(SEEN_LANDING)) {
      return NextResponse.redirect(new URL('/shop', request.url));
    }

    const response = NextResponse.next();
    response.cookies.set(SEEN_LANDING, '1', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

// Scoped deliberately: "/" for the landing redirect, and the private areas
// where OAuth returns (Google's callbackURL is pinned to /account). The Neon
// SDK — which Next flags for Edge-unsupported APIs — therefore never loads on
// the public storefront, so it cannot take those pages down.
export const config = {
  matcher: ['/', '/account/:path*', '/console/:path*'],
};
