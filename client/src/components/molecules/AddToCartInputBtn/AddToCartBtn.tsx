import React from "react";

import type { Product } from "@/types/product";
import { handleAddToCart } from "@/utils/cartUtils";
import { useCart } from "@/hooks/useCart";

import Button from "@/components/atoms/Button";

import { ReactComponent as CartPlusIcon } from "@/assets/icons/cart-plus.inline.svg";
import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";

interface AddToCartBtnProps {
  btnType?: "icon" | "text";
  title?: string;
  btnStyle?: string;
  showIcon?: boolean;
  product: Partial<Product>;
  quantity: number;
  onAddSuccess?: () => void;
  onQuantityChange?: (quantity: number) => void;
}

const AddToCartBtn: React.FC<AddToCartBtnProps> = ({
  btnType = "icon",
  title = "加入購物車",
  btnStyle = "h-10",
  showIcon = true,
  product,
  quantity,
  onAddSuccess,
  onQuantityChange,
}) => {
  const { cart, addToCart } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  // 檢查購物車中已存在的商品數量
  const existingQuantity =
    cart.find((item) => item.productId === product._id)?.quantity || 0;
  // 計算總庫存和可用庫存
  const totalStock = product.countInStock || 0;
  const availableStock = totalStock - existingQuantity;
  // 檢查商品是否已無庫存或達到最大購買數量
  const isOutOfStock = availableStock <= 0;

  const handleAdd = async () => {
    if (!product._id || isOutOfStock || isAdding || quantity > availableStock)
      return;

    try {
      setIsAdding(true);
      await handleAddToCart(
        {
          _id: product._id,
          countInStock: product.countInStock || 0,
        },
        Math.min(quantity, availableStock),
        (params: { productId: string; quantity: number }) =>
          addToCart(params.productId, params.quantity),
        (newValue) => onQuantityChange?.(newValue),
      );
      onAddSuccess?.();
    } catch (err: any) {
      throw new Error("加入商品失敗：" + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (btnType === "icon") {
    return (
      <Button
        variant="icon"
        icon={PlusIcon}
        onClick={handleAdd}
        disabled={isOutOfStock}
        className="w-6 h-6 border-primary hover:border-primary hover:bg-primary"
        iconStyle="hover:stroke-secondary"
      />
    );
  }

  return (
    <Button
      icon={showIcon && !isOutOfStock ? CartPlusIcon : undefined}
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={btnStyle}
    >
      {isOutOfStock ? "補貨中" : title}
    </Button>
  );
};

export default AddToCartBtn;
