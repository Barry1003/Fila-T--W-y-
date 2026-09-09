'use client';

import { useState } from 'react';
import { C, DISPLAY, UI, label } from '../tokens';

type Category = 'All' | 'Style Guides' | 'Care Tips' | 'Events' | 'Our Craft';

type Article = {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  body: string[];
  pullQuote?: string;
};

const ARTICLES: Article[] = [
  {
    id: 'how-to-tie-a-gele',
    title: 'How to Tie a Gele: A Step-by-Step Guide for Every Occasion',
    category: 'Style Guides',
    excerpt: 'From a simple everyday wrap to a full ceremonial fan, master the art of Gele tying with our illustrated guide.',
    readTime: '7 min read',
    date: 'Aug 22, 2026',
    image: 'https://images.unsplash.com/photo-1770777353033-e32b07f31a6e?w=1400&h=700&fit=crop&auto=format',
    body: [
      "The Gele is more than a headwrap — it is a cultural statement, a mark of elegance, and for many Yoruba women, an essential part of celebrating life's most important moments. Tying one beautifully takes practice, but the results are worth every minute.",
      "Begin with a starched, crisp Gele fabric. The starch gives the fabric memory and structure, allowing it to hold its shape through an entire ceremony. AdeClassics Gele fabrics are pre-starched to the right firmness: pliable enough to mould but firm enough to fan.",
      "Step 1 — Fold the fabric lengthwise into a long band, roughly 8–10 inches wide. The exact width affects the final volume; a narrower fold creates a sleeker silhouette, while a wider fold builds drama appropriate for an owambe or naming ceremony.",
      "Step 2 — Place the centre of the band at the back of the head, above the nape. Bring both ends forward, cross them at the forehead, and take them back again. This first pass creates the anchor around which the rest of the style is built.",
      "Step 3 — With the longer end, begin pleating and fanning upward, tucking each pleat behind the base wrap. The fan shape is the signature of a traditional Gele — the more even the pleats, the more polished the result.",
      "Step 4 — Secure the fan with a small pin hidden inside the fold. The pin should be invisible from outside; if you can see it, tuck it further in. Adjust the tilt of the fan — slightly toward the back-right is the classic position.",
      "Practice on a wig head before a big event. Starched fabric has a learning curve, and the first five attempts will look nothing like the tenth. That is the way of it.",
    ],
    pullQuote: "The Gele is not an accessory. It is an announcement.",
  },
  {
    id: 'cap-care-guide',
    title: "Caring for Your Filà: A Cap That Lasts a Lifetime",
    category: 'Care Tips',
    excerpt: "Proper care keeps your Filà in peak condition for decades. Here's how to store, clean, and reshape your cap.",
    readTime: '4 min read',
    date: 'Aug 15, 2026',
    image: 'https://images.unsplash.com/photo-1783038312854-f84ae9a0cc2f?w=600&h=420&fit=crop&auto=format',
    body: [
      "A well-made Filà is built to last, but even the finest cap benefits from proper care. These guidelines apply to all our cap styles, from the traditional Fìlà Orísun to the structured Ìpèlé varieties.",
      "Storage — always store your cap on a rounded form or stuff it lightly with acid-free tissue to help it hold its shape. Avoid hanging it from a peg, which can stretch or distort the brim over time. A breathable cotton bag protects against dust without trapping moisture.",
      "Cleaning — spot clean with a damp cloth and mild soap only when necessary. Never submerge an embroidered or beaded cap in water. For heavily embellished pieces, have them professionally cleaned. The embroidery thread on our Fìlà Orísun line is colourfast but delicate.",
      "Reshaping — if your cap loses its form after wearing, place it on a rounded surface while it is still slightly warm from your body heat, and let it cool in the correct shape. Light steaming from a distance of 30cm can relax creases on plain Aso-Oke caps.",
    ],
    pullQuote: "A cap that is cared for tells a story of someone who values the craft.",
  },
  {
    id: 'styling-for-owambe',
    title: "Dressing for Owambe: The Complete Guide to Nigerian Party Attire",
    category: 'Events',
    excerpt: "Nigerian parties have a dress code of their own. Here's how to show up polished, cultural, and camera-ready.",
    readTime: '6 min read',
    date: 'Aug 8, 2026',
    image: 'https://images.unsplash.com/photo-1773858441914-2bb8b3a2d708?w=600&h=420&fit=crop&auto=format',
    body: [
      "Owambe is not just a party — it is a performance, a display of culture, and a celebration of community. Showing up well dressed is not vanity; it is respect for the host and the occasion.",
      "The aso-ebi (family uniform fabric) is usually specified on the invitation. If you have been given fabric, visit your tailor at least three weeks in advance. Rush tailoring rarely produces the silhouette you deserve.",
      "Coordinate your accessories thoughtfully. Your Gele, shoes, and bag should create a dialogue with each other — not necessarily identical, but harmonious. Gold accessories work with almost any aso-ebi shade. Silver tends to read as too casual for evening owambe.",
      "Men: the agbada ensemble remains the gold standard for owambe. A well-fitted agbada, matching trouser, and a quality Filà worn at the correct angle signals that you understand the occasion. Avoid over-embellishing — let the fabric do the talking.",
    ],
    pullQuote: undefined,
  },
  {
    id: 'aso-oke-weave',
    title: "Inside the Loom: How Aso-Oke Is Woven",
    category: 'Our Craft',
    excerpt: "Centuries of technique, encoded in every thread. A visit to the weavers behind our Aso-Oke collection.",
    readTime: '8 min read',
    date: 'Jul 30, 2026',
    image: 'https://images.unsplash.com/photo-1552710307-537199cd41c0?w=600&h=420&fit=crop&auto=format',
    body: [
      "The narrow-strip loom is a simple machine. Two heddles, a shuttle, and centuries of accumulated knowledge. What comes off it — after hours of rhythmic, precise work — is anything but simple.",
      "Aso-Oke is woven in strips typically four inches wide, then sewn together into the finished cloth. The seams are precise enough to be nearly invisible when the fabric is worn properly. Getting the seams exactly right is a skill passed from master to apprentice over years of practice.",
      "Our Aso-Oke is sourced from weavers in Iseyin, Oyo State — one of the historic centres of Yoruba weaving. We visit the workshops twice a year to select fabric in person. The colourway and density of the weave determine which garment each piece will become.",
    ],
    pullQuote: "The loom does not lie. Every thread is exactly where the weaver placed it.",
  },
  {
    id: 'styling-ipele',
    title: "Five Ways to Style the Ìpèlé",
    category: 'Style Guides',
    excerpt: "The shoulder sash is the most versatile piece in your wardrobe. These five looks prove it.",
    readTime: '5 min read',
    date: 'Jul 20, 2026',
    image: 'https://images.unsplash.com/photo-1590670796065-5c2469672e18?w=600&h=420&fit=crop&auto=format',
    body: [
      "The Ìpèlé — the shoulder sash worn across the chest or shoulder — is one of the most underutilised pieces in a traditional wardrobe. Most women wear it one way: draped over the left shoulder and tied at the right hip. That is the classic. But the Ìpèlé has more range than that.",
      "Look 1: The full drape. Allow the sash to fall in its natural length, secured at the shoulder with a brooch or kola nut pin. Elegant for seated events, where the full length is visible.",
      "Look 2: The wrap belt. Fold the Ìpèlé lengthwise into a wide belt and wrap it twice at the waist. This defines the silhouette of a buba and iro ensemble and adds a sculptural element to the middle section.",
    ],
    pullQuote: undefined,
  },
  {
    id: 'fabric-guide',
    title: "Your Guide to Authentic Nigerian Fabrics",
    category: 'Our Craft',
    excerpt: "Aso-Oke, Adire, George, Ankara — what sets each fabric apart, and how to choose the right one.",
    readTime: '5 min read',
    date: 'Jul 12, 2026',
    image: 'https://images.unsplash.com/photo-1770777352506-c36821bf7da8?w=600&h=420&fit=crop&auto=format',
    body: [
      "Nigerian fashion draws from an extraordinarily rich textile tradition. Each fabric type carries its own history, technique, and appropriate context. Knowing which fabric to choose — and when — elevates any outfit from dressed to intentional.",
      "Aso-Oke is the hand-woven prestige cloth of the Yoruba, produced on narrow-strip looms and assembled into wider panels. It ranges from stiff and structured (ideal for caps and head accessories) to medium-weight (perfect for Gele and Ìpèlé). Its hallmark is the woven pattern — often geometric, always intentional.",
      "Adire is the Yoruba resist-dye fabric, typically indigo on white cotton. The patterns are made by tying, stitching, or painting cassava paste onto the cloth before dyeing. No two pieces are identical; the slight variations are a feature, not a flaw.",
      "George lace is the prestige fabric of the Niger Delta and increasingly worn across all of Southern Nigeria at formal events. It arrives in rich, embroidered panels and is typically paired with a contrast blouse in silk or cotton lace.",
    ],
    pullQuote: undefined,
  },
];

const CATEGORIES: Category[] = ['All', 'Style Guides', 'Care Tips', 'Events', 'Our Craft'];

const CAT_COLOR: Record<string, string> = {
  'Style Guides': C.teal,
  'Care Tips': C.indigo,
  'Events': C.maroon,
  'Our Craft': 'rgba(43,35,32,0.55)',
};

function CatTag({ cat }: { cat: string }) {
  return (
    <span style={{
      ...label,
      fontSize: '0.6rem',
      color: CAT_COLOR[cat] ?? C.teal,
      letterSpacing: '0.14em',
    }}>
      {cat}
    </span>
  );
}

function ArticleCard({ article, onSelect }: { article: Article; onSelect: (a: Article) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onSelect(article)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left p-0 cursor-pointer flex flex-col"
      style={{ background: 'none', border: 'none' }}
    >
      <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mb-4" style={{ backgroundColor: '#e8e0d8' }}>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />
      </div>
      <CatTag cat={article.category} />
      <h3
        className="mt-2 mx-0 mb-[0.4rem]"
        style={{
          fontFamily: DISPLAY,
          fontSize: '1.1rem',
          fontWeight: 500,
          color: C.charcoal,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          textDecorationLine: hovered ? 'underline' : 'none',
          textDecorationColor: C.gold,
        }}
      >
        {article.title}
      </h3>
      <p className="m-0 mb-3" style={{ fontFamily: UI, fontSize: '0.84rem', color: 'rgba(43,35,32,0.58)', lineHeight: 1.55 }}>
        {article.excerpt}
      </p>
      <span style={{ fontFamily: UI, fontSize: '0.72rem', color: 'rgba(43,35,32,0.38)' }}>
        {article.date} · {article.readTime}
      </span>
    </button>
  );
}

function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  return (
    <div>
      {/* Hero */}
      <div className="relative h-[520px] overflow-hidden" style={{ backgroundColor: '#2B2320' }}>
        <img
          src={article.image.replace('w=600&h=420', 'w=1400&h=600')}
          alt={article.title}
          className="w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        />
        <div
          className="absolute inset-0 flex flex-col justify-end py-12 px-10 max-w-[900px]"
          style={{ background: 'linear-gradient(to top, rgba(43,35,32,0.88) 0%, rgba(43,35,32,0.2) 60%, transparent 100%)' }}
        >
          <CatTag cat={article.category} />
          <h1 className="mt-3" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', fontWeight: 500, color: C.cream, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>
          <p className="mt-3" style={{ fontFamily: UI, fontSize: '0.82rem', color: 'rgba(250,246,240,0.55)' }}>
            {article.date} · {article.readTime}
          </p>
        </div>
      </div>

      {/* Breadcrumb + back */}
      <div className="max-w-[1440px] mx-auto pt-6 px-10">
        <nav className="flex items-center gap-2" style={{ fontFamily: UI, fontSize: '0.75rem', color: 'rgba(43,35,32,0.42)' }}>
          <button onClick={onBack} className="p-0 cursor-pointer flex items-center gap-[0.3rem]" style={{ background: 'none', border: 'none', color: 'rgba(43,35,32,0.42)', fontFamily: UI, fontSize: '0.75rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Lookbook
          </button>
          <span>/</span>
          <span style={{ color: C.charcoal }}>{article.category}</span>
        </nav>
      </div>

      {/* Body */}
      <div className="max-w-[760px] mx-auto pt-12 px-10 pb-20">
        <p className="mb-10" style={{ fontFamily: UI, fontSize: '1.1rem', color: 'rgba(43,35,32,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
          {article.excerpt}
        </p>

        {article.body.map((para, i) => (
          <div key={i}>
            {para.startsWith('Step') || para.startsWith('Look') || para.startsWith('Storage') || para.startsWith('Cleaning') || para.startsWith('Reshaping') ? (
              <div className="mb-6">
                <h3 className="mb-2" style={{ fontFamily: DISPLAY, fontSize: '1.1rem', fontWeight: 500, color: C.charcoal }}>
                  {para.split(' — ')[0]}
                </h3>
                <p style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.72)', lineHeight: 1.75 }}>
                  {para.includes(' — ') ? para.split(' — ').slice(1).join(' — ') : ''}
                </p>
              </div>
            ) : (
              <p className="mb-6" style={{ fontFamily: UI, fontSize: '0.95rem', color: 'rgba(43,35,32,0.72)', lineHeight: 1.75 }}>
                {para}
              </p>
            )}
            {article.pullQuote && i === 1 && (
              <blockquote
                className="pl-6 my-8"
                style={{
                  borderLeft: `4px solid ${C.gold}`,
                  fontFamily: DISPLAY,
                  fontSize: '1.3rem',
                  fontStyle: 'italic',
                  color: C.charcoal,
                  lineHeight: 1.4,
                }}
              >
                {article.pullQuote}
              </blockquote>
            )}
          </div>
        ))}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="pt-16 pb-20" style={{ borderTop: `1px solid rgba(43,35,32,0.09)`, backgroundColor: '#fff' }}>
          <div className="max-w-[1440px] mx-auto px-10">
            <div className="mb-8" style={{ ...label, fontSize: '0.65rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.16em' }}>
              Related Stories
            </div>
            <div className="article-grid grid grid-cols-3 gap-8">
              {related.map(a => (
                <ArticleCard key={a.id} article={a} onSelect={() => {}} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Lookbook() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showCount, setShowCount] = useState(6);

  const featured = ARTICLES[0];
  const filtered = (activeCategory === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory))
    .filter(a => a.id !== featured.id);
  const visible = filtered.slice(0, showCount);

  if (selectedArticle) {
    return (
      <div style={{ backgroundColor: C.cream }}>
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
        <style>{`
          @media (max-width: 900px) {
            .article-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pb-24" style={{ backgroundColor: C.cream }}>

      {/* Page header */}
      <div className="max-w-[1440px] mx-auto pt-16 px-10">
        <div className="mb-3" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em' }}>
          Stories & Style
        </div>
        <h1 className="mb-3" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Lookbook & Stories
        </h1>
        <p className="max-w-[520px] mb-12" style={{ fontFamily: UI, fontSize: '1rem', color: 'rgba(43,35,32,0.55)', lineHeight: 1.6 }}>
          Cultural styling guides, care rituals, event inspiration, and a closer look at the craft behind every piece.
        </p>

        {/* Featured article */}
        <div
          className="relative h-[520px] rounded-[12px] overflow-hidden mb-12 cursor-pointer"
          style={{ backgroundColor: '#2B2320' }}
          onClick={() => setSelectedArticle(featured)}
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.5s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div
            className="absolute inset-0 flex flex-col justify-end py-10 px-12"
            style={{ background: 'linear-gradient(to top, rgba(43,35,32,0.88) 0%, rgba(43,35,32,0.25) 55%, transparent 100%)' }}
          >
            <CatTag cat={featured.category} />
            <h2 className="max-w-[600px] my-3" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', fontWeight: 500, color: C.cream, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              {featured.title}
            </h2>
            <p className="max-w-[500px] mb-5" style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(250,246,240,0.72)', lineHeight: 1.55 }}>
              {featured.excerpt}
            </p>
            <button
              onClick={e => { e.stopPropagation(); setSelectedArticle(featured); }}
              className="inline-flex items-center gap-[0.4rem] py-[0.6rem] px-5 rounded-[4px] cursor-pointer self-start"
              style={{
                ...label,
                fontSize: '0.65rem',
                color: C.charcoal,
                backgroundColor: C.gold,
                border: 'none',
              }}
            >
              Read Story
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
          {/* Date + read time pill */}
          <div className="absolute top-6 right-6">
            <span className="rounded-[20px] py-[0.3rem] px-3" style={{ fontFamily: UI, fontSize: '0.7rem', color: 'rgba(250,246,240,0.65)', backgroundColor: 'rgba(43,35,32,0.4)', backdropFilter: 'blur(4px)' }}>
              {featured.date} · {featured.readTime}
            </span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowCount(6); }}
                className="py-[0.45rem] px-4 rounded-[20px] cursor-pointer"
                style={{
                  ...label,
                  fontSize: '0.64rem',
                  border: `1px solid ${active ? C.gold : 'rgba(43,35,32,0.18)'}`,
                  backgroundColor: active ? C.gold : 'transparent',
                  color: active ? C.charcoal : 'rgba(43,35,32,0.55)',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Article grid */}
        {visible.length > 0 ? (
          <div className="article-grid grid grid-cols-3 gap-y-10 gap-x-8 mb-12">
            {visible.map(article => (
              <ArticleCard key={article.id} article={article} onSelect={setSelectedArticle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" style={{ color: 'rgba(43,35,32,0.38)', fontFamily: UI, fontSize: '0.9rem' }}>
            No stories in this category yet.
          </div>
        )}

        {/* Load More */}
        {visible.length < filtered.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowCount(c => c + 6)}
              className="py-3 px-10 rounded-[4px] cursor-pointer"
              style={{
                ...label,
                fontSize: '0.65rem',
                border: `1px solid ${C.maroon}`,
                color: C.maroon,
                backgroundColor: 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.maroon; e.currentTarget.style.color = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.maroon; }}
            >
              Load More Stories
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .article-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .article-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
