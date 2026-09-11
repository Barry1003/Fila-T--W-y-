import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import { withDbRetry } from './src/server/db';

async function run() {
  try {
    console.log('Running manual migration via Prisma HTTP driver...');

    await withDbRetry('drop color', () => 
      prisma.$executeRawUnsafe(`ALTER TABLE "Product" DROP COLUMN IF EXISTS "color";`)
    );
    console.log('- Dropped color from Product');

    try {
        await withDbRetry('add color', () => 
          prisma.$executeRawUnsafe(`ALTER TABLE "ProductVariant" ADD COLUMN "color" TEXT NOT NULL DEFAULT '';`)
        );
        console.log('- Added color to ProductVariant');
    } catch (e: any) {
        if (String(e).includes('42701') || String(e).includes('already exists')) {
            console.log('- color already exists on ProductVariant');
        } else {
            throw e;
        }
    }

    await withDbRetry('drop constraint', () => 
      prisma.$executeRawUnsafe(`ALTER TABLE "ProductVariant" DROP CONSTRAINT IF EXISTS "ProductVariant_productId_size_key";`)
    );
    await withDbRetry('drop index', () => 
      prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "ProductVariant_productId_size_key";`)
    );
    console.log('- Dropped old unique index');

    await withDbRetry('add index', () => 
      prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_productId_size_color_key" ON "ProductVariant"("productId", "size", "color");`)
    );
    console.log('- Created new unique index [productId, size, color]');

    console.log('Migration successful!');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}

run();
