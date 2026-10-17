import type { CartItem, Product } from '../api/db';

const FREE_SHIPPING_THRESHOLD = 50000;

export function useCartSummary(items: (CartItem & { product: Product })[] = []) {
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    totalPrice,
    isFreeShipping: totalPrice >= FREE_SHIPPING_THRESHOLD,
    remainForFreeShipping: Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0),
  };
}
