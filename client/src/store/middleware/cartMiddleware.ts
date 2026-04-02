import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import { apiSlice } from "@/store/slices/apiSlice";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
} from "@/store/slices/guestCartSlice";

export const cartListenerMiddleware = createListenerMiddleware();

// 登入後同步訪客購物車資料
cartListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const guestItems = state.guestCart.items;

    if (guestItems.length > 0) {
      const result = await listenerApi.dispatch(
        apiSlice.endpoints.syncCart.initiate({ localCart: guestItems })
      );

      if ("error" in result) {
        window.dispatchEvent(
          new CustomEvent("app:alert", {
            detail: {
              variant: "warning",
              message: "網路似乎有點不穩，正在背景為您保留原本的購物車商品。",
            },
          })
        );
        return;
      }
    }

    // 同步成功（或沒有商品可同步）才清空本地購物車
    listenerApi.dispatch(clearItems());
    localStorage.removeItem("cart");
  },
});

// 登出後清空訪客購物車資料
cartListenerMiddleware.startListening({
  actionCreator: clearCredentials,
  effect: (_, listenerApi) => {
    listenerApi.dispatch(clearItems());
  },
});

// 監聽購物車變動
cartListenerMiddleware.startListening({
  matcher: isAnyOf(addItem, removeItem, changeItemQuantity, clearItems),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    localStorage.setItem("cart", JSON.stringify(state.guestCart.items));
  },
});
