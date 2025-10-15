import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";

import { api } from "@/hooks/useAxios";

interface User {
  readonly id: string;
  readonly email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const toErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) return err.response?.data?.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
};

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

type RejectValue = {
  rejectValue: string;
};

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const login = createAsyncThunk<LoginResponse, LoginPayload, RejectValue>(
  "auth/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/login", {
        email,
        password,
        rememberMe,
      });

      if (data.success && data.user && data.accessToken && data.refreshToken) {
        return {
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      }

      return rejectWithValue(data.message || "登入失敗，請稍後再試。");
    } catch (err) {
      return rejectWithValue(toErrorMessage(err, "登入失敗，請稍後再試。"));
    }
  }
);

export const logout = createAsyncThunk<void, void, RejectValue>(
  "auth/logout",
  async () => {
    try {
      await api.post("/user/logout");
    } catch {}
    // 總是返回成功，確保前端 token 被清除
    return;
  }
);

const authActionPending = isAnyOf(login.pending, logout.pending);
const authActionRejected = isAnyOf(login.rejected, logout.rejected);

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
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // 使用 matcher 處理共通的 pending 和 rejected 狀態
      .addMatcher(authActionPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authActionRejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = (action.payload as string) || "操作失敗，請稍後再試。";
      });
  },
});

export const { initializeAuth, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
