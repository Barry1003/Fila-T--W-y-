import 'server-only';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';

/**
 * Renders the product share card — the 1200×630 "Shop Now" image other apps
 * unfurl — to a compressed JPEG buffer.
 *
 * One implementation, used three ways: the /og.jpg route (direct + self-heal),
 * the bake-on-save hook, and the backfill. JPEG because the photographic card
 * is ~800 KB as PNG, over WhatsApp's ~600 KB preview ceiling; this lands ~110 KB.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const MAROON = '#7A2E38';
const GOLD = '#D4A94E';
const CREAM = '#FAF6F0';
const CHARCOAL = '#2B2320';

export type OgCardData = {
  title: string;
  priceCad: number | null;
  category: string;
  imageUrl?: string | null;
};

function card(data: OgCardData, withPhoto: boolean) {
  const title = data.title || 'AdeClassics';
  const price = data.priceCad != null ? `CAD $${data.priceCad.toLocaleString()}` : 'Timeless Elegance';
  const category = data.category || 'Handcrafted in Nigeria';
  const image = data.imageUrl && /^https?:\/\//.test(data.imageUrl) ? data.imageUrl : undefined;
  // Scale the title down as it lengthens so it never overruns the canvas.
  const titleSize = title.length > 44 ? 34 : title.length > 30 ? 42 : title.length > 20 ? 50 : 56;

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: CREAM }}>
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

export async function renderOgCardJpeg(data: OgCardData): Promise<Buffer> {
  // Satori fetches the photo at render time; if that fails (rate limit, timeout,
  // gone) fall back to the photoless card rather than throwing.
  let png: ArrayBuffer;
  try {
    png = await new ImageResponse(card(data, true), { width: OG_WIDTH, height: OG_HEIGHT }).arrayBuffer();
  } catch (error) {
    console.error('[og] photo render failed:', error);
    png = await new ImageResponse(card(data, false), { width: OG_WIDTH, height: OG_HEIGHT }).arrayBuffer();
  }
  return sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}
