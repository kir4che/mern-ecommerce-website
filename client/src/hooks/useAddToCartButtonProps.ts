import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import {
  markLoginPromptShown,
  selectHasShownLoginPrompt,
} from "@/store/slices/guestCartSlice";

interface UseAddToCartButtonPropsOptions {
  product: Partial<Product> & { _id: string };
  quantity?: number;
  onAddSuccess?: () => void;
}

interface ButtonPropsOverrides {
  [key: string]: unknown;
}

export const useAddToCartButtonProps = ({
  product,
  quantity = 1,
  onAddSuccess,
}: UseAddToCartButtonPropsOptions) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { cart, addToCart } = useCart();
  const { showAlert } = useAlert();
  const hasShownLoginPrompt = useSelector(selectHasShownLoginPrompt);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 計算可用庫存
  const existingItem = cart.find((item) => item.productId === product._id);
  const existingQuantity = existingItem?.quantity || 0;
  const totalStock = product.countInStock || 0;
  const availableStock = totalStock - existingQuantity;
  const isOutOfStock = totalStock <= 0;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // 缺貨或已在加入中 → 不執行
      if (isOutOfStock || isAdding) return;

      // 已售完
      if (availableStock === 0) {
        showAlert({
          variant: "warning",
          message: "此商品已售完，請選購其他商品。",
          action: {
            label: "查看購物車",
            onClick: () => navigate("/cart"),
          },
        });
        return;
      }

      // 要加入的數量超過可用庫存
      if (quantity > availableStock) {
        showAlert({
          variant: "warning",
          message: `購物車已有 ${existingQuantity} 件，剩餘庫存：${availableStock} 件`,
          action: {
            label: "前往購物車",
            onClick: () => navigate("/cart"),
          },
        });
        return;
      }

      // 達到購買上限
      if (existingQuantity >= availableStock) {
        showAlert({
          variant: "warning",
          message: "已達可購買數量上限，請至購物車調整。",
          action: {
            label: "查看購物車",
            onClick: () => navigate("/cart"),
          },
        });
        return;
      }

      setIsAdding(true);
      setIsSuccess(false);

      try {
        await addToCart(product._id, quantity, product);

        setIsSuccess(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        // 成功加入的 1.5 秒後自動重置成功狀態
        timerRef.current = setTimeout(() => setIsSuccess(false), 1500);

        // 首次加入購物車時提示登入
        if (!isAuthenticated && !hasShownLoginPrompt) {
          dispatch(markLoginPromptShown());
          showAlert({
            variant: "info",
            message: "建議登入以保留購物車內容",
            autoDismiss: true,
            dismissTimeout: 5000,
            action: {
              label: "立即登入",
              onClick: () => navigate("/login"),
            },
          });
        }

        onAddSuccess?.();
      } catch (err: unknown) {
        showAlert({
          variant: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsAdding(false);
      }
    },
    [
      isOutOfStock,
      isAdding,
      availableStock,
      existingQuantity,
      quantity,
      product,
      isAuthenticated,
      hasShownLoginPrompt,
      showAlert,
      navigate,
      dispatch,
      addToCart,
      onAddSuccess,
    ]
  );

  const getButtonProps = useCallback(
    (overrides: ButtonPropsOverrides = {}) => ({
      onClick: handleAdd,
      disabled: isOutOfStock || isAdding,
      "aria-label": "加入購物車",
      ...overrides,
    }),
    [handleAdd, isOutOfStock, isAdding]
  );

  const buttonLabel = useMemo(() => {
    if (isOutOfStock) return "補貨中";
    if (isAdding) return "加入中";
    if (isSuccess) return "✔ 已加入";
    return "加入購物車";
  }, [isOutOfStock, isAdding, isSuccess]);

  return {
    isSuccess,
    isAdding,
    isOutOfStock,
    getButtonProps,
    buttonLabel,
  };
};
