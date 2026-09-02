'use client';

import { Account, Client } from 'appwrite';

/**
 * Appwrite browser client.
 *
 * The `appwrite` package is the web SDK and expects browser globals, so this
 * module is client-only — server code that needs Appwrite (validating a session
 * during SSR, for example) wants `node-appwrite` instead.
 *
 * The project id and endpoint are public identifiers: they travel in every
 * request the browser makes. They live in NEXT_PUBLIC_ vars so staging can
 * point at a different project, not because they are secret.
 */

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    'Appwrite is not configured — set NEXT_PUBLIC_APPWRITE_ENDPOINT and ' +
      'NEXT_PUBLIC_APPWRITE_PROJECT_ID (see .env.example).'
  );
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId);

/** Sessions, OAuth and the current user. */
export const account = new Account(client);

export const APPWRITE_PROJECT_NAME =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME ?? 'Appwrite';
