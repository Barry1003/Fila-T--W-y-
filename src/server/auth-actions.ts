'use server';

import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { Account, AppwriteException, ID, OAuthProvider } from 'node-appwrite';
import { adminClient, sessionClient, SESSION_COOKIE } from './appwrite-server';

export type AuthResult = { ok: true } | { ok: false; message: string };

/** Absolute origin for this request, so redirects work in dev and production. */
async function origin() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

async function storeSession(secret: string, expire: string) {
  (await cookies()).set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expire),
  });
}

/**
 * Appwrite's messages are written for developers. Translate the ones a customer
 * can actually cause, and keep sign-in failures deliberately vague — saying
 * "no account with that email" tells an attacker which addresses are registered.
 */
function readableError(error: unknown, context: 'signin' | 'signup' | 'reset'): string {
  const type = error instanceof AppwriteException ? error.type : '';

  switch (type) {
    case 'user_already_exists':
      return 'An account with that email already exists. Try signing in instead.';
    case 'password_personal_data':
      return 'Choose a password that does not contain your name or email.';
    case 'password_recently_used':
      return 'That password has been used before. Choose a different one.';
    case 'general_rate_limit_exceeded':
      return 'Too many attempts. Wait a minute and try again.';
    case 'user_invalid_credentials':
      return 'Those details did not match an account.';
    default:
      if (context === 'signup') return 'Could not create the account. Check the details and try again.';
      if (context === 'reset') return 'Could not send the reset email. Try again in a moment.';
      return 'Could not sign in. Check the details and try again.';
  }
}

// ── Email and password ───────────────────────────────────────────────────────

export async function signUpWithEmail(formData: FormData): Promise<AuthResult> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!name || !email || !password) {
    return { ok: false, message: 'Fill in your name, email and password.' };
  }
  if (password.length < 8) {
    return { ok: false, message: 'Use at least 8 characters for your password.' };
  }

  const account = new Account(adminClient());

  try {
    await account.create(ID.unique(), email, password, name);
  } catch (error) {
    return { ok: false, message: readableError(error, 'signup') };
  }

  // Sign the new account straight in, then send the verification email.
  try {
    const session = await account.createEmailPasswordSession(email, password);
    await storeSession(session.secret, session.expire);
  } catch (error) {
    return { ok: false, message: readableError(error, 'signin') };
  }

  await sendVerificationEmail();
  return { ok: true };
}

export async function signInWithEmail(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { ok: false, message: 'Enter your email and password.' };
  }

  try {
    const session = await new Account(adminClient()).createEmailPasswordSession(email, password);
    await storeSession(session.secret, session.expire);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: readableError(error, 'signin') };
  }
}

// ── Verification ─────────────────────────────────────────────────────────────

/** Sends (or resends) the "confirm your email" link to the signed-in account. */
export async function sendVerificationEmail(): Promise<AuthResult> {
  const client = await sessionClient();
  if (!client) return { ok: false, message: 'Sign in first.' };

  try {
    await new Account(client).createVerification(`${await origin()}/auth/verify`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: readableError(error, 'reset') };
  }
}

// ── Password reset ───────────────────────────────────────────────────────────

export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) return { ok: false, message: 'Enter your email address.' };

  try {
    await new Account(adminClient()).createRecovery(email, `${await origin()}/auth/reset`);
  } catch (error) {
    // Rate limits are worth surfacing; anything else is swallowed on purpose so
    // this cannot be used to discover which emails have accounts.
    if (error instanceof AppwriteException && error.type === 'general_rate_limit_exceeded') {
      return { ok: false, message: readableError(error, 'reset') };
    }
  }

  return { ok: true };
}

export async function completePasswordReset(formData: FormData): Promise<AuthResult> {
  const userId = String(formData.get('userId') ?? '');
  const secret = String(formData.get('secret') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!userId || !secret) return { ok: false, message: 'That reset link is no longer valid.' };
  if (password.length < 8) return { ok: false, message: 'Use at least 8 characters for your password.' };

  try {
    await new Account(adminClient()).updateRecovery(userId, secret, password);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: readableError(error, 'reset') };
  }
}

// ── Google, once the provider is enabled ─────────────────────────────────────

export async function signInWithGoogle() {
  const base = await origin();
  const redirectUrl = await new Account(adminClient()).createOAuth2Token(
    OAuthProvider.Google,
    `${base}/auth/callback`,
    `${base}/auth?error=oauth`
  );

  redirect(redirectUrl);
}

export async function signOut() {
  const client = await sessionClient();
  if (client) {
    try {
      await new Account(client).deleteSession('current');
    } catch {
      /* already expired */
    }
  }

  (await cookies()).delete(SESSION_COOKIE);
  redirect('/');
}
