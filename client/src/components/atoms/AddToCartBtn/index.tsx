import { useEffect, useRef, useState } from "react";

import Button from "@/components/atoms/Button";
import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";

import CartPlusIcon from "@/assets/icons/cart-plus.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";

interface AddToCartBtnProps {
  btnType?: "icon" | "text";
  className?: string;
  showIcon?: boolean;
  product: Partial<Product> & { _id: string };
  quantity?: number;
  onAddSuccess?: () => void;
}

const AddToCartBtn = ({
  btnType = "icon",
  className,
  showIcon = true,
  product,
  quantity = 1,
  onAddSuccess,
}: AddToCartBtnProps) => {
  const { cart, addToCart } = useCart();
  const { showAlert } = useAlert();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const existingItem = cart.find((item) => item.productId === product._id);
  const existingQuantity = existingItem?.quantity || 0;
  const totalStock = product.countInStock || 0;
  const availableStock = totalStock - existingQuantity;
  const isOutOfStock = totalStock <= 0;
  const isAtLimit = quantity > availableStock;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 達到購買上限就 Alert
    if (isAtLimit) {
      showAlert({
        variant: "warning",
        message: `無法將所選數量加到購物車。因為購物車已有 ${existingQuantity} 件商品，請至購物車頁面查看。`,
      });
      return;
    }

    // 缺貨或已在加入中 → 不執行
    if (isOutOfStock || isAdding) return;

    const executeAdd = async () => {
      setIsAdding(true);
      setIsSuccess(false);

      try {
        await addToCart(product._id, quantity, product);

        setIsSuccess(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsSuccess(false), 1500);

        onAddSuccess?.();
      } catch (err: unknown) {
        showAlert({
          variant: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsAdding(false);
      }
    };

    executeAdd().catch(() => undefined);
  };

  if (btnType === "icon")
    return (
      <Button
        variant="secondary"
        icon={isSuccess ? undefined : PlusIcon}
        onClick={handleAdd}
        disabled={isOutOfStock || isAdding}
        className={cn(
          "size-8.5 rounded-full transition-transform",
          !isOutOfStock && !isAdding && "active:scale-95",
          className
        )}
        aria-label="加入購物車"
      >
        {isSuccess && <span className="text-sm font-bold">✔</span>}
      </Button>
    );

  return (
    <Button
      icon={
        showIcon && !isOutOfStock && !isAdding && !isSuccess
          ? CartPlusIcon
          : undefined
      }
      onClick={handleAdd}
      disabled={isOutOfStock || isAdding}
      className={cn(
        "w-full transition-transform",
        isSuccess &&
          "text-green-600 border-green-600 bg-green-50 hover:bg-green-50",
        className
      )}
      aria-label="加入購物車"
    >
      {isOutOfStock
        ? "補貨中"
        : isAdding
          ? "加入中"
          : isSuccess
            ? "✔ 已加入"
            : "加入購物車"}
    </Button>
  );
};

export default AddToCartBtn;
