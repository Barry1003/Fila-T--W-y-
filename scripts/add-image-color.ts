import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { withDbRetry } from '../src/server/db';

/**
 * Adds ProductImage.color over the Neon HTTPS driver.
 *
 * `prisma migrate` needs the direct 5432 connection, which some networks block;
 * this reaches the same database over 443 the way the app does. The column is
 * nullable and additive — "IF NOT EXISTS" makes a second run a no-op — so it is
 * safe to run against a live database and matches migration
 * 20260911120000_product_image_color.
 */
async function run() {
  try {
    await withDbRetry('add ProductImage.color', () =>
      prisma.$executeRawUnsafe(`ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "color" TEXT;`),
    );
    console.log('✔ ProductImage.color is present.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  }
}

run();
