import type { Product } from '../api/db';

export function isSoldOut(product: Product) {
  return product.stock === 0;
}
