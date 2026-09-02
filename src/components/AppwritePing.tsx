'use client';

import { useEffect } from 'react';
import { client, APPWRITE_PROJECT_NAME } from '@/lib/appwrite';

/**
 * Pings Appwrite once on load so the connection can be confirmed from the
 * browser console.
 *
 * Development only: once the setup is verified this is a wasted round trip on
 * every page view. Drop the NODE_ENV check to run it everywhere.
 */
export default function AppwritePing() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    client
      .ping()
      .then(() => console.info(`[appwrite] connected to "${APPWRITE_PROJECT_NAME}"`))
      .catch((error: unknown) => console.error('[appwrite] ping failed:', error));
  }, []);

  return null;
}
