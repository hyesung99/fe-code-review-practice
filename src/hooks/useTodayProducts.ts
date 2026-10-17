import { useSuspenseQuery } from "@tanstack/react-query";
import { productQueries } from "../queries/products";

const PAGE_SIZE = 4;

type UseTodayProductsParams = {
  keyword: string;
  category: string;
  page: number;
};

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
      size: PAGE_SIZE,
      keyword,
      category: category === "전체" ? undefined : category,
    })
  ).data;

  return {
    products: items,
    totalPage: Math.ceil(totalCount / PAGE_SIZE),
  };
}
