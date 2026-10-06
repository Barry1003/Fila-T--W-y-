import { prisma } from '../src/lib/prisma';

async function check() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      images: {
        select: { url: true }
      }
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
