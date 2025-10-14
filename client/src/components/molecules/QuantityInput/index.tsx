import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

import { useCart } from "@/hooks/useCart";
import { preventInvalidInput } from "@/utils/cartUtils";
import type { CartItem } from "@/types/cart";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import MinusIcon from "@/assets/icons/minus.inline.svg?react";

interface QuantityInputProps {
  item: CartItem;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ item }) => {
  const { changeQuantity } = useCart();
  const [inputValue, setInputValue] = useState(item.quantity);

  const debouncedChangeQuantity = useCallback(
    debounce(
      (cartItemId: string, newQuantity: number) => {
        if (newQuantity > 0) changeQuantity(cartItemId, newQuantity);
      },
      300,
      { leading: false, trailing: true },
    ),
    [changeQuantity],
  );

  useEffect(() => {
    setInputValue(item.quantity);
  }, [item.quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newQuantity = value === "" ? 0 : parseInt(value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 0) {
      const stock = item.product?.countInStock || 0;
      const clampedQuantity = Math.min(newQuantity, stock);
      setInputValue(clampedQuantity);
      debouncedChangeQuantity(item._id, clampedQuantity);
    }
  };

  const handleButtonClick = (amount: number) => {
    const newQuantity = inputValue + amount;
    const stock = item.product?.countInStock || 0;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setInputValue(newQuantity);
      debouncedChangeQuantity(item._id, newQuantity);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="icon"
        icon={MinusIcon}
        className="border-gray-200 rounded-none h-7"
        onClick={() => handleButtonClick(-1)}
        disabled={inputValue <= 1}
      />
      <Input
        type="number"
        min={1}
        max={item.product.countInStock ?? 0}
        value={inputValue === 0 ? "" : inputValue}
        onChange={handleInputChange}
        onKeyDown={preventInvalidInput}
        disabled={(item.product.countInStock ?? 0) <= 0}
        wrapperStyle="noInnerSpin"
        inputStyle="w-12 text-center min-h-7 rounded-none border-y-gray-200 border-x-0"
      />
      <Button
        variant="icon"
        icon={PlusIcon}
        className="border-gray-200 rounded-none h-7"
        onClick={() => handleButtonClick(1)}
        disabled={inputValue >= (item.product.countInStock ?? 0)}
      />
    </div>
  );
};

export default QuantityInput;
