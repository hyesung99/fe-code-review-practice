import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { getCart, removeCartItem, updateCartItem } from '../api/cart';
import { queryClient } from '../lib/query-client';

export const cartQueries = {
  all: () => ['cart'] as const,
  detail: () =>
    queryOptions({
      queryKey: [...cartQueries.all(), 'detail'] as const,
      queryFn: getCart,
    }),
};

export function useGetCart() {
  return useQuery(cartQueries.detail());
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueries.all() });
    },
  });
}

export function useRemoveCartItem() {
  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
  });
}
