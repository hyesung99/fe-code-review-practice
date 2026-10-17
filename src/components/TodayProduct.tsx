import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useSuspenseGetProductList } from "../queries/products";
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
  const { data } = useSuspenseGetProductList(
    4,
    keyword,
    page,
    category === "전체" ? undefined : category
  );
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const setCartCount = useSetAtom(cartCountAtom);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
    setCartCount((prev: number) => prev + 1);
    alert("장바구니에 담았어요");
  };

  const totalPage = Math.ceil(data.totalCount / 4);

  return (
    <>
      <ProductGrid
        products={data.items}
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
