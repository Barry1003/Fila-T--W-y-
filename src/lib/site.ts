/**
 * The canonical, absolute origin of the storefront — used for share links,
 * `metadataBase`, and Open Graph URLs, which must be absolute for other sites
 * to unfurl them.
 *
 * Prefers an explicit override, then Vercel's stable production domain (not the
 * per-deployment URL, so a shared link keeps working after the next deploy),
 * and finally the known production host.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) return `https://${prod.replace(/\/+$/, '')}`;

  return 'https://fila-t-w-y.vercel.app';
}
