import { NextResponse, type NextRequest } from 'next/server';
import { Account } from 'node-appwrite';
import { adminClient, SESSION_COOKIE } from '@/server/appwrite-server';

/**
 * Where Appwrite returns the visitor after Google.
 *
 * The userId and secret in the query are a one-time token. Exchanging them here
 * — on the server — means the session secret goes straight into an httpOnly
 * cookie and is never exposed to client-side JavaScript.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(new URL('/auth?error=oauth', request.url));
  }

  try {
    const session = await new Account(adminClient()).createSession(userId, secret);

    const response = NextResponse.redirect(new URL('/account', request.url));
    response.cookies.set(SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: request.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      expires: new Date(session.expire),
    });

    return response;
  } catch (error) {
    console.error('[auth] could not exchange the OAuth token:', error);
    return NextResponse.redirect(new URL('/auth?error=oauth', request.url));
  }
}
