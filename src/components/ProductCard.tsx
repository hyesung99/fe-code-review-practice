import { PropsWithChildren } from "react";
import type { Product } from "../api/db";
import { Badge } from "./ui/badge";

type ProductCardProps = {
  product: Product;
  onClickProduct: (productId: string) => void;
};

export function ProductCard({
  product,
  onClickProduct,
  children,
}: PropsWithChildren<ProductCardProps>) {
  return (
    <div
      onClick={() => onClickProduct(product.id)}
      className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md"
    >
      <img
        src={product.imageUrl}
        className="w-full aspect-square object-cover rounded-lg mb-2"
      />
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{product.name}</span>
        {product.stock === 0 && (
          <Badge className="bg-gray-200 text-gray-600">품절</Badge>
        )}
      </div>
      <div className="text-sm font-bold mt-1">
        {product.price.toLocaleString()}원
      </div>
      {children && <div onClick={(e) => e.stopPropagation()}>{children}</div>}
    </div>
  );
}
