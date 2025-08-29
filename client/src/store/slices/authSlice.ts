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

export const login = createAsyncThunk(
  "auth/login",
  async (
    {
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { email, password, rememberMe },
        { withCredentials: true },
      );

      if (res.data.success && res.data.user) return res.data.user;
      return rejectWithValue(res.data.message || "登入失敗，請稍後再試。");
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "登入失敗，請稍後再試。",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/logout`,
      );
      if (res.data.success) return;
      return rejectWithValue(res.data.message || "登出失敗，請稍後再試。");
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "登出失敗，請稍後再試。",
      );
    }
  },
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
