import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { withDbRetry } from '@/server/db';
import { getCurrentUser } from '@/server/auth';
import { publicFileUrl } from '@/server/storage';
import { CATALOGUE_TAG } from '@/server/catalogue';

/**
 * One-time importer for the Fila Gobi caps the owner sent. Owner-gated and
 * idempotent — a cap whose slug already exists is skipped, so hitting this twice
 * is harmless. Images are already in Appwrite (referenced by file id). Share
 * cards are baked separately (by fetching each /og.jpg) to keep this request
 * fast and well under the function timeout.
 *
 * Delete this route once the import has run.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type CapDef = { name: string; color: string; images: string[]; velvet?: boolean };

const PRICE_CENTS = 8500; // CAD $85
const SIZES = ['S', 'M', 'L', 'XL'];

const CAPS: CapDef[] = [
  { name: 'Royal Blue Aso-oke',    color: 'Royal Blue',       images: ['6aaad0ec07bd56182047'] },
  { name: 'Green & Gold Stripe',   color: 'Green & Gold',     images: ['6aaad0e110969178c423'] },
  { name: 'Olive Green',           color: 'Olive',            images: ['6aaad0e6c47779b29ad1'] },
  { name: 'Magenta & Purple Stripe', color: 'Magenta & Purple', images: ['6aaad10de2d81faa365c'] },
  { name: 'Teal & Tan Stripe',     color: 'Teal & Tan',       images: ['6aaad0f0949b95bf3ac3', '6aaad12e88fc0ff162e1'] },
  { name: 'Emerald Pinstripe',     color: 'Emerald',          images: ['6aaad103db12289f057a'] },
  { name: 'Camel',                 color: 'Camel',            images: ['6aaad10aaabe5b564d78'] },
  { name: 'Maroon & Blue Stripe',  color: 'Maroon & Blue',    images: ['6aaad11f66364c68d3cc'] },
  { name: 'Purple Multi-Stripe',   color: 'Purple',           images: ['6aaad110a4c9d6ba7738', '6aaad1286d1d9d3cbae6'] },
  { name: 'Black',                 color: 'Black',            images: ['6aaad113ce332d9e9511'] },
  { name: 'Blue & Red Stripe',     color: 'Blue & Red',       images: ['6aaad13528512c80d2da'] },
  { name: 'Magenta & Gold',        color: 'Magenta & Gold',   images: ['6aaad13913ea40b16f99'] },
  { name: 'Maroon Velvet',         color: 'Maroon',           images: ['6aaad13b9a3133df94d5'], velvet: true },
  { name: 'Black Velvet',          color: 'Black',            images: ['6aaad11ad4f02b84667c'], velvet: true },
  { name: 'Royal Blue Velvet',     color: 'Royal Blue',       images: ['6aaad11ad4f02b84667c'], velvet: true },
  { name: 'Emerald Velvet',        color: 'Emerald',          images: ['6aaad11ad4f02b84667c'], velvet: true },
];

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return NextResponse.json({ ok: false, message: 'Owner only.' }, { status: 403 });
  }

  const category = await withDbRetry('import: find category', () =>
    prisma.category.findFirst({ where: { name: 'Fila Gobi' }, select: { id: true } })
  );
  if (!category) {
    return NextResponse.json({ ok: false, message: 'Fila Gobi category not found.' }, { status: 500 });
  }

  const created: string[] = [];
  const skipped: string[] = [];
  const failed: { name: string; error: string }[] = [];

  for (const cap of CAPS) {
    const title = `Gobi Filà Cap — ${cap.name}`;
    const slug = slugify(title);
    try {
      const exists = await withDbRetry('import: check', () =>
        prisma.product.findUnique({ where: { slug }, select: { id: true } })
      );
      if (exists) { skipped.push(slug); continue; }

      const description = cap.velvet
        ? 'Embroidered velvet Gobi filà cap with hand-beaded detailing. Made by hand in Nigeria.'
        : `Handwoven aso-oke Gobi filà cap in ${cap.name.toLowerCase()}. Each cap is made by hand in Nigeria — no two are exactly alike.`;

      await withDbRetry('import: create', () =>
        prisma.product.create({
          data: {
            title,
            slug,
            description,
            categoryId: category.id,
            priceCad: new Prisma.Decimal(PRICE_CENTS).dividedBy(100),
            status: 'PUBLISHED',
            tag: 'NEW',
            inStock: true,
            images: { create: cap.images.map((fid, i) => ({ url: publicFileUrl(fid), position: i, alt: title, color: null })) },
            variants: { create: SIZES.map(size => ({ size, color: cap.color, stock: 5 })) },
          },
          select: { id: true },
        })
      );
      created.push(slug);
    } catch (error) {
      failed.push({ name: cap.name, error: error instanceof Error ? error.message : String(error) });
    }
  }

  revalidateTag(CATALOGUE_TAG);

  return NextResponse.json({ ok: true, category: 'Fila Gobi', created, skipped, failed });
}
