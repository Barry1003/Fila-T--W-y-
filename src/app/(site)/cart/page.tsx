import Cart from '@/views/Cart';
import { listProducts } from '@/server/catalogue';

export default async function CartPage() {
  const products = await listProducts();
  // Get a few products for recommendations (e.g. 2 random or newest ones)
  const recommendations = products.slice(0, 2);
  return <Cart recommendations={recommendations} />;
}
