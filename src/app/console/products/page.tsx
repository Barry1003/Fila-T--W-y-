import ConsoleProducts from '@/views/console/ConsoleProducts';
import { listCollections, listProductsForConsole } from '@/server/catalogue';

// Always live: the owner must see an edit the moment it saves.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const products = await listProductsForConsole();
  const collections = await listCollections();
  const categories = collections.flatMap(c => c.categories);

  return <ConsoleProducts products={products} categories={categories} />;
}
