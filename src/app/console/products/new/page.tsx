import ConsoleProductForm from '@/views/console/ConsoleProductForm';
import { listCategoryOptions, listKnownColors } from '@/server/catalogue';

// Always open on the live category list — a category added since the last
// build must be selectable.
export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  // Sequential, not Promise.all: Neon opens a socket per query and firing
  // several at a sleeping compute makes a cold start fail.
  const categories = await listCategoryOptions();
  const knownColors = await listKnownColors();

  return <ConsoleProductForm product={null} categories={categories} knownColors={knownColors} />;
}
