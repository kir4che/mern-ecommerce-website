import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, Dispatch, ReactNode } from "react";

import { AUTH_ACTION_TYPE, ERROR_MESSAGES } from "@/constants/actionTypes";
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

interface AuthContextType extends AuthState {
  isAuthenticated: boolean; // 是否已登入
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  dispatch: Dispatch<AuthAction>;
}

type AuthAction = 
  | { type: typeof AUTH_ACTION_TYPE.LOGIN_REQUEST }
  | { type: typeof AUTH_ACTION_TYPE.LOGIN_SUCCESS; payload: User }
  | { type: typeof AUTH_ACTION_TYPE.LOGIN_FAIL; payload: string }
  | { type: typeof AUTH_ACTION_TYPE.LOGOUT }
  | { type: typeof AUTH_ACTION_TYPE.LOGOUT_FAIL; payload: string };

// 初始狀態：從 localStorage 中讀取使用者狀態
const INITIAL_STATE: AuthContextType = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  dispatch: () => {}
};

interface LoginResponse {
  user: User
  message?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AUTH_ACTION_TYPE.LOGIN_REQUEST:
      return { 
        ...state, 
        user: null, 
        loading: true, 
        error: null
      };
    case AUTH_ACTION_TYPE.LOGIN_SUCCESS:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null
      };
    case AUTH_ACTION_TYPE.LOGIN_FAIL:
      return { 
        ...state, 
        user: null, 
        loading: false,
        error: action.payload
      };
    case AUTH_ACTION_TYPE.LOGOUT:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null
      };
    case AUTH_ACTION_TYPE.LOGOUT_FAIL:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const { data: loginData, isLoading: isLoginLoading, refresh: loginRequest } = useAxios<LoginResponse>("/user/login",
    {
      method: "POST",
      withCredentials: true,
    },
    {
      immediate: false,  // 不立即執行請求
      onError: () => {
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_FAIL,
          payload: ERROR_MESSAGES.LOGIN_FAIL
        });
      }
    }
  );

  const { isLoading: isLogoutLoading, refresh: logoutRequest } = useAxios("/user/logout",
    {
      method: "POST",
      withCredentials: true,
    },
    {
      immediate: false,
      onError: () => {
        dispatch({ 
          type: AUTH_ACTION_TYPE.LOGOUT_FAIL, 
          payload: ERROR_MESSAGES.LOGOUT_FAIL
        });
      }
    }
  );

  useEffect(() => {
    // 同步用戶狀態到 localStorage
    if (state.user !== null) {
      try {
        localStorage.setItem("user", JSON.stringify(state.user));
      } catch (err: any) {
        dispatch({
          type: AUTH_ACTION_TYPE.LOGIN_FAIL,
          payload: ERROR_MESSAGES.STORAGE_FAIL
        });
      }
    } else {
      // 登出時清除 localStorage
      localStorage.removeItem("user");
    }
  }, [state.user]);

  // 登入方法
  const login = useCallback(async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    if (isLoginLoading) return;
    dispatch({ type: AUTH_ACTION_TYPE.LOGIN_REQUEST });
  
    try {
      await loginRequest({ email, password, rememberMe });
      dispatch({ type: AUTH_ACTION_TYPE.LOGIN_SUCCESS, payload: loginData.user });
      window.location.href = "/"; // 登入成功後重新導向首頁
    } catch {
      dispatch({
        type: AUTH_ACTION_TYPE.LOGIN_FAIL,
        payload: ERROR_MESSAGES.LOGIN_FAIL
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginLoading, loginRequest]);

  // 登出方法
  const logout = useCallback(async (): Promise<void> => {
    if (isLogoutLoading) return;

    try {
      await logoutRequest();
      dispatch({ type: AUTH_ACTION_TYPE.LOGOUT });
      window.location.href = "/";
    } catch {
      dispatch({ 
        type: AUTH_ACTION_TYPE.LOGOUT_FAIL, 
        payload: ERROR_MESSAGES.LOGOUT_FAIL
      });
    }
  }, [isLogoutLoading, logoutRequest]);

  const contextValue: AuthContextType = useMemo(() => ({
    ...state,
    isAuthenticated: state.user !== null, // 根據 user 是否存在判斷是否已登入
    login,
    logout,
    dispatch
  }), [state, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
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
