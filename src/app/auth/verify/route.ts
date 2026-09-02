import { NextResponse, type NextRequest } from 'next/server';
import { Account } from 'node-appwrite';
import { adminClient } from '@/server/appwrite-server';

/**
 * Target of the "confirm your email" link.
 *
 * Appwrite appends userId and secret; confirming them here marks the account
 * verified. The link is single-use, so a second click lands on the failure
 * branch — worth keeping the copy on /account forgiving about that.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(new URL('/account?verified=invalid', request.url));
  }

  try {
    await new Account(adminClient()).updateVerification(userId, secret);
    return NextResponse.redirect(new URL('/account?verified=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/account?verified=invalid', request.url));
  }
}
