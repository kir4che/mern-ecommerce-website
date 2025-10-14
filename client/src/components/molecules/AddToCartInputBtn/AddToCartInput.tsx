import React from "react";

import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { preventInvalidInput, handleQuantityChange } from "@/utils/cartUtils";

import Input from "@/components/atoms/Input";

interface AddToCartInputProps {
  product: Partial<Product>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  wrapperStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  onQuantityChange?: (quantity: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const AddToCartInput: React.FC<AddToCartInputProps> = ({
  product,
  quantity,
  setQuantity,
  wrapperStyle = "flex items-center gap-2",
  inputStyle = "rounded-none",
  labelStyle,
  onQuantityChange,
  onKeyDown,
}) => {
  const { cart } = useCart();

  const existingQuantity =
    cart.find((item) => item.productId === product._id)?.quantity || 0;

  const handleChange = (
    value: number | React.ChangeEvent<HTMLInputElement>
  ) => {
    const productForQuantity = {
      _id: product._id || "",
      countInStock: product.countInStock || 0,
    };

    handleQuantityChange(
      value,
      productForQuantity,
      (newValue) => {
        setQuantity(newValue);
        onQuantityChange?.(newValue);
      },
      existingQuantity
    );
  };

  return (
    <Input
      type="number"
      label="數量"
      min={1}
      max={(product.countInStock || 0) - existingQuantity}
      value={quantity}
      onChange={handleChange}
      onKeyDown={onKeyDown || preventInvalidInput}
      disabled={!product.countInStock || product.countInStock <= 0}
      wrapperStyle={wrapperStyle}
      inputStyle={inputStyle}
      labelStyle={labelStyle}
    />
  );
};

export default AddToCartInput;
