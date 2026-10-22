import { useSuspenseQuery } from "@tanstack/react-query";
import { productQueries } from "../queries/products";
import { GetProductsParams } from "../api/products";

const TODAY_PRODUCTS_PAGE_SIZE = 4;

type UseTodayProductsParams = Omit<GetProductsParams, "size">;

/**
 * 오늘의 상품 목록을 조회하는 훅
 * @param keyword - 검색어
 * @param category - 카테고리
 * @param page - 페이지 번호
 * @returns 오늘의 상품 목록과 총 페이지 수
 * suspend 되어 있어 Suspense 경계 안에서 사용해야 한다.
 */
export function useTodayProducts({
  keyword,
  category,
  page,
}: UseTodayProductsParams) {
  const { items, totalCount } = useSuspenseQuery(
    productQueries.list({
      page,
      size: TODAY_PRODUCTS_PAGE_SIZE,
      keyword,
      category: category === "전체" ? null : category,
    })
  ).data;

  return {
    products: items,
    totalPage: Math.ceil(totalCount / TODAY_PRODUCTS_PAGE_SIZE),
  };
}
