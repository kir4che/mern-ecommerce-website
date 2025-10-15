import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { login, logout } from "@/store/slices/authSlice";

export const authListenerMiddleware = createListenerMiddleware();

// 監聽登入、登出成功
authListenerMiddleware.startListening({
  matcher: isAnyOf(login.fulfilled, logout.fulfilled),
  effect: async (action) => {
    // 登入成功後，將 tokens 和使用者資料存進 localStorage。
    if (login.fulfilled.match(action)) {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    } else if (logout.fulfilled.match(action)) {
      // 登出後移除
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
});
