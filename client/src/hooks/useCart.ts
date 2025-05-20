import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "lodash";

import type { AppDispatch } from "@/store";
import {
  fetchCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncLocalCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectTotalQuantity,
  selectSubtotal,
} from "@/store/slices/cartSlice";
import { useAuth } from "@/hooks/useAuth";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>(); // 取得 dispatch 函式
  const { isAuthenticated } = useAuth();
  // 透過 useSelector 從 store 讀取購物車的資料與狀態
  const cart = useSelector(selectCart);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalQuantity = useSelector(selectTotalQuantity);
  const subtotal = useSelector(selectSubtotal);

  // 在組件掛載時自動載入購物車內容
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    // 已登入：先同步本地購物車到後端，然後再獲取購物車內容。
    if (isAuthenticated && localCart.length > 0) {
      dispatch(syncLocalCart()).unwrap();
      localStorage.removeItem("cart");
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  // 使用 throttle 避免快速點擊加入商品，造成頻繁發送請求（限制每 300ms 只會發出一次請求）。
  const throttledAddToCart = throttle(
    async (productId: string, quantity: number) => {
      if (!productId) return;

      const validQuantity = Math.max(1, quantity || 1);
      try {
        await dispatch(
          addToCart({ productId: productId, quantity: validQuantity }),
        ).unwrap();
      } catch (err: any) {
        throw new Error("加入商品失敗：" + err.message);
      }
    },
    300,
    // leading: true 表示在節流期間內，只會發出一次請求。
    // trailing: false 表示在節流期間內，不會發出請求。
    { leading: true, trailing: false },
  );

  return {
    cart,
    isLoading,
    error,
    totalQuantity,
    subtotal,
    getCart: () => dispatch(fetchCart()),
    addToCart: throttledAddToCart,
    removeFromCart: (cartItemId: string) =>
      dispatch(removeFromCart(cartItemId)),
    changeQuantity: (cartItemId: string, quantity: number) =>
      dispatch(updateQuantity({ cartItemId, quantity })),
    clearCart: async () => {
      await dispatch(clearCart());
      return true;
    },
  };
};
