import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { getProductBySlug } from '@/server/catalogue';

/**
 * The share card other apps show when a product link is pasted (WhatsApp,
 * iMessage, Telegram, X, Facebook, Slack…): the product photo on the left, and
 * a cream panel with the title, price and a gold "Shop Now" pill on the right.
 *
 * Served from an explicit `.jpg` path (not Next's hashed opengraph-image URL)
 * with no query string, because WhatsApp's on-device fetcher is fussy about
 * image URLs that don't look like a file. Node runtime — the catalogue read
 * goes through Prisma, and sharp is native.
 */

const WIDTH = 1200;
const HEIGHT = 630;
const MAROON = '#7A2E38';
const GOLD = '#D4A94E';
const CREAM = '#FAF6F0';
const CHARCOAL = '#2B2320';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // A database failure must not 500 the image: a broken og:image shows NO
  // preview at all, worse than a text card. Fall back to a photoless card and
  // log, so an outage is visible rather than silently serving a generic card.
  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error('[og] product lookup failed for', slug, error);
  }

  const title = product?.title ?? 'AdeClassics';
  const price = product ? `CAD $${product.priceCad.toLocaleString()}` : 'Timeless Elegance';
  // Only embed http(s) images — a relative or data URL would make satori throw.
  const image = product?.imageUrl && /^https?:\/\//.test(product.imageUrl) ? product.imageUrl : undefined;
  const category = product?.category ?? 'Handcrafted in Nigeria';

  // Scale the title down as it lengthens so it never overruns the 630px canvas
  // and pushes the price and pill off the bottom.
  const titleSize = title.length > 44 ? 34 : title.length > 30 ? 42 : title.length > 20 ? 50 : 56;

  function card(withPhoto: boolean) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: CREAM }}>
        {/* Product photo (or a maroon panel when unavailable) */}
        <div style={{ display: 'flex', width: 600, height: 630, backgroundColor: MAROON }}>
          {withPhoto && image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" width={600} height={630} style={{ width: 600, height: 630, objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: GOLD, fontSize: 40 }}>
              AdeClassics
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', width: 600, height: 630, padding: '60px 56px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: MAROON, letterSpacing: -0.5 }}>AdeClassics</div>
            <div style={{ display: 'flex', fontSize: 16, color: GOLD, letterSpacing: 5, marginTop: 4 }}>{category.toUpperCase()}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 700, color: CHARCOAL, lineHeight: 1.08 }}>{title}</div>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: MAROON, marginTop: 24 }}>{price}</div>
          </div>

          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: GOLD, color: CHARCOAL, fontSize: 26, fontWeight: 700, letterSpacing: 2, padding: '20px 44px', borderRadius: 10 }}>
              SHOP NOW →
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Satori fetches the photo at render time; if that fetch fails (rate limit,
  // timeout, gone) fall back to the photoless card rather than returning a 500.
  let png: ArrayBuffer;
  try {
    png = await new ImageResponse(card(true), { width: WIDTH, height: HEIGHT }).arrayBuffer();
  } catch (error) {
    console.error('[og] image render failed for', slug, error);
    png = await new ImageResponse(card(false), { width: WIDTH, height: HEIGHT }).arrayBuffer();
  }

  // Re-encode to JPEG: the photographic card is ~800 KB as PNG, over WhatsApp's
  // ~600 KB preview ceiling; JPEG lands near ~110 KB.
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
