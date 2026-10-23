import { useNavigate } from "react-router-dom";

export const useNavigateToProductDetail = () => {
  const navigate = useNavigate();
  const navigateToProductDetail = (productId: string) =>
    navigate(`/products/${productId}`);
  return { navigateToProductDetail };
};
