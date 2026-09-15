import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Product from '@/views/Product';
import { getProductBySlug, listProducts } from '@/server/catalogue';
import { getCurrentUser } from '@/server/auth';
import { isInWishlist } from '@/server/account';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: 'Product not found — AdeClassics' };

  return {
    title: `${product.title} — AdeClassics`,
    description: `${product.title}${product.colors.length ? ` in ${product.colors.join(', ')}` : ''}. Handcrafted, CAD $${product.priceCad}.`,
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Same category first, then the rest of the catalogue, so a quiet category
  // still fills the row.
  const all = await listProducts();
  const related = [
    ...all.filter(p => p.category === product.category && p.id !== product.id),
    ...all.filter(p => p.category !== product.category),
  ].slice(0, 4);

  const user = await getCurrentUser().catch(() => null);
  const inWishlist = user ? await isInWishlist(user.id, product.id) : false;

  return <Product product={product} related={related} inWishlist={inWishlist} signedIn={Boolean(user)} />;
}
