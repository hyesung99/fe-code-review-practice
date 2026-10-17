import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useTodayProducts } from "../hooks/useTodayProducts";
import { ProductGrid } from "./ProductGrid";
import { useNavigate } from "react-router-dom";
import { userAtom } from "../atoms/user";
import { addToCart } from "../api/cart";
import { cartCountAtom } from "../atoms/cart";
import { Pagination } from "./ui/pagination";

type TodayProductProps = {
  keyword: string;
  category: string;
};

export const TodayProduct = ({ keyword, category }: TodayProductProps) => {
  const [page, setPage] = useState(1);
  const { products, totalPage } = useTodayProducts({ keyword, category, page });
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const setCartCount = useSetAtom(cartCountAtom);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
    setCartCount((prev: number) => prev + 1);
    alert("장바구니에 담았어요");
  };

  return (
    <>
      <ProductGrid
        products={products}
        isLogin={user.isLogin}
        onAddToCart={handleAddToCart}
        onClickProduct={(id) => navigate(`/products/${id}`)}
      />

      <Pagination
        totalPage={totalPage}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  );
};
