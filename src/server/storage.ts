import 'server-only';
import { Storage, Permission, Role } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
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

/* ─── Pre-baked share cards ───────────────────────────────────── */

/**
 * A product's baked share-card lives at a deterministic file id, so its public
 * URL is known without a lookup and re-baking overwrites the same file. cuids
 * fit Appwrite's 36-char id limit with the `og_` prefix.
 */
export function ogFileId(productId: string): string {
  return `og_${productId}`;
}

/** The stable, static CDN URL of a product's baked share card. */
export function ogImageUrl(productId: string): string {
  return publicFileUrl(ogFileId(productId));
}

/** Store (or replace) a product's baked share card. Public-read, like the bucket. */
export async function putOgImage(productId: string, jpeg: Buffer): Promise<void> {
  const storage = getStorage();
  const id = ogFileId(productId);
  // No upsert in Appwrite — replace by removing any existing file first.
  try {
    await storage.deleteFile(PRODUCT_BUCKET_ID, id);
  } catch {
    // Not there yet — fine.
  }
  await storage.createFile(
    PRODUCT_BUCKET_ID,
    id,
    InputFile.fromBuffer(jpeg, `${id}.jpg`),
    [Permission.read(Role.any())],
  );
}
