import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { login, logout } from "@/store/slices/authSlice";
import { fetchCart, syncLocalCart } from "@/store/slices/cartSlice";

export const cartListenerMiddleware = createListenerMiddleware();

cartListenerMiddleware.startListening({
  matcher: isAnyOf(login.fulfilled, logout.fulfilled),
  effect: async (action, listenerApi) => {
    // 登入完成後執行
    if (action.type === login.fulfilled.type) {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        // 同步本地購物車到後端
        if (localCart.length > 0) await listenerApi.dispatch(syncLocalCart());
      } catch (err: any) {
        console.error("同步本地購物車失敗：", err.message);
      }
    }

    // 重新取得購物車內容以更新 store
    await listenerApi.dispatch(fetchCart());
  },
});

// 初始化購物車
export const initializeCart = () => async (dispatch: any) => {
  const result = await dispatch(fetchCart());
  // 失敗就登出
  if (fetchCart.rejected.match(result) || result.payload?.success === false) {
    dispatch(logout());
    return;
  }
};
