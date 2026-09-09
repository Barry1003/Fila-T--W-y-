import { z } from 'zod';

/**
 * What the console sends when the owner saves a product.
 *
 * The shape of the form, not the shape of the Prisma model — the two differ in
 * three places that the form used to get wrong:
 *
 *  - `tag` is one value, not a set. The database column is a single nullable
 *    enum, so a form offering five checkboxes could never round-trip.
 *  - Colour belongs to the product, not the variant. `ProductVariant` is
 *    (size, stock) and is unique on (productId, size).
 *  - Images are URLs. Until there is somewhere to upload files to, asking for a
 *    link is the honest version of an image picker.
 */

export const PRODUCT_TAGS = ['NEW', 'MADE_TO_ORDER', 'SOLD_OUT'] as const;
export const PRODUCT_STATUSES = ['DRAFT', 'PUBLISHED'] as const;

/** How the console writes the enum values, so the form reads like English. */
export const TAG_LABELS: Record<(typeof PRODUCT_TAGS)[number], string> = {
  NEW: 'New',
  MADE_TO_ORDER: 'Made to Order',
  SOLD_OUT: 'Sold Out',
};

export const variantSchema = z.object({
  size: z.string().trim().min(1, 'Give the size a name.').max(60),
  stock: z.number().int().min(0, 'Stock cannot be negative.').max(100000),
});

export const productSchema = z.object({
  /** Absent when creating, present when editing. */
  id: z.string().trim().min(1).optional(),

  title: z.string().trim().min(2, 'Give the product a name.').max(200),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  categoryId: z.string().trim().min(1, 'Choose a category.'),
  color: z.string().trim().min(1, 'Give the product a colour.').max(60),

  /** Held in cents so the money never touches a float. */
  priceCadCents: z.number().int().min(1, 'Enter a price.').max(100_000_00),

  productionDays: z.string().trim().max(40).optional().or(z.literal('')),

  tag: z.enum(PRODUCT_TAGS).nullable(),
  status: z.enum(PRODUCT_STATUSES),

  metaTitle: z.string().trim().max(200).optional().or(z.literal('')),
  metaDescription: z.string().trim().max(400).optional().or(z.literal('')),

  imageUrls: z.array(z.string().trim().url('That is not a valid image URL.')).max(8),

  variants: z
    .array(variantSchema)
    .min(1, 'A product needs at least one size.')
    .max(30)
    .refine(
      list => new Set(list.map(v => v.size.toLowerCase())).size === list.length,
      'Two variants have the same size.',
    ),
});

export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
