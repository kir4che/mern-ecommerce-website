import { createContext, useContext, useEffect, useReducer, useCallback, useMemo, ReactNode, Dispatch } from "react";

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
  showTooltip: boolean;
}

type CartAction =
  | { type: "SET_isLoading"; payload: boolean }
  | { type: "SET_CART_SUCCESS"; payload: CartItem[] }
  | { type: "SET_FAIL"; payload: string }
  | { type: "REMOVE_ITEM_SUCCESS"; payload: string }
  | { type: "UPDATE_QUANTITY_SUCCESS"; cartItemId: string; quantity: number }
  | { type: "CLEAR_CART_SUCCESS" }
  | { type: "SET_SHOW_TOOLTIP"; payload: boolean };

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
  showTooltip: false,
};

export const CartContext = createContext<CartContextType | null>(null);

const CartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_isLoading":
      return { ...state, isLoading: action.payload };
    case "SET_CART_SUCCESS":
      return { ...state, cart: action.payload, error: null };
    case "REMOVE_ITEM_SUCCESS":
      return { ...state, cart: state.cart.filter((item) => item.cartItemId !== action.payload) };
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
    case "SET_SHOW_TOOLTIP":
      return { ...state, showTooltip: action.payload };
    default:
      return state;
  }
};

const useCartAxios = (url: string, method: 'GET' | 'POST' | 'DELETE' | 'PATCH') => {
  return useAxios(url, { method, withCredentials: true }, { immediate: false });
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(CartReducer, INITIAL_STATE);
  const { logout, isAuthenticated } = useAuth();

  const { data, refresh: refreshCart } = useAxios("/cart",
    { method: "GET", withCredentials: true },
    { onError: () => logout() }
  );
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

  // 取得購物車資料
  const getCart = useCallback(async () => {
    try {
      dispatch({ type: "SET_isLoading", payload: true });
      await refreshCart();
    } catch (error) {
      dispatch({ type: "SET_FAIL", payload: error.message });
    } finally {
      dispatch({ type: "SET_isLoading", payload: false });
    }
  }, [refreshCart]);

  // 初始化購物車
  useEffect(() => {
    if (isAuthenticated) getCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 更新購物車資料
  useEffect(() => {
    if (data?.cart) dispatch({ type: "SET_CART_SUCCESS", payload: data.cart });
  }, [data]);

  // 商品加入購物車
  const addToCart = useCallback(async ({ productId, quantity }: CartItem) => {
    try {
      await refreshAddToCart({ productId, quantity });
      await getCart();
      dispatch({ type: "SET_SHOW_TOOLTIP", payload: true });
      setTimeout(() => dispatch({ type: "SET_SHOW_TOOLTIP", payload: false }), 2000);
    } catch (error) {
      dispatch({ type: "SET_FAIL", payload: error.message });
    }
  }, [refreshAddToCart, getCart]);

  // 商品移出購物車
  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      await refreshRemoveFromCart({ id: cartItemId });
      await getCart();
      dispatch({ type: "REMOVE_ITEM_SUCCESS", payload: cartItemId });
    } catch (error) {
      dispatch({ type: "SET_FAIL", payload: error.message });
    }
  }, [refreshRemoveFromCart, getCart]);

  // 變更商品數量
  const changeQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    try {
      await refreshChangeQuantity({ id: cartItemId, quantity });
      await getCart();
      dispatch({ type: "UPDATE_QUANTITY_SUCCESS", cartItemId, quantity });
    } catch (error) {
      dispatch({ type: "SET_FAIL", payload: error.message });
    }
  }, [refreshChangeQuantity, getCart]);

  // 清空購物車
  const clearCart = useCallback(async () => {
    try {
      await refreshClearCart();
      dispatch({ type: "CLEAR_CART_SUCCESS" });
    } catch (error) {
      dispatch({ type: "SET_FAIL", payload: error.message });
    }
  }, [refreshClearCart]);

  // 計算購物車中商品總數量、小計
  const totalQuantity = useMemo(() => state.cart.reduce((total, item) => total + item.quantity, 0), [state.cart]);
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
