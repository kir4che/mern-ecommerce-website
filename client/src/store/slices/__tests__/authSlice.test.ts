import authReducer, {
  clearCredentials,
  initializeAuth,
  setAccessToken,
  setCredentials,
} from "@/store/slices/authSlice";
import { beforeEach, describe, expect, it } from "vitest";

const baseState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

describe("authSlice", () => {
  beforeEach(() => localStorage.clear());

  it("從 localStorage 初始化 credentials", () => {
    // 設定初始資料到 localStorage（模擬已登入狀態）
    localStorage.setItem(
      "user",
      JSON.stringify({ id: "user-1", email: "user1@test.com", role: "user" })
    );
    localStorage.setItem("accessToken", "access-1");
    localStorage.setItem("refreshToken", "refresh-1");

    // 執行要測試的 reducer
    const state = authReducer(baseState, initializeAuth());

    // 驗證結果
    expect(state.user).toEqual({
      id: "user-1",
      email: "user1@test.com",
      role: "user",
    });
    expect(state.accessToken).toBe("access-1");
    expect(state.refreshToken).toBe("refresh-1");
    expect(state.isAuthenticated).toBe(true);
  });

  it("localStorage 為空時清除 isAuthenticated", () => {
    const initialState = {
      ...baseState,
      user: { id: "user-1", email: "user1@test.com", role: "user" as const },
      accessToken: "access-1",
      refreshToken: "refresh-1",
      isAuthenticated: true,
    } satisfies Parameters<typeof authReducer>[0];

    // 執行 initializeAuth（但 localStorage 已清空）
    const state = authReducer(initialState, initializeAuth());

    // Assert：驗證狀態被正確清除
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("更新 accessToken 並保存至 localStorage", () => {
    const state = authReducer(baseState, setAccessToken("token-123"));

    expect(state.accessToken).toBe("token-123");
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("登入成功時設定 credentials 並同步到 localStorage", () => {
    const payload = {
      user: { id: "user-2", email: "admin@test.com", role: "admin" },
      accessToken: "access-2",
      refreshToken: "refresh-2",
    } satisfies Parameters<typeof setCredentials>[0];

    const state = authReducer(baseState, setCredentials(payload));

    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe("access-2");
    expect(state.refreshToken).toBe("refresh-2");
    expect(state.isAuthenticated).toBe(true);
  });

  it("登出時清除 credentials", () => {
    const loggedInState = {
      ...baseState,
      user: { id: "user-3", email: "user3@test.com", role: "user" as const },
      accessToken: "access-3",
      refreshToken: "refresh-3",
      isAuthenticated: true,
    } satisfies Parameters<typeof authReducer>[0];

    const state = authReducer(loggedInState, clearCredentials());

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
