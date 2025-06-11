import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "lodash";

import type { AppDispatch } from "@/store";
import {
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectTotalQuantity,
  selectSubtotal,
} from "@/store/slices/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 從 Redux store 取得購物車相關狀態
  const cart = useSelector(selectCart);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalQuantity = useSelector(selectTotalQuantity);
  const subtotal = useSelector(selectSubtotal);

  // 新增商品到購物車（throttled）
  const throttledAddToCart = throttle(
    async (productId: string, quantity: number) => {
      if (!productId) return;

      const validQuantity = Math.max(1, quantity || 1);
      try {
        await dispatch(
          addToCart({ productId, quantity: validQuantity }),
        ).unwrap();
      } catch (err: any) {
        throw new Error("加入商品失敗：" + (err.message || "未知錯誤"));
      }
    },
    300,
    { leading: true, trailing: false },
  );

  // 移除購物車商品
  const handleRemoveFromCart = useCallback(
    (cartItemId: string) => dispatch(removeFromCart(cartItemId)),
    [dispatch],
  );

  // 更新商品數量
  const handleChangeQuantity = useCallback(
    (cartItemId: string, quantity: number) =>
      dispatch(changeQuantity({ cartItemId, quantity })),
    [dispatch],
  );

  // 清空購物車
  const handleClearCart = useCallback(async () => {
    await dispatch(clearCart());
    return true;
  }, [dispatch]);

  return {
    cart,
    isLoading,
    error,
    totalQuantity,
    subtotal,
    addToCart: throttledAddToCart,
    removeFromCart: handleRemoveFromCart,
    changeQuantity: handleChangeQuantity,
    clearCart: handleClearCart,
  };
};
