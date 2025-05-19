import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

// 若有則從 localStorage 取得先前登入的使用者資料
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
  isAuthenticated: Boolean(localStorage.getItem("user")),
};

export const login = createAsyncThunk(
  "auth/login",
  async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/login`,
      { email, password, rememberMe },
      { withCredentials: true },
    );
    if (response.data.success && response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }

    throw new Error(response.data.message || "登入失敗，請稍後再試。");
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/logout`,
  );
  if (response.data.success) {
    localStorage.removeItem("user");
    return;
  }

  throw new Error(response.data.message || "登出失敗，請稍後再試。");
});

// 使用 createSlice 建立 auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  // 使用 extraReducers 新增非同步 action 的處理程序
  extraReducers: (builder) => {
    // 設定 login 和 logout 的狀態轉換
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "登入過程中發生錯誤，請稍後再試。";
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "登出過程中發生錯誤，請稍後再試。";
      });
  },
});

export default authSlice.reducer;
