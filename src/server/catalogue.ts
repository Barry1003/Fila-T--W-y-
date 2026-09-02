import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/**
 * Reading the catalogue.
 *
 * Prisma rows are mapped to a flat shape the views can render directly:
 * Decimal becomes a number, the first image becomes a URL, variants become a
 * list of sizes. Views should not be handling Prisma types or Decimals.
 */

export type CatalogueProduct = {
  id: string;
  slug: string;
  title: string;
  category: string;
  collectionSlug: string | null;
  collectionName: string | null;
  tag: 'NEW' | 'SOLD OUT' | 'MADE TO ORDER';
  priceCad: number;
  imageUrl: string;
  color: string;
  sizes: string[];
  inStock: boolean;
};

export type CatalogueCollection = {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  categories: string[];
};

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1763823133159-c6f8ec380e33?w=900&h=1200&fit=crop&auto=format';

const TAG_LABELS = {
  NEW: 'NEW',
  SOLD_OUT: 'SOLD OUT',
  MADE_TO_ORDER: 'MADE TO ORDER',
} as const;

const productSelect = {
  id: true,
  slug: true,
  title: true,
  tag: true,
  color: true,
  inStock: true,
  priceCad: true,
  images: { select: { url: true }, orderBy: { position: 'asc' }, take: 1 },
  variants: { select: { size: true }, orderBy: { id: 'asc' } },
  category: {
    select: { name: true, parent: { select: { slug: true, name: true } } },
  },
} as const;

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  tag: keyof typeof TAG_LABELS;
  color: string;
  inStock: boolean;
  priceCad: unknown;
  images: { url: string }[];
  variants: { size: string }[];
  category: { name: string; parent: { slug: string; name: string } | null };
};

function toCatalogueProduct(row: ProductRow): CatalogueProduct {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category.name,
    collectionSlug: row.category.parent?.slug ?? null,
    collectionName: row.category.parent?.name ?? null,
    tag: TAG_LABELS[row.tag],
    // Prisma returns Decimal; the views want a plain number.
    priceCad: Number(row.priceCad),
    imageUrl: row.images[0]?.url ?? PLACEHOLDER_IMAGE,
    color: row.color,
    sizes: row.variants.map(v => v.size),
    inStock: row.inStock,
  };
}

export async function listProducts(): Promise<CatalogueProduct[]> {
  const rows = await withDbRetry('list products', () =>
    prisma.product.findMany({ select: productSelect, orderBy: { createdAt: 'asc' } })
  );
  return (rows as unknown as ProductRow[]).map(toCatalogueProduct);
}

export async function getProductBySlug(slug: string): Promise<CatalogueProduct | null> {
  const row = await withDbRetry('get product', () =>
    prisma.product.findUnique({ where: { slug }, select: productSelect })
  );
  return row ? toCatalogueProduct(row as unknown as ProductRow) : null;
}

/** Collections with their categories, in display order. */
export async function listCollections(): Promise<CatalogueCollection[]> {
  const rows = await withDbRetry('list collections', () =>
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { position: 'asc' },
      select: {
        slug: true,
        name: true,
        tagline: true,
        blurb: true,
        children: { orderBy: { position: 'asc' }, select: { name: true } },
      },
    })
  );

  return rows.map(c => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline ?? '',
    blurb: c.blurb ?? '',
    categories: c.children.map(child => child.name),
  }));
}

/** Colours present in a set of products, so the filter never offers a dead option. */
export function colorsOf(products: CatalogueProduct[]): string[] {
  return [...new Set(products.map(p => p.color))].sort();
}
