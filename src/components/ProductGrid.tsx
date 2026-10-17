import type { Product } from '../api/db';
import { ProductCard } from './ProductCard';

type ProductGridProps = {
  products: Product[];
  isLogin: boolean;
  onAddToCart: (productId: string) => void;
  onClickProduct: (productId: string) => void;
};

export function ProductGrid({ products, isLogin, onAddToCart, onClickProduct }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isLogin={isLogin}
          onAddToCart={onAddToCart}
          onClickProduct={onClickProduct}
        />
      ))}
    </div>
  );
}
