import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { PAGE_SCHEMAS, type PageSlug } from './content-schema';

/**
 * Reading and writing owner-editable page copy.
 *
 * Kept free of Next-specific imports so the same functions serve a server
 * component, a server action or — if a mobile app ever needs them — a route
 * handler.
 */

/**
 * Content for a page, always complete. A missing row, malformed JSON or a row
 * written before a field existed all fall back to the defaults rather than
 * throwing, so a bad edit can never take the storefront down.
 */
export async function getPageContent<S extends PageSlug>(
  slug: S
): Promise<(typeof PAGE_SCHEMAS)[S]['defaults']> {
  const { schema, defaults } = PAGE_SCHEMAS[slug];

  let row: { content: unknown } | null = null;
  try {
    row = await withDbRetry(`read ${slug}`, () => prisma.pageContent.findUnique({ where: { slug } }));
  } catch (error) {
    console.error(`[content] could not read "${slug}", using defaults:`, error);
    return defaults;
  }

  if (!row) return defaults;

  const parsed = schema.safeParse(row.content);
  if (!parsed.success) {
    console.warn(`[content] stored "${slug}" failed validation, using defaults`);
    return defaults;
  }

  return parsed.data as (typeof PAGE_SCHEMAS)[S]['defaults'];
}

/** Validates before writing, so the table can never hold an unusable shape. */
export async function savePageContent<S extends PageSlug>(slug: S, input: unknown) {
  const parsed = PAGE_SCHEMAS[slug].schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await withDbRetry(`save ${slug}`, () =>
      prisma.pageContent.upsert({
        where: { slug },
        create: { slug, content: parsed.data },
        update: { content: parsed.data },
      })
    );
  } catch (error) {
    console.error(`[content] could not save "${slug}":`, error);
    return { ok: false as const, errors: {} as Record<string, string[]>, unreachable: true as const };
  }

  return { ok: true as const };
}
