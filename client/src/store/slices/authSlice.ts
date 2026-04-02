import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AuthPayload } from "@/types";

interface AuthState extends Partial<AuthPayload> {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const userStr = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (userStr && accessToken) {
        state.user = JSON.parse(userStr);
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      }
    },
    // 登入成功後更新 state
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    // 登出後清空 state
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const {
  initializeAuth,
  setCredentials,
  clearCredentials,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
