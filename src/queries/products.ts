import { queryOptions, useQuery } from "@tanstack/react-query";
import { getProduct, getProducts, type GetProductsParams } from "../api/products";

export const productQueries = {
  all: () => ["products"] as const,
  lists: () => [...productQueries.all(), "list"] as const,
  list: (params: GetProductsParams) =>
    queryOptions({
      queryKey: [...productQueries.lists(), params] as const,
      queryFn: () => getProducts(params),
    }),
  details: () => [...productQueries.all(), "detail"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...productQueries.details(), id] as const,
      queryFn: () => getProduct(id),
    }),
};

export function useGetProduct(id: string) {
  return useQuery(productQueries.detail(id));
}
