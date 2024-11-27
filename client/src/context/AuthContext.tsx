import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  Dispatch,
} from "react";
import axios from "axios";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGOUT_FAIL,
} from "@/constants/actionTypes";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  dispatch: Dispatch<any>;
}

const INITIAL_STATE: AuthContextType = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  login: async () => {
    throw new Error("login 尚未初始化");
  },
  logout: async () => {
    throw new Error("logout 尚未初始化");
  },
  dispatch: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

// 定義行爲 (action) 類型，並宣告這些 action 對 state 的影響。
const AuthReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, user: null, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, loading: false, error: null };
    case LOGIN_FAIL:
      return { ...state, user: null, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, loading: false, error: null };
    case LOGOUT_FAIL:
      return { ...state, user: null, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // user 一被更新，就將其存入 localStorage。
  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(state.user));
    } catch (error) {
      console.error("無法同步到 localStorage：", error.message);
    }
  }, [state.user]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const res = await axios.new(
        `${process.env.REACT_APP_API_URL}/user/login`,
        { email, password, rememberMe },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        const userInfo = res.data.user;
        dispatch({ type: LOGIN_SUCCESS, payload: userInfo });
      } else {
        dispatch({
          type: LOGIN_FAIL,
          payload: "使用者帳號或密碼不正確，請重新輸入！",
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: "使用者帳號或密碼不正確，請重新輸入！",
      });
      console.error("登入失敗：", error.message);
    }
  };

  const logout = async () => {
    dispatch({ type: LOGOUT });
    try {
      const res = await axios.new(
        `${process.env.REACT_APP_API_URL}/user/logout`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        localStorage.removeItem("user");
        dispatch({ type: LOGOUT });
      } else {
        dispatch({ type: LOGOUT_FAIL, payload: "登出失敗，請稍後再試！" });
      }
    } catch (error) {
      dispatch({ type: LOGOUT_FAIL, payload: "登出失敗，請稍後再試！" });
      console.error("登出失敗：", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
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
