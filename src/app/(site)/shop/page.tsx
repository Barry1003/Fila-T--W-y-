import Shop from '@/views/Shop';
import { colorsOf, listCollections, listProducts } from '@/server/catalogue';

/**
 * Two round trips, run in sequence.
 *
 * Neon's driver opens a socket per query, and firing several at once against a
 * sleeping compute makes a cold start more likely to fail than warming one
 * connection and reusing it. Colours are derived from the products already
 * loaded rather than asked for separately.
 */
export default async function Page() {
  const products = await listProducts();
  const collections = await listCollections();

  return <Shop products={products} collections={collections} colors={colorsOf(products)} />;
}
