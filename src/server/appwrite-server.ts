import 'server-only';
import { cookies } from 'next/headers';
import { Account, Client, Users } from 'node-appwrite';

/**
 * Server-side Appwrite.
 *
 * Sign-in uses Appwrite's SSR flow rather than the browser SDK's own session:
 * Appwrite hands back a one-time token, the server exchanges it for a session
 * secret, and that secret is stored in an httpOnly cookie. The upshot is that
 * server components and server actions can identify the visitor, and the
 * session is never readable by client-side JavaScript.
 */

export const SESSION_COOKIE = 'ac_session';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

function baseClient() {
  if (!endpoint || !projectId) {
    throw new Error('Appwrite is not configured — see .env.example.');
  }
  return new Client().setEndpoint(endpoint).setProject(projectId);
}

/** Admin client. Uses the API key, so it must never be called from the browser. */
export function adminClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) throw new Error('APPWRITE_API_KEY is not set — server-side Appwrite calls need it.');
  return baseClient().setKey(apiKey);
}

export function adminUsers() {
  return new Users(adminClient());
}

/** Client acting as the signed-in visitor, or null when there is no session. */
export async function sessionClient() {
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret) return null;
  return baseClient().setSession(secret);
}

export type AppwriteAccount = {
  $id: string;
  email: string;
  name: string;
};

/** The Appwrite account for the current request, or null if signed out. */
export async function getAppwriteAccount(): Promise<AppwriteAccount | null> {
  const client = await sessionClient();
  if (!client) return null;

  try {
    const account = await new Account(client).get();
    return { $id: account.$id, email: account.email, name: account.name };
  } catch {
    // Expired or revoked session — treat as signed out rather than throwing.
    return null;
  }
}
