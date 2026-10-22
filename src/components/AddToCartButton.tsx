import type { Product } from "../api/db";
import { useAddToCart } from "../queries/cart";
import { Button } from "./ui/button";

type AddToCartButtonProps = {
  product: Product;
};

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleClick = () => {
    addToCart(
      { productId: product.id },
      {
        onSuccess: () => alert("장바구니에 담았어요"),
        onError: (error) => alert(error.message),
      }
    );
  };

  return (
    <Button
      variant="secondary"
      className="w-full mt-2"
      onClick={handleClick}
      disabled={isPending}
    >
      담기
    </Button>
  );
};
