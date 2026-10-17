import Cart from '@/views/Cart';
import { listProducts } from '@/server/catalogue';
import { getPageContent } from '@/server/content';

export default async function CartPage() {
  const products = await listProducts();
  const shippingContent = await getPageContent('shipping');
  // Get a few products for recommendations (e.g. 2 random or newest ones)
  const recommendations = products.slice(0, 2);
  return <Cart recommendations={recommendations} shippingContent={shippingContent} />;
}
