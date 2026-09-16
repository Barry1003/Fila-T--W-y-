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
  const product = await getProductBySlug(slug).catch(() => null);

  const title = product?.title ?? 'AdeClassics';
  const price = product ? `CAD $${product.priceCad.toLocaleString()}` : 'Timeless Elegance';
  const image = product?.imageUrl;
  const category = product?.category ?? 'Handcrafted in Nigeria';

  const png = await new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: CREAM }}>
        {/* Product photo */}
        <div style={{ display: 'flex', width: 600, height: 630, backgroundColor: MAROON }}>
          {image ? (
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
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: MAROON, letterSpacing: -0.5 }}>AdeClassics</div>
            <div style={{ display: 'flex', fontSize: 16, color: GOLD, letterSpacing: 5, marginTop: 4 }}>{category.toUpperCase()}</div>
          </div>

          {/* Title + price */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: CHARCOAL, lineHeight: 1.08 }}>
              {title.length > 60 ? `${title.slice(0, 57)}…` : title}
            </div>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: MAROON, marginTop: 24 }}>{price}</div>
          </div>

          {/* Shop Now pill */}
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: GOLD, color: CHARCOAL, fontSize: 26, fontWeight: 700, letterSpacing: 2, padding: '20px 44px', borderRadius: 10 }}>
              SHOP NOW  →
            </div>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  ).arrayBuffer();

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
