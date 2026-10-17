import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { useGetProductList } from '../queries/products';
import { addToCart } from '../api/cart';
import { cartCountAtom } from '../atoms/cart';
import { userAtom } from '../atoms/user';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ProductGrid } from '../components/ProductGrid';

const categories = ['전체', '식품', '생활', '가전', '패션'];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const setCartCount = useSetAtom(cartCountAtom);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('전체');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetProductList(4, keyword, page, category === '전체' ? undefined : category);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
    setCartCount((prev) => prev + 1);
    alert('장바구니에 담았어요');
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

  const totalPage = Math.ceil(data!.totalCount / 4);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">오늘의 상품</h1>

      <Input
        placeholder="상품명을 검색하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="mb-3"
      />

      <div className="flex gap-2 mb-4">
        {categories.map((c) => (
          <Button
            key={c}
            variant={category === c ? 'primary' : 'secondary'}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
          >
            {c}
          </Button>
        ))}
      </div>

      <ProductGrid
        products={data!.items}
        isLogin={user.isLogin}
        onAddToCart={handleAddToCart}
        onClickProduct={(id) => navigate(`/products/${id}`)}
      />

      <div className="flex justify-center gap-1 mt-6">
        {Array.from({ length: totalPage }).map((_, i) => (
          <Button key={i} variant={page === i + 1 ? 'primary' : 'ghost'} onClick={() => setPage(i + 1)}>
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
