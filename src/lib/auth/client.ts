'use client';

import { createAuthClient } from '@neondatabase/neon-js/auth/next';

/**
 * Neon Auth (Better Auth), browser side.
 *
 * All auth actions the customer takes — sign up, sign in, Google, forgot/reset
 * password, sign out — go through this client. It talks to the app's own
 * `/api/auth/*` route, which proxies to the Neon Auth server and sets the
 * httpOnly session cookie, so the session is never readable by page JavaScript.
 */
export const authClient = createAuthClient();
