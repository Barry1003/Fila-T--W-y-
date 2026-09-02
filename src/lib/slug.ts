/**
 * URL slug from a title.
 *
 * Shared by the seed and the storefront so a product's link is derivable from
 * its name without a lookup — and, while views are still being moved onto the
 * database, so fixture-backed pages can link to database-backed ones.
 *
 * Strips the diacritics in names like "Ọjọ Ipele" and "Fìla Gòbì".
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
