import { createContext, useContext, useEffect, useReducer, useCallback, useMemo, ReactNode, Dispatch } from "react";
import axios from "axios";
import { debounce } from "lodash";

import { useAuth } from "@/context/AuthContext";
import { useAxios } from "@/hooks/useAxios";

interface CartItem {
  _id?: string;
  cartId?: string;
  cartItemId?: string;
  productId: string;
  quantity: number;
  product?: {
    title: string;
    price: number;
    imageUrl: string;
    countInStock: number;
  };
}

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_CART_SUCCESS"; payload: CartItem[] }
  | { type: "SET_FAIL"; payload: string }
  | { type: "REMOVE_ITEM_SUCCESS"; payload: string }
  | { type: "UPDATE_QUANTITY_SUCCESS"; cartItemId: string; quantity: number }
  | { type: "CLEAR_CART_SUCCESS" };

  interface CartContextType extends CartState {
    totalQuantity: number;
    subtotal: number;
    getCart: () => Promise<void>;
    addToCart: (product: CartItem) => Promise<void>;
    removeFromCart: (cartItemId: string) => Promise<void>;
    changeQuantity: (cartItemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    dispatch: Dispatch<CartAction>;
  }

const INITIAL_STATE: CartState = {
  cart: [],
  isLoading: false,
  error: null,
};

export const CartContext = createContext<CartContextType | null>(null);

const CartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CART_SUCCESS":
      return { ...state, cart: action.payload, error: null };
    case "REMOVE_ITEM_SUCCESS":
      return { ...state, cart: state.cart.filter(item => item.cartItemId !== action.payload) };
    case "UPDATE_QUANTITY_SUCCESS":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartItemId === action.cartItemId ? { ...item, quantity: action.quantity } : item
        ),
      };
    case "CLEAR_CART_SUCCESS":
      return { ...state, cart: [] };
    case "SET_FAIL":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const useCartAxios = (url: string, method: 'GET' | 'POST' | 'DELETE' | 'PATCH') => {
  const { logout } = useAuth();
  return useAxios(
    url,
    { method, withCredentials: true },
    { 
      immediate: false,
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) logout();
      }
    }
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(CartReducer, INITIAL_STATE);
  const { logout, isAuthenticated } = useAuth();

  const { data, refresh: refreshCart } = useAxios("/cart",
    { withCredentials: true },
    { onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) logout();
    }
  });
  const { refresh: refreshAddToCart } = useCartAxios('/cart', 'POST');
  const { refresh: refreshRemoveFromCart } = useAxios(
    params => `/cart/${params?.id}`,
    { method: 'DELETE', withCredentials: true },
    { immediate: false }
  );
  const { refresh: refreshChangeQuantity } = useAxios(
    params => `/cart/${params?.id}`,
    { method: 'PATCH', withCredentials: true },
    { immediate: false }
  );
  const { refresh: refreshClearCart } = useCartAxios('/cart', 'DELETE');

  const handleError = (err: any) => {
    if (axios.isAxiosError(err))
      return err.response?.data?.message || "發生錯誤，請稍後再試";
    return "未知錯誤";
  };

  // 取得購物車資料
  const getCart = useCallback(async () => {
    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      dispatch({ type: "SET_FAIL", payload: null });

      await refreshCart();
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }, [refreshCart]);

  // 初始化購物車
  useEffect(() => {
    if (isAuthenticated) getCart();
    else {
      const localCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length === 0) localStorage.setItem("cart", JSON.stringify([]));
      else dispatch({ type: "SET_CART_SUCCESS", payload: localCart });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 更新購物車資料
  useEffect(() => {
    if (data?.cart) dispatch({ type: "SET_CART_SUCCESS", payload: data.cart });
  }, [data]);
  
  const addToCartLogic = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });

      if (!isAuthenticated) {
        // 未登入：將商品加入本地購物車
        const localCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
        // 檢查商品是否已存在，若存在則更新數量。
        const existingItemIndex = localCart.findIndex(item => item.productId === productId);
  
        if (existingItemIndex !== -1) localCart[existingItemIndex].quantity += quantity;
        else localCart.push({ productId, quantity });
  
        localStorage.setItem("cart", JSON.stringify(localCart));
        dispatch({ type: "SET_CART_SUCCESS", payload: localCart });
      } else {
        // 已登入：發送 API 新增商品至後端
        await refreshAddToCart({ productId, quantity });
        await getCart();
      }
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  };

  // 商品加入購物車
  const addToCartDebounced = debounce(async ({ productId, quantity }: CartItem) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await addToCartLogic(productId, quantity);
        resolve();
      } catch (err: any) {
        reject(err);
      }
    });
  }, 500);

  const addToCart = useCallback(async ({ productId, quantity }: CartItem) => {
    await addToCartDebounced({ productId, quantity });
  }, [addToCartDebounced]);

  // 後續登入，需同步本地購物車至後端。
  const syncLocalCartToServer = useCallback(async () => {
    if (!isAuthenticated) return;

    const localCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length === 0) return;

    try {
      dispatch({ type: "SET_FAIL", payload: null });

      // 一次性將 localStorage 內的商品同步加入至後端的購物車
      await Promise.all(localCart.map(item => 
        refreshAddToCart({ productId: item.productId, quantity: item.quantity })
      ));

      localStorage.removeItem("cart"); // 清除 localStorage，確保數據已同步
      await getCart();
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  }, [isAuthenticated, refreshAddToCart, getCart]);


  // 當使用者登入時，自動同步本地購物車
  useEffect(() => {
    if (isAuthenticated) {
      syncLocalCartToServer();
      getCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 商品移出購物車
  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });

      await refreshRemoveFromCart({ id: cartItemId });
      await getCart();
      dispatch({ type: "REMOVE_ITEM_SUCCESS", payload: cartItemId });
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  }, [refreshRemoveFromCart, getCart]);

  // 變更商品數量
  const changeQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });

      await refreshChangeQuantity({ id: cartItemId, quantity });
      await getCart();
      dispatch({ type: "UPDATE_QUANTITY_SUCCESS", cartItemId, quantity });
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  }, [refreshChangeQuantity, getCart]);

  // 清空購物車
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });

      await refreshClearCart();
      await getCart();
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  }, [refreshClearCart, getCart]);

  // 計算購物車中商品總數量
  const totalQuantity = useMemo(() => {
    if (!isAuthenticated) {
      const localCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      return localCart.reduce((total, item) => total + item.quantity, 0);
    }
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [isAuthenticated, state.cart]);
  
  // 計算購物車中商品總金額
  const subtotal = useMemo(() => state.cart.reduce((total, { product, quantity }) => total + (product?.price ?? 0) * quantity, 0), [state.cart]);

  const contextValue: CartContextType = { ...state, totalQuantity, subtotal, getCart, addToCart, removeFromCart, changeQuantity, clearCart, dispatch };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart 必須在 CartProvider 內被使用！");
  }
  return context;
};
