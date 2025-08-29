import React, { useState } from "react";

import type { Product } from "@/types/product";

import AddToCartInput from "./AddToCartInput";
import AddToCartBtn from "./AddToCartBtn";

interface AddToCartInputBtnProps {
  product: Partial<Product>;
  className?: string;
  btnType?: "icon" | "text";
  onQuantityChange?: (quantity: number) => void;
  onAddSuccess?: () => void;
}

const AddToCartInputBtn: React.FC<AddToCartInputBtnProps> = ({
  product,
  className = "",
  btnType = "icon",
  onQuantityChange,
  onAddSuccess,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AddToCartInput
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        onQuantityChange={onQuantityChange}
      />
      <AddToCartBtn
        btnType={btnType}
        product={product}
        quantity={quantity}
        onAddSuccess={() => {
          setQuantity(1);
          onAddSuccess?.();
        }}
      />
    </div>
  );
};

export default AddToCartInputBtn;
