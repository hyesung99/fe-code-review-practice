import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { useGetProduct } from '../queries/products';
import { useGetReviews } from '../queries/reviews';
import { addToCart } from '../api/cart';
import { getRelatedProducts } from '../api/products';
import type { Product } from '../api/db';
import { cartCountAtom } from '../atoms/cart';
import { userAtom } from '../atoms/user';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const setCartCount = useSetAtom(cartCountAtom);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const { data: product, isLoading, error } = useGetProduct(id!);
  const { data: reviews } = useGetReviews(id!);

  useEffect(() => {
    if (product) {
      getRelatedProducts(product.category).then((res) => setRelatedProducts(res));
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user.isLogin) {
      alert('로그인이 필요해요');
      return;
    }
    if (product!.stock == 0) {
      alert('품절된 상품이에요');
      return;
    }
    await addToCart(product!.id, quantity);
    setCartCount((prev) => prev + quantity);
    if (confirm('장바구니에 담았어요. 장바구니로 이동할까요?')) {
      navigate('/cart');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

  const averageRating = reviews ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div>
      <img src={product!.imageUrl} className="w-full aspect-square object-cover rounded-xl mb-4" />
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{product!.name}</h1>
        {product!.stock === 0 && <Badge className="bg-gray-200 text-gray-600">품절</Badge>}
        {product!.stock > 0 && product!.stock < 10 && <Badge className="bg-red-100 text-red-600">{product!.stock}개 남음</Badge>}
      </div>
      <div className="text-xl font-bold mt-2">{product!.price.toLocaleString()}원</div>
      <p className="text-gray-600 mt-3">{product!.description}</p>

      <div className="flex items-center gap-3 mt-6">
        <Button variant="secondary" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
          -
        </Button>
        <span>{quantity}</span>
        <Button variant="secondary" onClick={() => setQuantity(quantity + 1)}>
          +
        </Button>
        <Button className="flex-1" onClick={handleAddToCart}>
          {(product!.price * quantity).toLocaleString()}원 장바구니 담기
        </Button>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">
            리뷰 {reviews?.length ?? 0}개 · ★ {averageRating}
          </h2>
          <Button variant="secondary" onClick={() => navigate(`/products/${id}/reviews/new`)}>
            리뷰 쓰기
          </Button>
        </div>
        <ul className="space-y-2">
          {reviews?.map((review) => (
            <li key={review.id} className="bg-white rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span>
                  {'★'.repeat(review.rating)} {review.author}
                </span>
                <Link to={`/reviews/${review.id}/edit`} className="text-gray-400">
                  수정
                </Link>
              </div>
              <p className="text-sm mt-1">{review.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold mb-3">함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-2 gap-3">
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isLogin={false}
              onAddToCart={() => {}}
              onClickProduct={(productId) => navigate(`/products/${productId}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
