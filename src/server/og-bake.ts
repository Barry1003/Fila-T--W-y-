import 'server-only';
import { renderOgCardJpeg } from './og-card';
import { putOgImage } from './storage';
import { listProducts } from './catalogue';

/**
 * Baking the share card to Appwrite Storage, so `og:image` can point at a
 * static CDN file instead of rendering on demand — the reliable path for
 * WhatsApp's on-device fetcher, which can time out on a cold render.
 *
 * Called from the product-save hook (one product) and the backfill (all).
 */

export type BakeInput = {
  id: string;
  title: string;
  priceCad: number | null;
  category: string;
  imageUrl?: string | null;
};

export async function bakeProductOg(product: BakeInput): Promise<void> {
  const jpeg = await renderOgCardJpeg({
    title: product.title,
    priceCad: product.priceCad,
    category: product.category,
    imageUrl: product.imageUrl,
  });
  await putOgImage(product.id, jpeg);
}

export type BackfillResult = { total: number; baked: number; failed: { slug: string; error: string }[] };

/** (Re)bake every product's card. Idempotent — safe to run repeatedly. */
export async function bakeAllProducts(): Promise<BackfillResult> {
  const products = await listProducts();
  const failed: { slug: string; error: string }[] = [];
  let baked = 0;

  // Sequential: satori + sharp are CPU-heavy and each fetches a photo; hammering
  // them in parallel risks memory pressure and Appwrite rate limits.
  for (const p of products) {
    try {
      await bakeProductOg({ id: p.id, title: p.title, priceCad: p.priceCad, category: p.category, imageUrl: p.imageUrl });
      baked++;
    } catch (error) {
      failed.push({ slug: p.slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return { total: products.length, baked, failed };
}
