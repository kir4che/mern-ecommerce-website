import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { useAxios } from "@/hooks/useAxios";

interface User {
  readonly id: string;
  readonly email: string;
  readonly role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "LOGOUT_FAIL"; payload: string };

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    case "LOGIN_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT_SUCCESS":
      return { user: null, loading: false, error: null };
    case "LOGOUT_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = JSON.parse(localStorage.getItem("user") || "null");

  const [state, dispatch] = useReducer(authReducer, {
    user: initialUser,
    loading: false,
    error: null,
  });

  const { refresh: loginRequest } = useAxios(
    "/user/login",
    { method: "POST", withCredentials: true },
    { immediate: false },
  );
  const { refresh: logoutRequest } = useAxios(
    "/user/logout",
    { method: "POST" },
    { immediate: false },
  );

  // 將 user 存入 localStorage
  useEffect(() => {
    if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    else localStorage.removeItem("user");
  }, [state.user]);

  // 登入
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      dispatch({ type: "LOGIN_REQUEST" });
      try {
        const res = await loginRequest({ email, password, rememberMe });
        if (res?.success && res?.user)
          dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
        else
          dispatch({
            type: "LOGIN_FAIL",
            payload: res?.message || "登入失敗，請稍後再試。",
          });
      } catch {
        dispatch({
          type: "LOGIN_FAIL",
          payload: "登入過程中發生錯誤，請稍後再試。",
        });
      }
    },
    [loginRequest],
  );

  // 登出
  const logout = useCallback(async () => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const res = await logoutRequest();
      if (res.success) dispatch({ type: "LOGOUT_SUCCESS" });
      else dispatch({ type: "LOGOUT_FAIL", payload: res.message });
    } catch {
      dispatch({
        type: "LOGOUT_FAIL",
        payload: "登出過程中發生錯誤，請稍後再試。",
      });
    }
  }, [logoutRequest]);

  return (
    <AuthContext.Provider
      value={{ ...state, isAuthenticated: Boolean(state.user), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth 必須在 AuthProvider 內被使用！");
  }
  return context;
};
