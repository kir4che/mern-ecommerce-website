import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useReducer,
  Dispatch,
  useMemo,
} from "react";
import { useAxios } from "@/hooks/useAxios";
import { AuthActionType, ErrorMessages } from "@/constants/actionTypes";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  user: User;
  message?: string;
}

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: "admin" | "user";
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
  login: async () => {
    throw new Error("login 尚未初始化");
  },
  logout: async () => {
    throw new Error("logout 尚未初始化");
  },
  dispatch: () => {
    throw new Error("dispatch 尚未初始化");
  },
};

export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

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
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

  // 同步用戶狀態到 localStorage
  useEffect(() => {
    if (!state.user) {
      localStorage.removeItem("user");
      return;
    }

    try {
      localStorage.setItem("user", JSON.stringify(state.user));
    } catch {
      dispatch({
        type: AuthActionType.LOGIN_FAIL,
        payload: ErrorMessages.STORAGE_FAIL
      });
    }
  }, [state.user]);

  // 登入方法
  const login = useCallback(async (
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<void> => {
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
  }, [loginRequest, loginData, isLoginLoading]);

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
  }, [logoutRequest, isLogoutLoading]);

  // 使用 useMemo 優化，只有當依賴項改變時才重新創建 context 值。
  const contextValue = useMemo(() => ({
    ...state,
    login,
    logout,
    dispatch,
  }), [state, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必須在 AuthProvider 內被使用！");
  }
  return context;
};
