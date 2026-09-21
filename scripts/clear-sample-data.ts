import 'dotenv/config';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../src/generated/prisma/index.js';

/**
 * One-off: reset the store to a clean slate — keep only the catalogue
 * (products, categories, images, variants) and the OWNER account. Everything
 * seeded as sample activity is removed: orders, custom requests, reviews,
 * conversations, wishlist items, saved addresses, saved cards, discount codes,
 * banners, and the sample CUSTOMER accounts.
 *
 * Run: pnpm tsx scripts/clear-sample-data.ts
 */

if (typeof globalThis.WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set — see .env.example.');

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });

async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 8): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= attempts) throw err;
      console.warn(`  ${label} failed (${i}/${attempts}), retrying…`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function main() {
  // Order matters only loosely (most relations SET NULL or CASCADE); deleting
  // child rows before the customer accounts keeps it tidy.
  const deleted = {
    orders: (await withRetry('orders', () => prisma.order.deleteMany({}))).count,
    customRequests: (await withRetry('customRequests', () => prisma.customRequest.deleteMany({}))).count,
    reviews: (await withRetry('reviews', () => prisma.review.deleteMany({}))).count,
    conversations: (await withRetry('conversations', () => prisma.conversation.deleteMany({}))).count,
    wishlistItems: (await withRetry('wishlist', () => prisma.wishlistItem.deleteMany({}))).count,
    paymentMethods: (await withRetry('cards', () => prisma.paymentMethod.deleteMany({}))).count,
    addresses: (await withRetry('addresses', () => prisma.address.deleteMany({}))).count,
    discountCodes: (await withRetry('discountCodes', () => prisma.discountCode.deleteMany({}))).count,
    banners: (await withRetry('banners', () => prisma.banner.deleteMany({}))).count,
    // Keep the owner; remove only sample customers.
    customers: (await withRetry('customers', () => prisma.user.deleteMany({ where: { role: 'CUSTOMER' } }))).count,
  };
  console.log('Deleted:', deleted);

  const kept = {
    products: await withRetry('count products', () => prisma.product.count()),
    categories: await withRetry('count categories', () => prisma.category.count()),
    owners: await withRetry('count owners', () => prisma.user.count({ where: { role: 'OWNER' } })),
  };
  console.log('Kept:', kept);
  console.log('Done — clean slate: catalogue + owner account only.');
}

main()
  .catch(e => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
