import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  clearCredentials,
  setAccessToken,
  setCredentials,
} from "@/store/slices/authSlice";

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: isAnyOf(setCredentials, clearCredentials, setAccessToken), // 只要這三個 action 就觸發 listener
  effect: async (action) => {
    if (setCredentials.match(action)) {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      return;
    }

    if (clearCredentials.match(action)) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return;
    }

    if (setAccessToken.match(action))
      localStorage.setItem("accessToken", action.payload);
  },
});
