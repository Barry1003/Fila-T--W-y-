'use server';

import { revalidatePath } from 'next/cache';
import { savePageContent } from './content';
import type { PageSlug } from './content-schema';

/** Which routes to rebuild when a page's content changes. */
const AFFECTED_PATHS: Record<PageSlug, string[]> = {
  home: ['/'],
};

/**
 * Saves page content from the console.
 *
 * Storefront pages are statically rendered, so an edit is only visible once the
 * affected routes are revalidated — without this the owner would save happily
 * and see no change on the site.
 */
export async function updatePageContent(slug: PageSlug, content: unknown) {
  const result = await savePageContent(slug, content);
  if (!result.ok) return result;

  for (const path of AFFECTED_PATHS[slug]) revalidatePath(path);
  return result;
}
