import axios from "axios";
import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  readonly id: string;
  readonly email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Missing environment variable: VITE_API_URL");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

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

export const login = createAsyncThunk<User, LoginPayload, RejectValue>(
  "auth/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/login", {
        email,
        password,
        rememberMe,
      });

      if (data.success && data.user) return data.user;

      return rejectWithValue(data.message || "登入失敗，請稍後再試。");
    } catch (err) {
      return rejectWithValue(toErrorMessage(err, "登入失敗，請稍後再試。"));
    }
  }
);

export const logout = createAsyncThunk<void, void, RejectValue>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user/logout");

      if (data.success) return;
      return rejectWithValue(data.message || "登出失敗，請稍後再試。");
    } catch (err) {
      return rejectWithValue(toErrorMessage(err, "登出失敗，請稍後再試。"));
    }
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
      if (userStr) {
        state.user = JSON.parse(userStr);
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
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
        state.isAuthenticated = false;
        state.error = (action.payload as string) || "操作失敗，請稍後再試。";
      });
  },
});

export const { initializeAuth } = authSlice.actions;

export default authSlice.reducer;
