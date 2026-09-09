'use server';

import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { CATALOGUE_TAG } from './catalogue';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { productSchema } from './product-schema';

/**
 * Creating and editing products from the console.
 *
 * The form could display a product but never save one, so the catalogue could
 * only be changed by re-running the seed. This is the write half.
 */

export type SaveProductResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * A slug nobody else is using.
 *
 * Two products can share a title — "Gele — Ivory" in two seasons — but a slug
 * addresses a page, so the second gets a suffix rather than an error the owner
 * has to work around.
 */
async function uniqueSlug(title: string, keepingId?: string): Promise<string> {
  const base = slugify(title) || 'product';

  for (let attempt = 0; ; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const clash = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!clash || clash.id === keepingId) return candidate;
  }
}

export async function saveProduct(raw: unknown): Promise<SaveProductResult> {
  // The console is gated in the layout, but an action is a public endpoint of
  // its own — anyone who knows its name can call it. Check here too.
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to change the catalogue.' };
  }

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Some details need another look.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  try {
    const saved = await withDbRetry('save product', async () => {
      const slug = await uniqueSlug(input.title, input.id);

      const fields = {
        title: input.title,
        slug,
        description: input.description || null,
        categoryId: input.categoryId,
        color: input.color,
        priceCad: new Prisma.Decimal(input.priceCadCents).dividedBy(100),
        productionDays: input.productionDays || null,
        tag: input.tag,
        status: input.status,
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        // Derived, not asked for: a product with no stock anywhere is not one a
        // shopper can buy, whatever the form says.
        inStock: input.variants.some(variant => variant.stock > 0),
      };

      const images = input.imageUrls.map((url, position) => ({ url, position, alt: input.title }));

      if (!input.id) {
        const created = await prisma.product.create({
          data: {
            ...fields,
            images: { create: images },
            variants: { create: input.variants },
          },
          select: { id: true, slug: true },
        });
        return created;
      }

      // Editing. Images and variants are replaced wholesale rather than
      // diffed — the form hands over the complete list, and reconciling would
      // add a lot of code for no visible difference at this size.
      return prisma.$transaction(async tx => {
        const updated = await tx.product.update({
          where: { id: input.id },
          data: fields,
          select: { id: true, slug: true },
        });

        await tx.productImage.deleteMany({ where: { productId: updated.id } });
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map(image => ({ ...image, productId: updated.id })),
          });
        }

        // Sizes nobody ordered can go; sizes on an existing order must not,
        // because OrderItem keeps the size as text and the variant row is what
        // stock is counted against. Update what stays, delete only the rest.
        const keeping = new Set(input.variants.map(variant => variant.size));
        await tx.productVariant.deleteMany({
          where: { productId: updated.id, size: { notIn: [...keeping] } },
        });

        for (const variant of input.variants) {
          await tx.productVariant.upsert({
            where: { productId_size: { productId: updated.id, size: variant.size } },
            create: { productId: updated.id, size: variant.size, stock: variant.stock },
            update: { stock: variant.stock },
          });
        }

        return updated;
      });
    });

    // The storefront caches the catalogue; the console must not show a stale
    // list either.
    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    revalidatePath(`/product/${saved.slug}`);

    return { ok: true, id: saved.id, slug: saved.slug };
  } catch (error) {
    console.error('[save product] failed', error);
    return { ok: false, message: 'We could not save this product just now. Please try again.' };
  }
}
