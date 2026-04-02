import QuantityStepper from "@/components/atoms/QuantityStepper";
import type { CartItem } from "@/types";
import { memo, useEffect, useState } from "react";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (cartItemId: string, quantity: number) => void;
}

const CartItemRow = ({ item, onChangeQuantity }: CartItemRowProps) => {
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);

  useEffect(() => {
    if (displayQuantity === item.quantity) return;

    const timer = setTimeout(() => {
      onChangeQuantity(item._id, displayQuantity);
    }, 220);

    return () => clearTimeout(timer);
  }, [displayQuantity, item._id, item.quantity, onChangeQuantity]);

  return (
    <QuantityStepper
      value={displayQuantity}
      max={item.product.countInStock}
      onChange={setDisplayQuantity}
    />
  );
};

export default memo(CartItemRow);
