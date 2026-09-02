import { NextResponse, type NextRequest } from 'next/server';

/**
 * The landing page is a first-visit introduction. Once someone has seen it,
 * "/" takes them straight to the shop, which is where returning shoppers
 * actually want to start.
 *
 * This runs on the server against a cookie rather than in the browser against
 * localStorage, so returning visitors never see the landing page flash up
 * before being redirected away from it.
 */
const SEEN_LANDING = 'ac_seen_landing';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
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

// Only the landing page; every other route is untouched.
export const config = { matcher: '/' };
