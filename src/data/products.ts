export type Tag = 'NEW' | 'SOLD OUT' | 'MADE TO ORDER';

export interface Product {
  id: number;
  category: string;
  tag: Tag;
  title: string;
  cadNum: number;
  ngnNum: number;
  img: string;
  color: string;
  sizes: string[];
  inStock: boolean;
}

export const ALL_PRODUCTS: Product[] = [
  { id:  1, category: 'Fila Gobi',         tag: 'NEW',           title: 'Gobi Filà Cap — Burgundy Velvet',    cadNum:  89, ngnNum:  44200, img: 'photo-1763823133159-c6f8ec380e33', color: 'Burgundy', sizes: ['S','M','L','XL'],             inStock: true  },
  { id:  2, category: 'Abetiaja',         tag: 'NEW',           title: 'Classic Abetiaja — Cream Brocade',   cadNum:  95, ngnNum:  47150, img: 'photo-1647379380116-4af77a8632b0', color: 'Cream',    sizes: ['S','M','L'],                  inStock: true  },
  { id:  3, category: 'Fila Gobi',         tag: 'MADE TO ORDER', title: 'Fìla Gòbì — Navy Aso-oke',          cadNum: 110, ngnNum:  54650, img: 'photo-1665646155658-bdcd66e854db', color: 'Navy',     sizes: ['S','M','L','XL'],             inStock: true  },
  { id:  4, category: 'Gele',         tag: 'MADE TO ORDER', title: 'Aso-oke Gele — Ivory & Gold Set',   cadNum: 145, ngnNum:  71900, img: 'photo-1714124731489-7eb16af0ac91', color: 'Gold',     sizes: ['One Size'],                   inStock: true  },
  { id:  5, category: 'Gele',         tag: 'NEW',           title: 'Damask Gele — Teal & Coral',        cadNum: 120, ngnNum:  59600, img: 'photo-1655215081879-0ac1f535b575', color: 'Teal',     sizes: ['One Size'],                   inStock: true  },
  { id:  6, category: 'Ipele',        tag: 'NEW',           title: 'Ọjọ Ipele — Crimson Drape',         cadNum:  78, ngnNum:  38750, img: 'photo-1760086626077-55da1cb1ecb3', color: 'Crimson',  sizes: ['One Size'],                   inStock: true  },
  { id:  7, category: 'Ipele',        tag: 'MADE TO ORDER', title: 'Adire Ipele — Indigo Tie-Dye',      cadNum:  92, ngnNum:  45700, img: 'photo-1542727284-f84ef8478587',   color: 'Indigo',   sizes: ['One Size'],                   inStock: true  },
  { id:  8, category: 'Kaftan',       tag: 'MADE TO ORDER', title: 'Embroidered Agbada Kaftan',         cadNum: 310, ngnNum: 153950, img: 'photo-1765910083971-aa0e3688be46', color: 'Gold',     sizes: ['S','M','L','XL','2XL'],       inStock: true  },
  { id:  9, category: 'Kaftan',       tag: 'NEW',           title: 'Aso-oke Senator Kaftan — Maroon',   cadNum: 245, ngnNum: 121750, img: 'photo-1661332306744-70f9ed1a7f40', color: 'Maroon',   sizes: ['S','M','L','XL'],             inStock: true  },
  { id: 10, category: 'Kaftan',       tag: 'NEW',           title: 'Adire Boubou — Cream & Indigo',     cadNum: 195, ngnNum:  96850, img: 'photo-1758539197604-146e8bbf19dc', color: 'Cream',    sizes: ['M','L','XL'],                 inStock: true  },
  { id: 11, category: 'Trousers',     tag: 'NEW',           title: 'Tailored Yoruba Trouser Set',       cadNum: 195, ngnNum:  96850, img: 'photo-1661332360810-28aa035f14db', color: 'Charcoal', sizes: ['28','30','32','34','36'],      inStock: true  },
  { id: 12, category: 'Roundneck',    tag: 'SOLD OUT',      title: 'Adire Roundneck — Indigo',          cadNum: 125, ngnNum:  62000, img: 'photo-1632948056627-41482f69c38c', color: 'Indigo',   sizes: ['S','M','L','XL'],             inStock: false },
  { id: 13, category: 'Roundneck',    tag: 'NEW',           title: 'Batik Roundneck — Rust & Cream',    cadNum: 110, ngnNum:  54650, img: 'photo-1666974931330-9b5bcc541347', color: 'Rust',     sizes: ['S','M','L','XL','2XL'],       inStock: true  },
  { id: 14, category: 'Shoes',        tag: 'NEW',           title: 'Embossed Leather Oxford — Maroon',  cadNum: 220, ngnNum: 109300, img: 'photo-1646133512747-babfd708d662', color: 'Maroon',   sizes: ['40','41','42','43','44','45'], inStock: true  },
  { id: 15, category: 'Pam Slippers', tag: 'NEW',           title: 'Hand-tooled Pam Slippers — Tan',   cadNum: 160, ngnNum:  79500, img: 'photo-1542727284-f84ef8478587',   color: 'Tan',      sizes: ['38','39','40','41','42','43'], inStock: true  },
  { id: 16, category: 'Accessories',  tag: 'MADE TO ORDER', title: 'Adire Prayer Mat — Heritage Weave',cadNum:  55, ngnNum:  27300, img: 'photo-1664151100165-71ed5515adad', color: 'Multi',    sizes: ['One Size'],                   inStock: true  },
  { id: 17, category: 'Accessories',  tag: 'NEW',           title: 'Beaded Yoruba Bracelet Set',        cadNum:  38, ngnNum:  18900, img: 'photo-1585353804485-d6dbf13142b2', color: 'Multi',    sizes: ['One Size'],                   inStock: true  },
  { id: 18, category: 'Accessories',  tag: 'NEW',           title: 'Adire Clutch Bag — Blue & White',   cadNum:  72, ngnNum:  35750, img: 'photo-1666974931330-9b5bcc541347', color: 'Blue',     sizes: ['One Size'],                   inStock: true  },
];

/**
 * Categories hang off a collection, which is what shoppers browse by. Filà tó
 * Wüyí is the cap line, Pre-Order covers made-to-order tailoring and
 * accessories, and Gele & Ipele covers the women's pieces.
 *
 * Some categories are deliberately empty — the shop stocks no Shisha or Senator
 * caps yet, but they are part of the line and the console can fill them.
 */
export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  categories: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'fila-to-wuyi',
    name: 'Filà tó Wüyí',
    tagline: 'The cap line',
    blurb: 'Hand-blocked Yoruba caps in Aso-oke, velvet and brocade — shaped on wooden blocks the way Nigerian cap-makers have done for two centuries.',
    categories: ['Fila Gobi', 'Abetiaja', 'Shisha', 'Fila Senator'],
  },
  {
    slug: 'gele-ipele',
    name: 'Gele & Ipele',
    tagline: 'Headwraps and shoulder drapes',
    blurb: 'Starched Gele that holds its shape through a whole ceremony, and Ipele drapes woven to fall the way you want them to.',
    categories: ['Gele', 'Ipele'],
  },
  {
    slug: 'pre-order',
    name: 'Pre-Order',
    tagline: 'Made to order',
    blurb: 'Kaftans, slippers, roundnecks and shoes cut to your measurements. Allow five to seven working days before dispatch.',
    categories: ['Kaftan', 'Pam Slippers', 'Roundneck', 'Shoes', 'Trousers', 'Accessories'],
  },
];

export const ALL_CATEGORIES = COLLECTIONS.flatMap(c => c.categories);

/** The collection a category belongs to, or undefined if it is unfiled. */
export function collectionOf(category: string): Collection | undefined {
  return COLLECTIONS.find(c => c.categories.includes(category));
}

export const ALL_COLORS = ['Burgundy', 'Cream', 'Gold', 'Teal', 'Crimson', 'Indigo', 'Maroon', 'Charcoal', 'Rust', 'Tan', 'Multi', 'Blue', 'Navy'];

export const COLOR_HEX: Record<string, string> = {
  Burgundy: '#7A2E38', Cream: '#FAF6F0',  Gold: '#D4A94E',
  Teal:     '#3B8A93', Crimson: '#C0392B', Indigo: '#2E4A9E',
  Maroon:   '#7A2E38', Charcoal: '#2B2320', Rust: '#C0622B',
  Tan:      '#C4A882', Multi: 'conic-gradient(#7A2E38,#D4A94E,#2E4A9E,#3B8A93,#7A2E38)',
  Blue:     '#2C5F8A', Navy: '#1A2E5C',
};
