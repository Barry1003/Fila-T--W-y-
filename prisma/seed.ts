import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../src/generated/prisma/index.js';
import { ALL_PRODUCTS, COLLECTIONS } from '../src/data/products.js';
import {
  BANNERS, CONVERSATIONS, CUSTOMERS, CUSTOM_REQUESTS, DISCOUNT_CODES,
  ORDERS, OWNER, OWNER_ADDRESSES, OWNER_CARDS, PRODUCT_ALIASES, REVIEWS, WISHLIST_TITLES,
} from './seed-data.js';

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// The Neon driver is built for the pooled endpoint, so this uses DATABASE_URL
// rather than the direct URL that Prisma Migrate needs.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set — see .env.example.');

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

/**
 * Neon resolves to a rotating pool of addresses and its compute sleeps when
 * idle, so the first connection of a run can fail even when the database is
 * healthy. Retry the whole seed rather than leaving it half-written.
 */
const RETRYABLE = new Set(['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE']);

/**
 * The Neon driver surfaces a dropped WebSocket as a DOM ErrorEvent, which
 * carries no `code` — so match on shape as well as on error codes.
 */
function isRetryable(error: unknown): boolean {
  const code = (error as { code?: string }).code;
  if (code && RETRYABLE.has(code)) return true;
  return (error as { type?: string })?.type === 'error';
}

async function withRetries<T>(label: string, fn: () => Promise<T>, attempts = 10): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (error) {
      const code = (error as { code?: string }).code ?? 'socket error';
      if (!isRetryable(error) || i >= attempts) throw error;
      const wait = Math.min(2 ** i * 400, 8000);
      console.warn(`  ${label}: ${code} (attempt ${i}/${attempts}) — retrying in ${wait}ms`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Slug that survives the diacritics in names like "Ọjọ Ipele" and "Filà". */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const date = (iso: string) => new Date(`${iso}T12:00:00Z`);
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const imageUrl = (id: string) => `https://images.unsplash.com/${id}?w=900&h=1200&fit=crop&auto=format`;

// ── Reset ────────────────────────────────────────────────────────────────────

/**
 * Delete children before parents. Most relations cascade, but doing this
 * explicitly keeps the order obvious and the seed re-runnable.
 */
async function reset() {
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.customRequestImage.deleteMany();
  await prisma.customRequest.deleteMany();
  await prisma.reviewPhoto.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  // Children first: the self-relation is SetNull, but ordering keeps it clean.
  await prisma.category.deleteMany({ where: { NOT: { parentId: null } } });
  await prisma.category.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.banner.deleteMany();
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.SEED_ALLOW_PRODUCTION !== 'yes') {
    throw new Error('Refusing to seed with NODE_ENV=production. Set SEED_ALLOW_PRODUCTION=yes to override.');
  }

  // Neon suspends idle computes and drops the connection that wakes them, so
  // spend the first failure here rather than partway through the seed.
  await withRetries('warm-up', () => prisma.$queryRaw`select 1`, 8);

  console.log('Clearing existing rows…');
  await withRetries('reset', () => reset());

  // Collections, then the categories that hang off them.
  const categories = new Map<string, string>();
  let collectionCount = 0;

  for (const [i, collection] of COLLECTIONS.entries()) {
    const parent = await prisma.category.create({
      data: {
        name: collection.name,
        slug: collection.slug,
        tagline: collection.tagline,
        blurb: collection.blurb,
        position: i,
      },
    });
    categories.set(collection.name, parent.id);
    collectionCount++;

    for (const [j, name] of collection.categories.entries()) {
      const child = await prisma.category.create({
        data: { name, slug: slugify(name), position: j, parentId: parent.id },
      });
      categories.set(name, child.id);
    }
  }
  console.log(`  collections     ${collectionCount}`);
  console.log(`  categories      ${categories.size - collectionCount}`);

  // Products, with one image and one variant per size
  const productsByTitle = new Map<string, string>();
  for (const p of ALL_PRODUCTS) {
    const row = await prisma.product.create({
      data: {
        slug: slugify(p.title),
        title: p.title,
        categoryId: categories.get(p.category)!,
        tag: p.tag === 'SOLD OUT' ? 'SOLD_OUT' : p.tag === 'MADE TO ORDER' ? 'MADE_TO_ORDER' : 'NEW',
        color: p.color,
        inStock: p.inStock,
        priceCad: p.cadNum,
        priceNgn: p.ngnNum,
        images: { create: [{ url: imageUrl(p.img), alt: p.title, position: 0 }] },
        variants: {
          create: p.sizes.map(size => ({
            size,
            sku: `${slugify(p.title).slice(0, 24)}-${slugify(size)}`,
            stock: p.inStock ? 12 : 0,
          })),
        },
      },
    });
    productsByTitle.set(p.title, row.id);
  }
  console.log(`  products        ${productsByTitle.size}`);

  // Owner and customers
  const owner = await prisma.user.create({
    data: {
      email: OWNER.email, name: OWNER.name, phone: OWNER.phone,
      location: OWNER.location, role: 'OWNER',
      addresses: { create: OWNER_ADDRESSES },
      paymentMethods: { create: OWNER_CARDS },
    },
  });

  const usersByEmail = new Map<string, string>([[owner.email, owner.id]]);
  for (const c of CUSTOMERS) {
    const row = await prisma.user.create({ data: { ...c, role: 'CUSTOMER' } });
    usersByEmail.set(c.email, row.id);
  }
  console.log(`  users           ${usersByEmail.size} (1 owner)`);

  // Wishlist for the owner's own account
  for (const title of WISHLIST_TITLES) {
    const productId = productsByTitle.get(title);
    if (productId) await prisma.wishlistItem.create({ data: { userId: owner.id, productId } });
  }
  console.log(`  wishlist        ${WISHLIST_TITLES.length}`);

  // Promotions
  const codesByCode = new Map<string, string>();
  for (const c of DISCOUNT_CODES) {
    const row = await prisma.discountCode.create({
      data: {
        code: c.code, type: c.type, value: c.value,
        usedCount: c.usedCount, usageLimit: c.usageLimit,
        active: c.active, expiresAt: date(c.expiresAt),
      },
    });
    codesByCode.set(c.code, row.id);
  }
  for (const b of BANNERS) {
    await prisma.banner.create({
      data: {
        text: b.text,
        subtext: b.subtext,
        badge: b.badge,
        ctaLabel: b.ctaLabel,
        status: b.status,
        position: b.position,
        productId: productsByTitle.get(b.productTitle) ?? null,
        // No ctaHref: when a banner has a product, the view links to it via the
        // relation. ctaHref is for promotions that point somewhere else.
        ctaHref: null,
        startsAt: date(b.startsAt),
        endsAt: date(b.endsAt),
      },
    });
  }
  console.log(`  discount codes  ${codesByCode.size}`);
  console.log(`  banners         ${BANNERS.length}`);

  // Orders
  const ordersByNumber = new Map<string, string>();
  for (const o of ORDERS) {
    const customer = CUSTOMERS.find(c => c.email === o.email)!;
    const subtotal = o.items.reduce((sum, i) => sum + i.unit * i.qty, 0);
    const total = subtotal + o.shipping - o.discount;

    const row = await prisma.order.create({
      data: {
        number: o.number,
        userId: usersByEmail.get(o.email) ?? null,
        customerName: customer.name,
        customerEmail: o.email,
        customerPhone: customer.phone,
        shippingLine1: o.address.line1,
        shippingCity: o.address.city,
        shippingState: o.address.state ?? null,
        shippingPostal: o.address.postal,
        shippingCountry: o.address.country,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod ?? null,
        carrier: o.carrier ?? null,
        trackingNumber: o.tracking ?? null,
        subtotal, shipping: o.shipping, discount: o.discount, total,
        totalNgn: o.totalNgn,
        placedAt: date(o.date),
        items: {
          create: o.items.map(i => ({
            productId: productsByTitle.get(PRODUCT_ALIASES[i.name] ?? i.name) ?? null,
            name: i.name, variant: i.variant, quantity: i.qty, unitPrice: i.unit,
          })),
        },
      },
    });
    ordersByNumber.set(o.number, row.id);
  }
  console.log(`  orders          ${ordersByNumber.size} (${ORDERS.reduce((n, o) => n + o.items.length, 0)} items)`);

  // Reviews
  let reviewCount = 0;
  for (const r of REVIEWS) {
    const productId = productsByTitle.get(r.product);
    if (!productId) {
      console.warn(`  ! review skipped — no product titled "${r.product}"`);
      continue;
    }
    const customer = CUSTOMERS.find(c => c.email === r.email)!;
    await prisma.review.create({
      data: {
        productId,
        userId: usersByEmail.get(r.email) ?? null,
        authorName: customer.name,
        authorLocation: customer.location,
        rating: r.rating,
        body: r.body,
        reply: r.reply,
        repliedAt: r.repliedAt ? date(r.repliedAt) : null,
        flagged: r.flagged,
        createdAt: date(r.date),
        photos: { create: r.photos.map(url => ({ url })) },
      },
    });
    reviewCount++;
  }
  console.log(`  reviews         ${reviewCount}`);

  // Custom requests
  for (const q of CUSTOM_REQUESTS) {
    const customer = CUSTOMERS.find(c => c.email === q.email)!;
    await prisma.customRequest.create({
      data: {
        reference: q.reference,
        userId: usersByEmail.get(q.email) ?? null,
        customerName: customer.name,
        customerEmail: q.email,
        customerPhone: customer.phone,
        customerLocation: customer.location,
        garmentType: q.garmentType,
        status: q.status,
        occasion: q.occasion,
        neededBy: date(q.neededBy),
        fabricPreference: q.fabricPreference,
        colorPreference: q.colorPreference,
        notes: q.notes,
        quotedPrice: q.quotedPrice,
        estimatedCompletion: q.estimatedCompletion ? date(q.estimatedCompletion) : null,
        declineReason: q.declineReason,
        submittedAt: date(q.submittedAt),
        measurements: {
          create: q.measurements.map(([label, value], i) => ({ label, value, position: i })),
        },
      },
    });
  }
  console.log(`  custom requests ${CUSTOM_REQUESTS.length}`);

  // Support inbox
  let messageCount = 0;
  for (const c of CONVERSATIONS) {
    const customer = CUSTOMERS.find(x => x.email === c.email)!;
    const started = daysAgo(c.daysAgo);
    await prisma.conversation.create({
      data: {
        userId: usersByEmail.get(c.email) ?? null,
        orderId: c.orderNumber ? ordersByNumber.get(c.orderNumber) ?? null : null,
        customerName: customer.name,
        customerEmail: c.email,
        subject: c.subject,
        tag: c.tag,
        unread: c.unread,
        resolved: c.resolved,
        createdAt: started,
        messages: {
          create: c.messages.map(([sender, body], i) => ({
            sender,
            body,
            // Space replies about half an hour apart within the thread.
            sentAt: new Date(started.getTime() + i * 30 * 60_000),
          })),
        },
      },
    });
    messageCount += c.messages.length;
  }
  console.log(`  conversations   ${CONVERSATIONS.length} (${messageCount} messages)`);
}

main()
  .then(() => console.log('\nSeed complete.'))
  .catch(e => {
    console.error('\nSeed failed:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
