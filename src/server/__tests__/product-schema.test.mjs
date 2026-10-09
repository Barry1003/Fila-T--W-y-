import { test } from 'node:test';
import assert from 'node:assert/strict';
import { productSchema } from '../product-schema.ts';

const product = {
  title: 'Abeti Aja Fila Cap',
  description: '',
  categoryId: 'leaf-category',
  priceCadCents: 4000,
  productionDays: '3–4',
  tag: null,
  status: 'DRAFT',
  metaTitle: '',
  metaDescription: '',
  images: [],
  variants: [{ size: 'L', color: 'beige/cream', stock: 50 }],
};

test('a draft can be saved before its photos arrive', () => {
  assert.equal(productSchema.safeParse(product).success, true);
});

test('a published product needs a real image', () => {
  const result = productSchema.safeParse({ ...product, status: 'PUBLISHED' });
  assert.equal(result.success, false);
  assert.ok(result.error.flatten().fieldErrors.images?.[0].includes('image'));
});

test('image focal point is bounded', () => {
  const image = { url: 'https://example.com/cap.jpg', color: '', focalX: 50, focalY: 101 };
  assert.equal(productSchema.safeParse({ ...product, status: 'PUBLISHED', images: [image] }).success, false);
  assert.equal(productSchema.safeParse({ ...product, status: 'PUBLISHED', images: [{ ...image, focalY: 40 }] }).success, true);
});
