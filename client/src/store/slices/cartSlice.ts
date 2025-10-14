import axios from "axios";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import type { CartItem, CartItemInput } from "@/types/cart";

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  isLoading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Missing environment variable: VITE_API_URL");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const toErrorMessage = (
  err: unknown,
  fallback: string = "伺服器發生錯誤，請稍後再試。"
) => {
  if (axios.isAxiosError(err)) return err.response?.data?.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
};

const readLocalCart = (): CartItemInput[] => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

const validateCartQuantities = (cart: CartItem[]) => {
  if (!Array.isArray(cart)) return [];

  return cart.reduce<CartItem[]>((acc, item) => {
    const stock = Math.max(item.product?.countInStock ?? 0, 0);
    const desiredQuantity = Math.max(item.quantity ?? 0, 0);
    const quantity = Math.min(desiredQuantity, stock);

    if (quantity > 0) {
      acc.push({ ...item, quantity });
    }

    return acc;
  }, []);
};

const fetchServerCart = async (): Promise<CartItem[]> => {
  const { data } = await api.get("/cart");
  const serverCart = (data?.cart ?? []) as CartItem[];
  return validateCartQuantities(serverCart);
};

const hydrateLocalCart = async (
  localCart: CartItemInput[]
): Promise<CartItem[]> => {
  if (!Array.isArray(localCart) || localCart.length === 0) return [];

  const productResponses = await Promise.all(
    localCart.map((item) => api.get(`/products/${item.productId}`))
  );

  const hydrated = localCart.reduce<CartItem[]>((acc, item, index) => {
    const productDetails = productResponses[index]?.data?.product;
    if (!productDetails) return acc;

    acc.push({
      ...item,
      _id: `${item.productId}_local`,
      cartId: "local_cart",
      product: productDetails,
    });

    return acc;
  }, []);

  return validateCartQuantities(hydrated);
};

type CartThunkConfig = {
  state: RootState;
  rejectValue: string;
};

// 取得購物車內容
export const fetchCart = createAsyncThunk<CartItem[], void, CartThunkConfig>(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
      } = getState();

      if (isAuthenticated) {
        return await fetchServerCart();
      }

      const localCart = readLocalCart();
      if (localCart.length === 0) return [];

      return await hydrateLocalCart(localCart);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

// 同步本地購物車到後端
export const syncLocalCart = createAsyncThunk<
  CartItem[],
  void,
  CartThunkConfig
>("cart/syncLocalCart", async (_, { rejectWithValue }) => {
  try {
    const localCart = readLocalCart();

    if (localCart.length === 0) return [];

    const { data } = await api.post("/cart/sync", { localCart });
    const syncedCart = (data?.cart ?? []) as CartItem[];
    return validateCartQuantities(syncedCart);
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

// 加入商品至購物車
export const addToCart = createAsyncThunk<
  CartItem[],
  CartItemInput,
  CartThunkConfig
>(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
        cart: { cart: currentCart },
      } = getState();

      if (!Array.isArray(currentCart)) {
        return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");
      }

      if (isAuthenticated) {
        await api.post("/cart", { productId, quantity });
        return await fetchServerCart();
      }

      const existingIndex = currentCart.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex !== -1) {
        const updatedCart = currentCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return validateCartQuantities(updatedCart);
      }

      const { data: productData } = await api.get(`/products/${productId}`);
      const productDetails = productData?.product;

      if (!productDetails) {
        return rejectWithValue("找不到商品資訊，請稍後再試。");
      }

      const newCart = [
        ...currentCart,
        {
          productId,
          quantity,
          _id: `${productId}_local`,
          cartId: "local_cart",
          product: productDetails,
        },
      ];

      return validateCartQuantities(newCart);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

// 從購物車移除商品
export const removeFromCart = createAsyncThunk<
  CartItem[],
  string,
  CartThunkConfig
>("cart/removeFromCart", async (cartItemId, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { isAuthenticated },
      cart: { cart: currentCart },
    } = getState();

    if (!Array.isArray(currentCart)) {
      return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");
    }

    if (isAuthenticated) {
      await api.delete(`/cart/${cartItemId}`);
      return await fetchServerCart();
    }

    return currentCart.filter((item) => item._id !== cartItemId);
  } catch (err) {
    return rejectWithValue(toErrorMessage(err));
  }
});

// 更新購物車商品數量
export const changeQuantity = createAsyncThunk<
  CartItem[],
  { cartItemId: string; quantity: number },
  CartThunkConfig
>(
  "cart/changeQuantity",
  async ({ cartItemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
        cart: { cart: currentCart },
      } = getState();

      if (!Array.isArray(currentCart)) {
        return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");
      }

      if (isAuthenticated) {
        await api.patch(`/cart/${cartItemId}`, { quantity });
        return await fetchServerCart();
      }

      const updatedCart = currentCart.map((item) =>
        item._id === cartItemId ? { ...item, quantity } : item
      );
      return validateCartQuantities(updatedCart);
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

// 清空購物車
export const clearCart = createAsyncThunk<CartItem[], void, CartThunkConfig>(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
      } = getState();
      if (isAuthenticated) {
        await api.delete("/cart");
      }
      return [];
    } catch (err) {
      return rejectWithValue(toErrorMessage(err));
    }
  }
);

const cartActionPending = isAnyOf(
  fetchCart.pending,
  syncLocalCart.pending,
  addToCart.pending,
  removeFromCart.pending,
  changeQuantity.pending,
  clearCart.pending
);

const cartActionRejected = isAnyOf(
  fetchCart.rejected,
  syncLocalCart.rejected,
  addToCart.rejected,
  removeFromCart.rejected,
  changeQuantity.rejected,
  clearCart.rejected
);

const cartActionFulfilled = isAnyOf(
  fetchCart.fulfilled,
  syncLocalCart.fulfilled,
  addToCart.fulfilled,
  removeFromCart.fulfilled,
  changeQuantity.fulfilled,
  clearCart.fulfilled
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(cartActionPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(cartActionRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addMatcher(cartActionFulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectTotalQuantity = (state: RootState) =>
  (state.cart.cart || []).reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
export const selectSubtotal = (state: RootState) =>
  (state.cart.cart || []).reduce(
    (total, item) => total + (item.quantity || 0) * (item.product?.price || 0),
    0
  );

export default cartSlice.reducer;
