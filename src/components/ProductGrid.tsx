import type { ReactNode } from "react";
import type { Product } from "../api/db";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  onClickProduct: (productId: string) => void;
  renderAction?: (product: Product) => ReactNode;
};

export function ProductGrid({
  products,
  onClickProduct,
  renderAction,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClickProduct={onClickProduct}
        >
          {renderAction?.(product)}
        </ProductCard>
      ))}
    </div>
  );
}
