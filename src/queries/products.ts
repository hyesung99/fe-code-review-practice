import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getProduct, getProducts } from '../api/products';

export function useSuspenseGetProductList(size: number, keyword: string, page: number, category?: string) {
  return useSuspenseQuery({
    queryKey: ['productList', keyword, page, category],
    queryFn: () => getProducts({ page, size, keyword, category }),
  });
}

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: ['getProduct', id],
    queryFn: () => getProduct(id),
  });
}
