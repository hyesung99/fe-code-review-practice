import type { Product } from '../api/db';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type ProductCardProps = {
  product: Product;
  isLogin: boolean;
  onAddToCart: (productId: string) => void;
  onClickProduct: (productId: string) => void;
};

export function ProductCard({ product, isLogin, onAddToCart, onClickProduct }: ProductCardProps) {
  return (
    <div onClick={() => onClickProduct(product.id)} className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md">
      <img src={product.imageUrl} className="w-full aspect-square object-cover rounded-lg mb-2" />
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{product.name}</span>
        {product.stock === 0 && <Badge className="bg-gray-200 text-gray-600">품절</Badge>}
      </div>
      <div className="text-sm font-bold mt-1">{product.price.toLocaleString()}원</div>
      {isLogin && (
        <Button
          variant="secondary"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
        >
          담기
        </Button>
      )}
    </div>
  );
}
