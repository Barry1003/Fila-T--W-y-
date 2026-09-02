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

/** One frame of the homepage hero carousel. */
export const heroSlideSchema = z.object({
  /** Stable across reorders, so React keys and edits stay attached. */
  id: z.string().min(1).max(40),
  eyebrow: z.string().max(120),
  headline: z.string().max(200),
  ctaLabel: z.string().max(40),
  ctaHref: z.string().max(200),
  imageUrl: z.string().url(),
});

export type HeroSlide = z.infer<typeof heroSlideSchema>;

export const homeContentSchema = z.object({
  hero: z.object({
    slides: z.array(heroSlideSchema).min(1).max(8),
    /** Seconds each slide holds before advancing. */
    intervalSeconds: z.number().int().min(3).max(30),
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
    intervalSeconds: 7,
    slides: [
      {
        id: 'brand',
        eyebrow: 'Worldwide delivery available',
        headline: 'One Brand.\nEndless Style.\nTimeless Elegance.',
        ctaLabel: 'Shop the collection',
        ctaHref: '/shop',
        imageUrl: 'https://images.unsplash.com/photo-1784815840581-ecea314d9e7a?w=1800&h=1100&fit=crop&auto=format',
      },
      {
        id: 'fila',
        eyebrow: 'The cap line',
        headline: 'Filà tó Wüyí.\nShaped by hand.',
        ctaLabel: 'Shop Filà',
        ctaHref: '/collections/fila-to-wuyi',
        imageUrl: 'https://images.unsplash.com/photo-1763823133159-c6f8ec380e33?w=1800&h=1100&fit=crop&auto=format',
      },
      {
        id: 'gele',
        eyebrow: 'Gele & Ipele',
        headline: 'Aso-oke that holds\nits shape all day.',
        ctaLabel: 'Shop Gele & Ipele',
        ctaHref: '/collections/gele-ipele',
        imageUrl: 'https://images.unsplash.com/photo-1714124731489-7eb16af0ac91?w=1800&h=1100&fit=crop&auto=format',
      },
    ],
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

const proseSectionSchema = z.object({
  eyebrow: z.string().max(80),
  heading: z.string().max(200),
  /** Paragraphs are split on blank lines when rendered. */
  body: z.string().max(4000),
  imageUrl: z.string().url(),
});

export const aboutContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().max(80),
    heading: z.string().max(240),
    imageUrl: z.string().url(),
  }),
  origin: proseSectionSchema,
  craft: proseSectionSchema,
  values: z
    .array(z.object({ title: z.string().max(80), body: z.string().max(600) }))
    .max(6),
  quote: z.object({
    text: z.string().max(600),
    attribution: z.string().max(120),
  }),
});

export type AboutContent = z.infer<typeof aboutContentSchema>;

export const ABOUT_DEFAULTS: AboutContent = {
  hero: {
    eyebrow: 'Our Story',
    heading: 'Bringing Yoruba craftsmanship to the world, one piece at a time',
    imageUrl: 'https://images.unsplash.com/photo-1665646155658-bdcd66e854db?w=1800&h=1000&fit=crop&auto=format',
  },
  origin: {
    eyebrow: 'Where We Began',
    heading: 'Born from a love of tradition and a gap in the market',
    body:
      'AdeClassics was founded by Adunola Okonkwo after years of searching for authentic Yoruba headwear outside Nigeria and finding nothing that met the standard her family had held for generations. Its cap line, Filà tó Wüyí — literally "the cap that suits you" in Yoruba — remains the house\'s signature.\n\n' +
      'What she found instead were imitations — machine-made caps in synthetic fabrics, sold without the knowledge of what they were meant to represent. So she went back to the source: the workshops of Iseyin, the weavers of Ondo, the embroiders of Lagos Island, and the master cap-makers of Ibadan.\n\n' +
      'The first collection was twelve pieces, handpicked, and sold through word of mouth. A decade later, AdeClassics ships to over forty countries and remains guided by the same principle: every piece must be something you would keep.',
    imageUrl: 'https://images.unsplash.com/photo-1647379380116-4af77a8632b0?w=900&h=1100&fit=crop&auto=format',
  },
  craft: {
    eyebrow: 'How We Work',
    heading: 'Craft takes time. We do not rush it.',
    body:
      'Every AdeClassics piece passes through multiple hands before it reaches you. The Aso-Oke is woven on narrow-strip looms by artisans who have spent decades mastering the geometry of the patterns. The Gele fabric is starched by hand, tested for stiffness, and cut to precise lengths.\n\n' +
      'Caps are shaped on wooden blocks — the same type of block Nigerian cap-makers have used for at least two hundred years. Embroidery is applied with needle and thread, never machine-stitched. Each completed piece is inspected by eye; we have no sensor more precise than a craftsperson who cares.\n\n' +
      'We visit every workshop we source from. We know the names of the people who make your orders.',
    imageUrl: 'https://images.unsplash.com/photo-1542727284-f84ef8478587?w=900&h=1100&fit=crop&auto=format',
  },
  values: [
    { title: 'Authentic Craft', body: 'Every piece is sourced from master craftspeople in West Africa, woven and shaped using techniques passed down through generations.' },
    { title: 'Made to Last', body: 'We source only the finest Aso-Oke, George lace, and Adire. An AdeClassics piece is meant to outlast the occasion — and be worn again.' },
    { title: 'Worn Worldwide', body: 'From Lagos to Toronto to London, we ship to over forty countries — because heritage should not stop at a border.' },
  ],
  quote: {
    text: 'I wanted to build a business where a grandmother in Ibadan and her grandchild in Toronto could both feel seen — where the craft is never watered down for the export market.',
    attribution: 'Adunola Okonkwo, Founder',
  },
};

/** Every page the console can edit, with its schema and fallback. */
export const PAGE_SCHEMAS = {
  home: { schema: homeContentSchema, defaults: HOME_DEFAULTS },
  about: { schema: aboutContentSchema, defaults: ABOUT_DEFAULTS },
} as const;

export type PageSlug = keyof typeof PAGE_SCHEMAS;
