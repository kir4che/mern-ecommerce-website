import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, Dispatch, ReactNode } from "react";

import { AuthActionType, ErrorMessages } from "@/constants/actionTypes";
import { useAxios } from "@/hooks/useAxios";

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  dispatch: Dispatch<AuthAction>;
}

type AuthAction = 
  | { type: typeof AuthActionType.LOGIN_REQUEST }
  | { type: typeof AuthActionType.LOGIN_SUCCESS; payload: User }
  | { type: typeof AuthActionType.LOGIN_FAIL; payload: string }
  | { type: typeof AuthActionType.LOGOUT }
  | { type: typeof AuthActionType.LOGOUT_FAIL; payload: string };

// 初始狀態：從 localStorage 中讀取使用者狀態
const INITIAL_STATE: AuthContextType = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
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
    case AuthActionType.LOGIN_REQUEST:
      return { 
        ...state, 
        user: null, 
        loading: true, 
        error: null
      };
    case AuthActionType.LOGIN_SUCCESS:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null
      };
    case AuthActionType.LOGIN_FAIL:
      return { 
        ...state, 
        user: null, 
        loading: false,
        error: action.payload
      };
    case AuthActionType.LOGOUT:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null
      };
    case AuthActionType.LOGOUT_FAIL:
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

  const { 
    refresh: loginRequest, 
    data: loginData,
    isLoading: isLoginLoading 
  } = useAxios<LoginResponse>(
    "/user/login",
    {
      method: "POST",
      withCredentials: true,
    },
    {
      immediate: false,  // 不立即執行請求
      onError: () => {
        dispatch({
          type: AuthActionType.LOGIN_FAIL,
          payload: ErrorMessages.LOGIN_FAIL
        });
      }
    }
  );

  const { 
    refresh: logoutRequest,
    isLoading: isLogoutLoading 
  } = useAxios(
    "/user/logout",
    {
      method: "POST",
      withCredentials: true,
    },
    {
      immediate: false,
      onError: () => {
        dispatch({ 
          type: AuthActionType.LOGOUT_FAIL, 
          payload: ErrorMessages.LOGOUT_FAIL
        });
      }
    }
  );

  useEffect(() => {
    // 同步用戶狀態到 localStorage
    if (state.user !== null) {
      try {
        localStorage.setItem("user", JSON.stringify(state.user));
      } catch (error) {
        dispatch({
          type: AuthActionType.LOGIN_FAIL,
          payload: ErrorMessages.STORAGE_FAIL
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
    dispatch({ type: AuthActionType.LOGIN_REQUEST });
  
    try {
      await loginRequest({
        data: { email, password, rememberMe }
      });
  
      if (loginData?.user) {
        dispatch({
          type: AuthActionType.LOGIN_SUCCESS,
          payload: loginData.user
        });
      }
    } catch {
      dispatch({
        type: AuthActionType.LOGIN_FAIL,
        payload: ErrorMessages.LOGIN_FAIL
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginLoading, loginRequest]);

  // 登出方法
  const logout = useCallback(async (): Promise<void> => {
    if (isLogoutLoading) return;

    try {
      await logoutRequest();
      dispatch({ type: AuthActionType.LOGOUT });
    } catch {
      dispatch({ 
        type: AuthActionType.LOGOUT_FAIL, 
        payload: ErrorMessages.LOGOUT_FAIL
      });
    }
  }, [isLogoutLoading, logoutRequest]);

  const contextValue: AuthContextType = useMemo(() => ({
    ...state,
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
