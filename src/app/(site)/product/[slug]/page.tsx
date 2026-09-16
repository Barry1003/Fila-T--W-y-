import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Product from '@/views/Product';
import { getProductBySlug, listProducts } from '@/server/catalogue';
import { getCurrentUser } from '@/server/auth';
import { isInWishlist } from '@/server/account';
import { siteUrl } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const base = siteUrl();

  if (!product) {
    return { metadataBase: new URL(base), title: 'Product not found — AdeClassics' };
  }

  const title = `${product.title} — AdeClassics`;
  const description = `${product.title}${product.colors.length ? ` in ${product.colors.join(', ')}` : ''}. Handcrafted in Nigeria — CAD $${product.priceCad.toLocaleString()}.`;
  const path = `/product/${product.slug}`;

  // og:image is supplied by the sibling opengraph-image.tsx (the rendered
  // "Shop Now" card), which Next resolves to an absolute URL and mirrors onto
  // twitter:image — so a pasted link unfurls the same rich image everywhere.
  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      siteName: 'AdeClassics',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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
