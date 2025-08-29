import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { login, logout } from "@/store/slices/authSlice";

export const authListenerMiddleware = createListenerMiddleware();

// 監聽登入、登出成功
authListenerMiddleware.startListening({
  matcher: isAnyOf(login.fulfilled, logout.fulfilled),
  effect: async (action) => {
    // 登入成功後，將使用者資料存進 localStorage，反之移除。
    if (login.fulfilled.match(action))
      localStorage.setItem("user", JSON.stringify(action.payload));
    else if (logout.fulfilled.match(action)) localStorage.removeItem("user");
  },
});
