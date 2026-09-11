import { notFound } from 'next/navigation';
import CollectionPage from '@/views/CollectionPage';
import { listCollections, listProducts } from '@/server/catalogue';

type Params = { params: Promise<{ slug: string }> };

/**
 * A collection, straight from the catalogue the console edits — so a product
 * the owner adds, edits or unpublishes shows here without a second source of
 * truth. Only PUBLISHED products come back from listProducts; drafts stay the
 * owner's business.
 */
export default async function Page({ params }: Params) {
  const { slug } = await params;

  // Sequential, not Promise.all: Neon opens a socket per query and firing
  // several at a sleeping compute makes a cold start fail.
  const collections = await listCollections();
  const collection = collections.find(c => c.slug === slug);
  if (!collection) notFound();

  const all = await listProducts();
  const products = all.filter(p => p.collectionSlug === slug);

  return <CollectionPage collection={collection} products={products} />;
}
