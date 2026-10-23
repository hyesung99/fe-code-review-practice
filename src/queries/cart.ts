import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  type AddToCartErrorCode,
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";
import { cartCountAtom } from "../atoms/cart";
import { useIsLogin } from "../hooks/useIsLogin";
import { queryClient } from "../lib/query-client";

export const cartQueries = {
  all: () => ["cart"] as const,
  detail: () =>
    queryOptions({
      queryKey: [...cartQueries.all(), "detail"] as const,
      queryFn: getCart,
    }),
};

export function useGetCart() {
  return useQuery(cartQueries.detail());
}

export type AddToCartBlockReason = keyof typeof ADD_TO_CART_BLOCK_MESSAGE;

export const ADD_TO_CART_BLOCK_MESSAGE = {
  NOT_LOGGED_IN: "로그인이 필요해요",
  SOLD_OUT: "품절된 상품이에요",
} as const;

const ERROR_CODE_TO_BLOCK_REASON: Record<
  AddToCartErrorCode,
  AddToCartBlockReason
> = {
  UNAUTHORIZED: "NOT_LOGGED_IN",
  OUT_OF_STOCK: "SOLD_OUT",
};

export class AddToCartBlockedError extends Error {
  constructor(readonly reason: AddToCartBlockReason) {
    super(ADD_TO_CART_BLOCK_MESSAGE[reason]);
  }
}

export function useAddToCart() {
  const { isLogin } = useIsLogin();
  const setCartCount = useSetAtom(cartCountAtom);

  return useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const response = await addToCart(productId, quantity, { isLogin });
      if (!response.ok) {
        throw new AddToCartBlockedError(
          ERROR_CODE_TO_BLOCK_REASON[response.code]
        );
      }
    },
    onSuccess: (_, { quantity = 1 }) => {
      setCartCount((prev) => prev + quantity);
      queryClient.invalidateQueries({ queryKey: cartQueries.all() });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, quantity),
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
