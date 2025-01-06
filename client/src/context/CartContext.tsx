import { createContext, useContext, useEffect, useReducer, useCallback, useMemo, ReactNode, Dispatch } from "react";

import { useAxios } from "@/hooks/useAxios";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  totalQuantity: number;
  loading: boolean;
  error: string | null;
  showTooltip: boolean;
};

type CartAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_CART_SUCCESS'; payload: CartItem[] }
  | { type: 'ADD_ITEM_SUCCESS'; payload: CartItem }
  | { type: 'REMOVE_ITEM_SUCCESS'; payload: string }
  | { type: 'UPDATE_QUANTITY_SUCCESS'; productId: string; quantity: number }
  | { type: 'CLEAR_CART_SUCCESS' }
  | { type: 'SET_FAIL'; payload: string }
  | { type: 'SET_SHOW_TOOLTIP'; payload: boolean };

interface CartContextType extends CartState {
  getCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  changeQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  dispatch: Dispatch<CartAction>;
}

const INITIAL_STATE: CartContextType = {
  cart: [],
  totalQuantity: 0,
  loading: false,
  error: null,
  showTooltip: false,
  getCart: () => Promise.resolve(),
  addToCart: () => Promise.resolve(),
  removeFromCart: () => Promise.resolve(),
  changeQuantity: () => Promise.resolve(),
  clearCart: () => Promise.resolve(),
  dispatch: () => {}
};

export const CartContext = createContext<CartContextType>(INITIAL_STATE);

const CartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_CART_SUCCESS':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'ADD_ITEM_SUCCESS':
      return { ...state, cart: [...state.cart, action.payload], loading: false, error: null };
    case 'REMOVE_ITEM_SUCCESS':
      return { ...state, cart: state.cart.filter(item => item.productId !== action.payload), loading: false, error: null };
    case 'UPDATE_QUANTITY_SUCCESS':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
        loading: false,
        error: null,
      };
    case 'CLEAR_CART_SUCCESS':
      return { ...state, cart: [], loading: false, error: null };
    case 'SET_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SHOW_TOOLTIP':
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

  const { data, refresh: refreshCart } = useCartAxios('/cart', 'GET');
  const { refresh: refreshAddToCart } = useCartAxios('/cart', 'POST');
  const { refresh: refreshRemoveFromCart } = useCartAxios('', 'DELETE');
  const { refresh: refreshChangeQuantity } = useCartAxios('', 'PATCH');
  const { refresh: refreshClearCart } = useCartAxios('/cart', 'DELETE');

  // 初始化購物車
  useEffect(() => {
    getCart();
  }, []);

  // 更新購物車資料
  useEffect(() => {
    if (data?.cart) dispatch({ type: 'SET_CART_SUCCESS', payload: data.cart });
  }, [data]);

  // 取得購物車資料
  const getCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await refreshCart();
    } catch (error) {
      dispatch({ type: 'SET_FAIL', payload: error.message });
    }
  }, [refreshCart]);

  // 商品加入購物車
  const addToCart = useCallback(async (product: CartItem) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await refreshAddToCart({ data: product });
      dispatch({ type: 'ADD_ITEM_SUCCESS', payload: product });
      dispatch({ type: 'SET_SHOW_TOOLTIP', payload: true });
      setTimeout(() => {
        dispatch({ type: 'SET_SHOW_TOOLTIP', payload: false });
      }, 2000);
    } catch (error) {
      dispatch({ type: 'SET_FAIL', payload: error.message });
    }
  }, [refreshAddToCart]);

  // 商品移出購物車
  const removeFromCart = useCallback(async (cartItemId: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await refreshRemoveFromCart({ url: `/cart/${cartItemId}` });
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: cartItemId });
      getCart();
    } catch (error) {
      dispatch({ type: 'SET_FAIL', payload: error.message });
    }
  }, [refreshRemoveFromCart, getCart]);

  // 變更商品數量
  const changeQuantity = useCallback(async (productId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await refreshChangeQuantity({ url: `/cart/${productId}`, data: { quantity } });
      dispatch({ type: 'UPDATE_QUANTITY_SUCCESS', productId, quantity });
      getCart();
    } catch (error) {
      dispatch({ type: 'SET_FAIL', payload: error.message });
    }
  }, [refreshChangeQuantity, getCart]);

  // 清空購物車
  const clearCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await refreshClearCart();
      dispatch({ type: 'CLEAR_CART_SUCCESS' });
      getCart();
    } catch (error) {
      dispatch({ type: 'SET_FAIL', payload: error.message });
    }
  }, [refreshClearCart, getCart]);

  // 計算購物車中商品總數量
  const totalQuantity = useMemo(() => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  const contextValue: CartContextType = useMemo(() => ({
    ...state,
    totalQuantity,
    getCart,
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    dispatch
  }), [state, totalQuantity, getCart, addToCart, removeFromCart, changeQuantity, clearCart]);

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart 必須在 CartProvider 內被使用！");
  }
  return context;
};
