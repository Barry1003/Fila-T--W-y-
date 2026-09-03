import Home from '@/views/Home';
import { getPageContent } from '@/server/content';
import { listCollections, listProducts } from '@/server/catalogue';
import type { CatalogueCollection, CatalogueProduct } from '@/server/catalogue';

/**
 * The homepage is mostly editorial — hero, story, craftsmanship — with the
 * product grid as one section among several. So an unreachable catalogue
 * hides that section rather than taking the whole page down, the same way
 * missing page content falls back to defaults.
 *
 * The shop and product pages behave differently on purpose: there, an empty
 * catalogue would be a lie, so they surface the error instead.
 */
async function catalogueOrEmpty(): Promise<{
  products: CatalogueProduct[];
  collections: CatalogueCollection[];
}> {
  try {
    const products = await listProducts();
    const collections = await listCollections();
    return { products, collections };
  } catch (error) {
    console.error('[home] catalogue unavailable, rendering without it:', error);
    return { products: [], collections: [] };
  }
}

export default async function Page() {
  const content = await getPageContent('home');
  const { products, collections } = await catalogueOrEmpty();

  return <Home content={content} products={products} collections={collections} />;
}
