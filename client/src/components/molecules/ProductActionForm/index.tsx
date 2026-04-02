import AddToCartBtn from "@/components/atoms/AddToCartBtn";
import QuantityStepper from "@/components/atoms/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import { useState } from "react";

interface Props {
  product: Product;
  variant?: "card" | "detail";
}

const ProductActionForm = ({ product, variant = "card" }: Props) => {
  const { cart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const existingItem = cart.find((item) => item.productId === product._id);
  const existingQuantity = existingItem?.quantity || 0;
  const availableStock = (product.countInStock || 0) - existingQuantity;
  const isAtLimit = availableStock <= 0;

  if (variant === "card")
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <QuantityStepper
            variant="native"
            value={quantity}
            max={availableStock}
            onChange={setQuantity}
            disabled={isAtLimit}
            className="w-15"
          />
          <AddToCartBtn
            product={product}
            quantity={quantity}
            onAddSuccess={() => setQuantity(1)}
          />
        </div>
        {isAtLimit && <p className="text-red-600 text-[13px]">已達購買上限</p>}
      </div>
    );

  return (
    <div className="flex flex-col items-end gap-4">
      <QuantityStepper
        size="lg"
        value={quantity}
        max={availableStock}
        onChange={setQuantity}
        disabled={isAtLimit}
      />
      <AddToCartBtn
        btnType="text"
        product={product}
        quantity={quantity}
        onAddSuccess={() => setQuantity(1)}
        className="w-52 py-2.5 rounded-full"
      />
      {isAtLimit && <p className="text-red-600 text-[13px]">已達購買上限</p>}
    </div>
  );
};

export default ProductActionForm;
