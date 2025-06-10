import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import { login, logout } from "@/store/slices/authSlice";
import {
  fetchCart,
  syncLocalCart,
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
} from "@/store/slices/cartSlice";

export const cartListenerMiddleware = createListenerMiddleware();

cartListenerMiddleware.startListening({
  matcher: isAnyOf(login.fulfilled, logout.fulfilled),
  effect: async (action, listenerApi) => {
    // 登入成功後，同步本地購物車到後端。
    if (action.type === login.fulfilled.type) {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length > 0) {
          await listenerApi.dispatch(syncLocalCart());
          localStorage.removeItem("cart"); // 同步後清除本地購物車
        }
      } catch (err: any) {
        console.error("同步本地購物車失敗：", err.message);
      }
    }

    listenerApi.dispatch(fetchCart());
  },
});

const cartUpdateActions = isAnyOf(
  fetchCart.fulfilled,
  addToCart.fulfilled,
  removeFromCart.fulfilled,
  changeQuantity.fulfilled,
  clearCart.fulfilled,
);

// 監聽購物車變動
cartListenerMiddleware.startListening({
  matcher: cartUpdateActions,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    // 當使用者沒登入，將購物車狀態存進 localStorage。
    if (!state.auth.isAuthenticated) {
      const cartToSave = state.cart.cart;
      localStorage.setItem("cart", JSON.stringify(cartToSave));
    }
  },
});
