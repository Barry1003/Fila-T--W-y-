import { auth } from '@/lib/auth/server';

/**
 * Proxies every `/api/auth/*` request to the Neon Auth server and manages the
 * session cookie. The client SDK (`@/lib/auth/client`) calls these endpoints;
 * nothing here is called directly.
 *
 * When auth env is not configured the handler returns 503 rather than crashing,
 * so the app still builds and serves.
 */
function unavailable() {
  return new Response(JSON.stringify({ error: 'Auth is not configured.' }), {
    status: 503,
    headers: { 'content-type': 'application/json' },
  });
}

const handlers = auth?.handler();

export const GET = handlers?.GET ?? unavailable;
export const POST = handlers?.POST ?? unavailable;
