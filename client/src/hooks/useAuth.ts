import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  login as loginAction,
  logout as logoutAction,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // 登入方法：封裝 dispatch login action，unwrap 可直接拋錯或取得 payload
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      return dispatch(loginAction({ email, password, rememberMe })).unwrap();
    },
    [dispatch] // 只在 dispatch 變動時重新建立 login 函式
  );

  // 登出方法：同樣透過 dispatch 執行 logout thunk
  const logout = useCallback(async () => {
    return dispatch(logoutAction()).unwrap();
  }, [dispatch]);

  // 回傳登入狀態與方法給組件使用
  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };
};

export type AuthHookReturn = ReturnType<typeof useAuth>;
