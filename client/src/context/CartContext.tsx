import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  ReactNode,
  Dispatch,
} from "react";
import axios from "axios";
import { throttle } from "lodash";

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

export const CartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CART_SUCCESS":
      return { ...state, cart: action.payload, error: null };
    case "REMOVE_ITEM_SUCCESS":
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartItemId !== action.payload),
      };
    case "UPDATE_QUANTITY_SUCCESS":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartItemId === action.cartItemId
            ? { ...item, quantity: action.quantity }
            : item,
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(CartReducer, INITIAL_STATE);
  const { isAuthenticated } = useAuth();

  const { refresh: refreshGetCart } = useAxios(
    "/cart",
    { withCredentials: true },
    { immediate: false },
  );
  const { refresh: refreshAddToCart } = useAxios(
    "/cart",
    { method: "POST", withCredentials: true },
    { immediate: false },
  );
  const { refresh: refreshRemoveFromCart } = useAxios(
    (params) => `/cart/${params?.id}`,
    { method: "DELETE", withCredentials: true },
    { immediate: false },
  );
  const { refresh: refreshChangeQuantity } = useAxios(
    (params) => `/cart/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    { immediate: false },
  );
  const { refresh: refreshClearCart } = useAxios(
    "/cart",
    { method: "DELETE", withCredentials: true },
    { immediate: false },
  );

  const handleError = (err: any) => {
    if (axios.isAxiosError(err))
      return err.response?.data?.message || "伺服器發生錯誤，請稍後再試。";
    return "發生未知錯誤，請稍後再試。";
  };

  // 取得購物車資料
  const getCart = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    dispatch({ type: "SET_FAIL", payload: null });

    try {
      const res = await refreshGetCart();
      // 確保 res 和 res.cart 存在
      if (res && res.cart)
        dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
      // 若 res.cart 不存在，則設置為空陣列。
      else if (res) dispatch({ type: "SET_CART_SUCCESS", payload: [] });
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  };

  const getLocalCart = () =>
    JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];

  // 商品加入購物車處理邏輯
  const addToCartLogic = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });

      if (!isAuthenticated) {
        // 未登入：將商品加入本地購物車
        const localCart = getLocalCart();
        const existingItemIndex = localCart.findIndex(
          (item) => item.productId === productId,
        );
        if (existingItemIndex !== -1)
          localCart[existingItemIndex].quantity += quantity;
        else localCart.push({ productId, quantity });

        localStorage.setItem("cart", JSON.stringify(localCart));
        dispatch({ type: "SET_CART_SUCCESS", payload: localCart }); // 同步更新 state.cart
      } else {
        // 已登入：發送 API 新增商品至後端
        try {
          await refreshAddToCart({ productId, quantity });

          const res = await refreshGetCart();
          if (res && res.cart)
            dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
        } catch (err: any) {
          dispatch({ type: "SET_FAIL", payload: handleError(err) });

          try {
            const res = await refreshGetCart();
            if (res && res.cart)
              dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
          } catch (err: any) {
            dispatch({ type: "SET_FAIL", payload: handleError(err) });
          }
        }
      }
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  };

  const throttledAddToCartLogic = throttle(
    (productId: string, quantity: number) => {
      addToCartLogic(productId, quantity);
    },
    300, // 每 500ms 最多執行一次，避免使用者連續點擊造成錯誤。
    {
      leading: true, // 第一次點擊時立即執行（不需等待）
      trailing: false, // 節流結束後也不會執行，確保正確忽略節流期間的點擊。
    },
  );

  const addToCart = async ({ productId, quantity }: CartItem) => {
    return new Promise<void>((resolve) => {
      throttledAddToCartLogic(productId, quantity);
      resolve();
    });
  };

  // 後續登入，需同步本地購物車至後端。
  const syncLocalCartToServer = async () => {
    if (!isAuthenticated) return;

    const localCartData: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );

    // 如果本地購物車為空，則不需要同步。
    if (localCartData.length === 0) return;

    try {
      dispatch({ type: "SET_FAIL", payload: null });

      // 一次性將 localStorage 內的商品同步加入至後端的購物車
      await Promise.all(
        localCartData.map((item) =>
          refreshAddToCart({
            productId: item.productId,
            quantity: item.quantity,
          }),
        ),
      );
      await getCart();
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  };

  // 登入時初始化購物車，並同步本地購物車至後端，且清空本地購物車。
  useEffect(() => {
    getCart();

    // 同步本地購物車到服務器，只有成功同步後才清空本地購物車。
    if (isAuthenticated) {
      syncLocalCartToServer()
        .then(() => localStorage.removeItem("cart"))
        .catch((err: any) => {
          dispatch({
            type: "SET_FAIL",
            payload: "同步本地購物車失敗，請稍後再試。",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // 商品移出購物車
  const removeFromCart = async (cartItemId: string) => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });
      dispatch({ type: "REMOVE_ITEM_SUCCESS", payload: cartItemId });

      try {
        await refreshRemoveFromCart({ id: cartItemId });

        const res = await refreshGetCart();
        if (res && res.cart) {
          dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
        }
      } catch (err: any) {
        dispatch({ type: "SET_FAIL", payload: handleError(err) });

        try {
          const res = await refreshGetCart();
          if (res && res.cart)
            dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
        } catch (err: any) {
          dispatch({ type: "SET_FAIL", payload: handleError(err) });
        }
      }
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  };

  // 使用節流處理數量變更，避免快速點擊導致的錯誤。
  const throttledChangeQuantity = throttle(
    async (cartItemId: string, quantity: number) => {
      try {
        dispatch({ type: "SET_FAIL", payload: null });
        dispatch({ type: "UPDATE_QUANTITY_SUCCESS", cartItemId, quantity });

        try {
          await refreshChangeQuantity(
            { id: cartItemId },
            { data: { quantity } },
          );

          const res = await refreshGetCart();
          if (res && res.cart)
            dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
        } catch (err: any) {
          dispatch({ type: "SET_FAIL", payload: handleError(err) });

          // 嘗試重新取得購物車以同步狀態
          try {
            const res = await refreshGetCart();
            if (res && res.cart)
              dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
          } catch (err: any) {
            dispatch({ type: "SET_FAIL", payload: handleError(err) });
          }
        }
      } catch (err: any) {
        dispatch({ type: "SET_FAIL", payload: handleError(err) });
      }
    },
    500,
    { leading: true, trailing: false },
  );

  // 變更商品數量
  const changeQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return;

    dispatch({ type: "UPDATE_QUANTITY_SUCCESS", cartItemId, quantity });

    return throttledChangeQuantity(cartItemId, quantity);
  };

  // 清空購物車
  const clearCart = async () => {
    try {
      dispatch({ type: "SET_FAIL", payload: null });
      dispatch({ type: "CLEAR_CART_SUCCESS" });

      try {
        await refreshClearCart();

        const res = await refreshGetCart();
        if (res && res.cart)
          dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
      } catch (err: any) {
        dispatch({ type: "SET_FAIL", payload: handleError(err) });

        try {
          const res = await refreshGetCart();
          if (res && res.cart)
            dispatch({ type: "SET_CART_SUCCESS", payload: res.cart });
        } catch (err: any) {
          dispatch({ type: "SET_FAIL", payload: handleError(err) });
        }
      }
    } catch (err: any) {
      dispatch({ type: "SET_FAIL", payload: handleError(err) });
    }
  };

  // 計算購物車中商品總數量
  const totalQuantity = useMemo(() => {
    const localCart = getLocalCart();
    return (isAuthenticated ? state.cart : localCart).reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [state.cart, isAuthenticated]);

  // 計算購物車中商品總金額
  const subtotal = useMemo(() => {
    return state.cart.reduce(
      (total, { product, quantity }) =>
        total + (product?.price ?? 0) * quantity,
      0,
    );
  }, [state.cart]);

  const contextValue: CartContextType = {
    ...state,
    totalQuantity,
    subtotal,
    getCart,
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    dispatch,
  };

  return (
    <CartContext.Provider value={contextValue} data-testid="cart-provider">
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart 必須在 CartProvider 內被使用！");
  }
  return context;
};
