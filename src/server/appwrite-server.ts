import 'server-only';
import { Client, Users } from 'node-appwrite';

/**
 * Server-side Appwrite — storage only.
 *
 * Auth moved to Neon Auth (see `@/lib/auth/server`); Appwrite is kept purely as
 * the media/image store. `adminClient` uses the API key, so it must never be
 * called from the browser.
 */

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
