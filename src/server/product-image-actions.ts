'use server';

import { ID, Permission, Role } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { getCurrentUser } from './auth';
import { getStorage, publicFileUrl, PRODUCT_BUCKET_ID } from './storage';

/**
 * Receives a product photo from the console and stores it in Appwrite Storage,
 * handing back the public URL to save on the product. Owner-only: the console
 * layout gates the page, but this action is a callable endpoint of its own, so
 * it checks the role again.
 */

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to upload images.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'No file received. Please choose an image.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: 'That image is over 10 MB. Please use a smaller file.' };
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { ok: false, message: 'Unsupported format. Use JPG, PNG, WEBP, GIF or AVIF.' };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name?.replace(/[^\w.\-]+/g, '_') || 'upload';
    const created = await getStorage().createFile(
      PRODUCT_BUCKET_ID,
      ID.unique(),
      InputFile.fromBuffer(buffer, safeName),
      // Public read on the file itself, so it loads on the storefront when the
      // bucket has File Security on. (With File Security off, the bucket's own
      // read permission governs instead — set that to "Any" in Appwrite.)
      [Permission.read(Role.any())],
    );

    return { ok: true, url: publicFileUrl(created.$id) };
  } catch (error) {
    console.error('[product-image] upload failed:', error);
    const message = error instanceof Error ? error.message : '';
    if (/missing scope|not authorized|unauthorized/i.test(message)) {
      return {
        ok: false,
        message: 'Uploads need the Appwrite API key to allow buckets and files. Add those scopes to APPWRITE_API_KEY.',
      };
    }
    return { ok: false, message: 'Could not upload that image just now. Please try again.' };
  }
}
