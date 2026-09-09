import { notFound } from 'next/navigation';
import ConsoleProductForm from '@/views/console/ConsoleProductForm';
import { getProductForEdit, listCategoryOptions, listKnownColors } from '@/server/catalogue';

// The console edits live values, never a cached snapshot.
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await getProductForEdit(id);
  if (!product) notFound();

  const categories = await listCategoryOptions();
  const knownColors = await listKnownColors();

  return <ConsoleProductForm product={product} categories={categories} knownColors={knownColors} />;
}
