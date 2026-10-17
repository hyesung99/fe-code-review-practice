import { useMutation, useQuery } from '@tanstack/react-query';
import { getCart, removeCartItem, updateCartItem } from '../api/cart';
import { queryClient } from '../lib/query-client';

export function useGetCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
  });
}
