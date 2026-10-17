import { useQuery } from '@tanstack/react-query';
import { getProduct, getProducts } from '../api/products';

export function useGetProductList(size: number, keyword: string, page: number, category?: string) {
  return useQuery({
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
