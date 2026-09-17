'use server';

import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { CATALOGUE_TAG, getProductBySlug } from './catalogue';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { productSchema } from './product-schema';
import { bakeProductOg } from './og-bake';
import { deleteOgImage } from './storage';

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

      const images = input.images.map((image, position) => ({
        url: image.url,
        position,
        alt: input.title,
        // Empty means the photo is general; store null so a query can tell the
        // two apart.
        color: image.color || null,
      }));

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

        // Because size+color is unique and we don't have FKs to variants,
        // we can safely clear and recreate them to simplify keeping them in sync.
        await tx.productVariant.deleteMany({ where: { productId: updated.id } });
        await tx.productVariant.createMany({
          data: input.variants.map(variant => ({
            productId: updated.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
          })),
        });

        return updated;
      });
    });

    // The storefront caches the catalogue; the console must not show a stale
    // list either.
    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    revalidatePath(`/product/${saved.slug}`);

    // Re-bake the static share card so its Appwrite CDN copy matches the edit.
    // Best-effort: a baking hiccup must not fail the save (the /og.jpg route
    // still self-heals on access).
    try {
      const fresh = await getProductBySlug(saved.slug);
      if (fresh) {
        await bakeProductOg({
          id: fresh.id,
          title: fresh.title,
          priceCad: fresh.priceCad,
          category: fresh.category,
          imageUrl: fresh.imageUrl,
        });
      }
    } catch (bakeError) {
      console.error('[save product] og bake failed', bakeError);
    }

    return { ok: true, id: saved.id, slug: saved.slug };
  } catch (error) {
    console.error('[save product] failed', error);
    return { ok: false, message: 'We could not save this product just now. Please try again.' };
  }
}

export type ActionResult = { ok: true } | { ok: false; message: string };

/** Publish or unpublish a set of products at once (the bulk bar). */
export async function setProductsStatus(ids: string[], status: 'PUBLISHED' | 'DRAFT'): Promise<ActionResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to change products.' };
  }
  if (ids.length === 0) return { ok: true };

  try {
    await withDbRetry('bulk set status', () =>
      prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } })
    );
    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    return { ok: true };
  } catch (error) {
    console.error('[bulk status] failed', error);
    return { ok: false, message: 'Could not update those products just now. Please try again.' };
  }
}

/** Delete a set of products at once (the bulk bar). */
export async function deleteProducts(ids: string[]): Promise<ActionResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to delete products.' };
  }
  if (ids.length === 0) return { ok: true };

  try {
    await withDbRetry('bulk delete', () => prisma.product.deleteMany({ where: { id: { in: ids } } }));
    ids.forEach(id => { deleteOgImage(id).catch(() => {}); });
    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    return { ok: true };
  } catch (error) {
    console.error('[bulk delete] failed', error);
    return { ok: false, message: 'Could not delete those products just now. Please try again.' };
  }
}

/**
 * Remove a product. Images and variants cascade; order items keep their
 * snapshotted name (the FK is set null), so order history stays intact.
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to delete products.' };
  }

  try {
    await withDbRetry('delete product', () => prisma.product.delete({ where: { id } }));
    deleteOgImage(id).catch(() => {}); // best-effort share-card cleanup

    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    return { ok: true };
  } catch (error) {
    console.error('[delete product] failed', error);
    return { ok: false, message: 'Could not delete this product just now. Please try again.' };
  }
}

/**
 * Copy a product — its details, images and variants — as a new DRAFT with a
 * "(Copy)" title, so the owner can tweak it before publishing. Handy for a run
 * of near-identical pieces (a colour of the same cap, say).
 */
export async function duplicateProduct(id: string): Promise<SaveProductResult> {
  const user = await getCurrentUser().catch(() => null);
  if (user?.role !== 'OWNER') {
    return { ok: false, message: 'You do not have permission to duplicate products.' };
  }

  try {
    const src = await withDbRetry('read for duplicate', () =>
      prisma.product.findUnique({
        where: { id },
        include: { images: { orderBy: { position: 'asc' } }, variants: true },
      })
    );
    if (!src) return { ok: false, message: 'That product no longer exists.' };

    const title = `${src.title} (Copy)`;
    const created = await withDbRetry('create duplicate', async () => {
      const slug = await uniqueSlug(title);
      return prisma.product.create({
        data: {
          title,
          slug,
          description: src.description,
          categoryId: src.categoryId,
          priceCad: src.priceCad,
          priceNgn: src.priceNgn,
          productionDays: src.productionDays,
          status: 'DRAFT', // a copy starts unpublished so it isn't a duplicate live listing
          tag: src.tag,
          inStock: src.inStock,
          metaTitle: src.metaTitle,
          metaDescription: src.metaDescription,
          images: { create: src.images.map(im => ({ url: im.url, position: im.position, alt: im.alt, color: im.color })) },
          // sku is unique, so a copy can't reuse it.
          variants: { create: src.variants.map(v => ({ size: v.size, color: v.color, stock: v.stock })) },
        },
        select: { id: true, slug: true },
      });
    });

    revalidateTag(CATALOGUE_TAG);
    revalidatePath('/console/products');
    return { ok: true, id: created.id, slug: created.slug };
  } catch (error) {
    console.error('[duplicate product] failed', error);
    return { ok: false, message: 'Could not duplicate this product just now. Please try again.' };
  }
}
