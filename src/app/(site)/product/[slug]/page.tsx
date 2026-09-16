import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Product from '@/views/Product';
import { getProductBySlug, listProducts } from '@/server/catalogue';
import { getCurrentUser } from '@/server/auth';
import { isInWishlist } from '@/server/account';
import { siteUrl } from '@/lib/site';
import { ogImageUrl } from '@/server/storage';

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

  // A static, pre-baked file on Appwrite's CDN — no render on the scraper's
  // fetch, which is what WhatsApp's on-device fetcher needs. Baked on save and
  // by the backfill; the ./og.jpg route re-creates it on access as a fallback.
  const ogImage = ogImageUrl(product.id);
  const image = {
    url: ogImage,
    secureUrl: ogImage,
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: title,
  };

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
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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

  return (
    <Product
      product={product}
      related={related}
      inWishlist={inWishlist}
      signedIn={Boolean(user)}
      shareBaseUrl={siteUrl()}
    />
  );
}
