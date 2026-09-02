import { z } from 'zod';

/**
 * The shape of each page's editable content, plus the defaults the site falls
 * back to. Defaults live here rather than in the database so a fresh install,
 * a missing row or a row that fails validation all still render a complete
 * page — the console edits copy, it does not own whether the page works.
 *
 * Adding a field means extending the schema and the console form. No migration:
 * PageContent.content is a JSON column.
 */

export const homeContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().max(120),
    headline: z.string().max(200),
    ctaLabel: z.string().max(40),
    ctaHref: z.string().max(200),
    imageUrl: z.string().url(),
  }),
  story: z.object({
    heading: z.string().max(200),
    /** Prose: paragraphs are split on blank lines when rendered. */
    body: z.string().max(4000),
    imageUrl: z.string().url(),
  }),
  promo: z.object({
    enabled: z.boolean(),
    text: z.string().max(240),
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    eyebrow: 'Worldwide delivery available',
    headline: 'One Brand.\nEndless Style.\nTimeless Elegance.',
    ctaLabel: 'Shop the collection',
    ctaHref: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1784815840581-ecea314d9e7a?w=1800&h=1100&fit=crop&auto=format',
  },
  story: {
    heading: 'Yoruba craft, made for the world.',
    body:
      'AdeClassics was born from a simple conviction: the artistry woven into every Yoruba filà, gele, and kaftan deserves a stage as global as the culture it carries. We are an international e-commerce store bringing premium Yoruba traditional wear — handcrafted in Nigeria — to customers in Canada, the UK, the US, and beyond.\n\n' +
      'Every piece is handpicked by our team and every purchase is escrow-protected. When you buy here, you are not shopping for a product — you are participating in the preservation of a living tradition.',
    imageUrl: 'https://images.unsplash.com/photo-1661332306744-70f9ed1a7f40?w=900&h=1100&fit=crop&auto=format',
  },
  promo: {
    enabled: false,
    text: '',
  },
};

/** Every page the console can edit, with its schema and fallback. */
export const PAGE_SCHEMAS = {
  home: { schema: homeContentSchema, defaults: HOME_DEFAULTS },
} as const;

export type PageSlug = keyof typeof PAGE_SCHEMAS;
