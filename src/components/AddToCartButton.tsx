import { ComponentProps, MouseEvent } from "react";
import type { Product } from "../api/db";
import { useAddToCart } from "../queries/cart";
import { Button } from "./ui/button";

type AddToCartButtonProps = {
  product: Product;
  onAdded?: () => void;
  onAddFailed?: (error: Error) => void;
} & ComponentProps<typeof Button>;

export const AddToCartButton = ({
  product,
  onAdded,
  onAddFailed,
  children = "담기",
  ...props
}: AddToCartButtonProps) => {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleClick = () => {
    addToCart(
      { productId: product.id },
      {
        onSuccess: () => onAdded?.(),
        onError: (error) => onAddFailed?.(error),
      }
    );
  };

  return (
    <Button
      variant="secondary"
      className="w-full mt-2"
      onClick={handleClick}
      disabled={isPending}
      {...props}
    >
      {children}
    </Button>
  );
};
