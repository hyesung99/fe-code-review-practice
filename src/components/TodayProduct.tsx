import { useState } from "react";
import { useIsLogin } from "../hooks/useIsLogin";
import { useNavigateToProductDetail } from "../hooks/useNavigateProductDetail";
import { useTodayProducts } from "../hooks/useTodayProducts";
import { isSoldOut } from "../lib/product";
import { AddToCartButton } from "./AddToCartButton";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./ui/pagination";

type TodayProductProps = {
  keyword: string;
  category: string;
};

export const TodayProduct = ({ keyword, category }: TodayProductProps) => {
  const [page, setPage] = useState(1);
  const { products, totalPage } = useTodayProducts({
    keyword,
    category,
    page,
  });

  const { navigateToProductDetail } = useNavigateToProductDetail();
  const { isLogin } = useIsLogin();

  return (
    <>
      <ProductGrid
        products={products}
        onClickProduct={(id) => navigateToProductDetail(id)}
        renderAction={(product) =>
          isLogin &&
          !isSoldOut(product) && (
            <AddToCartButton
              product={product}
              onAdded={() => alert("장바구니에 담았어요")}
              onAddFailed={(error) => alert(error.message)}
            />
          )
        }
      />

      <Pagination
        totalPage={totalPage}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  );
};
