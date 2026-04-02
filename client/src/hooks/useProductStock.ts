import { useCart } from "@/hooks/useCart";
import { useMemo } from "react";

interface UseProductStockProps {
  productId: string;
  countInStock: number;
}

interface UseProductStockReturn {
  existingQuantity: number;
  availableStock: number;
  isAtLimit: boolean;
}

export const useProductStock = ({
  productId,
  countInStock,
}: UseProductStockProps): UseProductStockReturn => {
  const { cart } = useCart();

  return useMemo(() => {
    const existingItem = cart.find((item) => item.productId === productId);
    const existingQuantity = existingItem?.quantity || 0;
    const availableStock = countInStock - existingQuantity;
    const isAtLimit = availableStock <= 0;

    return {
      existingQuantity,
      availableStock,
      isAtLimit,
    };
  }, [cart, productId, countInStock]);
};
