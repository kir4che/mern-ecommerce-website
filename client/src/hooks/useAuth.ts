import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useLoginMutation, useLogoutMutation } from "@/store/slices/apiSlice";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loginMutation, loginState] = useLoginMutation();
  const [logoutMutation, logoutState] = useLogoutMutation();

  const getErrorMessage = useCallback(
    (
      error: FetchBaseQueryError | SerializedError | undefined
    ): string | null => {
      if (!error) return null;
      if ("status" in error) {
        const data = error.data as { message?: string } | undefined;
        return data?.message ?? "登入失敗，請稍後再試。";
      }
      return error.message ?? "登入失敗，請稍後再試。";
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const payload = await loginMutation({
        email,
        password,
        rememberMe,
      }).unwrap();
      dispatch(
        setCredentials({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        })
      );
      return payload;
    },
    [dispatch, loginMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } finally {
      dispatch(clearCredentials());
    }
  }, [dispatch, logoutMutation]);

  const isLoading = loginState.isLoading || logoutState.isLoading;
  const error = useMemo(
    () => getErrorMessage(loginState.error ?? logoutState.error),
    [getErrorMessage, loginState.error, logoutState.error]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};

export type AuthHookReturn = ReturnType<typeof useAuth>;
