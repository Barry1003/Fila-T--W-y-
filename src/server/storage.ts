import 'server-only';
import { Storage } from 'node-appwrite';
import { adminClient } from './appwrite-server';

/**
 * Appwrite Storage, used to hold product photos the owner uploads from the
 * console. Reuses the same Appwrite project and API key already wired for auth,
 * so there is no second provider to configure.
 *
 * The bucket is created by hand in the Appwrite console; its id lives in
 * APPWRITE_PRODUCT_BUCKET_ID (falling back to the one already made). Uploading
 * only needs the API key's `files.write` scope — no bucket-management scopes —
 * because the bucket already exists.
 *
 * For the storefront's `<img src>` to load the photo without a signed request,
 * the bucket must grant read to "Any" (set that on the bucket in Appwrite).
 */

export const PRODUCT_BUCKET_ID =
  process.env.APPWRITE_PRODUCT_BUCKET_ID?.trim() || '6aa8e299001777251a0f';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

export function getStorage() {
  return new Storage(adminClient());
}

/** The public view URL for a stored file — safe to drop straight into `<img>`. */
export function publicFileUrl(fileId: string): string {
  return `${endpoint}/storage/buckets/${PRODUCT_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
}
