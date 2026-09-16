import { getProductBySlug } from '@/server/catalogue';
import { renderOgCardJpeg } from '@/server/og-card';
import { putOgImage } from '@/server/storage';

/**
 * Renders (and caches) a product's share card. `og:image` points at the static
 * Appwrite copy — baked on product-save and by the backfill — so scrapers fetch
 * a plain file with zero render time. This route stays as a self-healing
 * fallback and a bake trigger: any direct hit renders the card and stores it,
 * so fetching it is enough to (re)create the static file.
 *
 * Node runtime — the catalogue read goes through Prisma and sharp is native.
 */

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // A DB failure must not 500 the image: a broken og:image shows no preview at
  // all, worse than a photoless card. Log so an outage is visible.
  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error('[og] product lookup failed for', slug, error);
  }

  const jpeg = await renderOgCardJpeg({
    title: product?.title ?? 'AdeClassics',
    priceCad: product?.priceCad ?? null,
    category: product?.category ?? 'Handcrafted in Nigeria',
    imageUrl: product?.imageUrl,
  });

  // Persist the static copy so og:image resolves after any access (self-heal).
  if (product) {
    putOgImage(product.id, jpeg).catch(err => console.error('[og] store failed for', slug, err));
  }

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
