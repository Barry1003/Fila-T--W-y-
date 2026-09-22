import { auth } from '@/lib/auth/server';

/**
 * Proxies every `/api/auth/*` request to the Neon Auth server and manages the
 * session cookie. The client SDK (`@/lib/auth/client`) calls these endpoints;
 * nothing here is called directly.
 */
export const { GET, POST } = auth.handler();
