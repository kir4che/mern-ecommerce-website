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

// 處理錯誤訊息
const handleError = (err: any) => {
  if (axios.isAxiosError(err))
    return err.response?.data?.message || "伺服器發生錯誤，請稍後再試。";
  return "發生未知錯誤，請稍後再試。";
};

// 取得購物車內容
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
      } = getState() as RootState;

      const validateCartQuantities = (cart: CartItem[]) => {
        if (!Array.isArray(cart)) return [];

        return cart
          .map((item) => {
            const stock = item.product?.countInStock || 0;
            if (item.quantity > stock) {
              return { ...item, quantity: stock };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
      };

      if (isAuthenticated) {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          withCredentials: true,
        });
        const serverCart = res.data.cart || [];
        return validateCartQuantities(serverCart);
      } else {
        const localCart: CartItemInput[] = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );
        if (localCart.length === 0) return [];

        const productPromises = localCart.map((item) =>
          axios.get(
            `${process.env.REACT_APP_API_URL}/products/${item.productId}`
          )
        );

        const productResponses = await Promise.all(productPromises);

        const hydratedCart: CartItem[] = localCart.map((item, index) => {
          const productDetails = productResponses[index].data.product;
          return {
            ...item,
            _id: `${item.productId}_local`,
            cartId: "local_cart",
            product: productDetails,
          };
        });

        return validateCartQuantities(hydratedCart);
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// 同步本地購物車到後端
export const syncLocalCart = createAsyncThunk(
  "cart/syncLocalCart",
  async (_, { rejectWithValue }) => {
    try {
      const localCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as CartItemInput[];
      if (localCart.length === 0) return [];

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/sync`,
        { localCart },
        { withCredentials: true }
      );
      return res.data.cart || [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// 加入商品至購物車
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: CartItemInput,
    { getState, rejectWithValue }
  ) => {
    try {
      const {
        auth: { isAuthenticated },
        cart: { cart: currentCart },
      } = getState() as RootState;

      if (!Array.isArray(currentCart)) {
        return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");
      }

      if (isAuthenticated) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart`,
          { productId, quantity },
          { withCredentials: true }
        );
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          withCredentials: true,
        });
        return res.data.cart || [];
      } else {
        const newCart = [...currentCart];
        const existingItemIndex = newCart.findIndex(
          (item) => item.productId === productId
        );

        if (existingItemIndex !== -1) {
          const updatedItem = { ...newCart[existingItemIndex] };
          updatedItem.quantity += quantity;
          newCart[existingItemIndex] = updatedItem;
        } else {
          const productRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/products/${productId}`
          );
          const productDetails = productRes.data.product;
          newCart.push({
            productId,
            quantity,
            _id: `${productId}_local`,
            cartId: "local_cart",
            product: productDetails,
          });
        }
        return newCart;
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// 從購物車移除商品
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
        cart: { cart: currentCart },
      } = getState() as RootState;

      if (!Array.isArray(currentCart)) {
        return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");
      }

      if (isAuthenticated) {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/cart/${cartItemId}`,
          { withCredentials: true }
        );
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          withCredentials: true,
        });
        return res.data.cart || [];
      } else {
        // 本地端則用 _id 過濾
        return currentCart.filter((item) => item._id !== cartItemId);
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// 更新購物車商品數量
export const changeQuantity = createAsyncThunk(
  "cart/changeQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const {
        auth: { isAuthenticated },
        cart: { cart: currentCart },
      } = getState() as RootState;

      if (!Array.isArray(currentCart))
        return rejectWithValue("購物車狀態異常，請刷新頁面後再試。");

      if (isAuthenticated) {
        await axios.patch(
          `${process.env.REACT_APP_API_URL}/cart/${cartItemId}`,
          { quantity },
          { withCredentials: true }
        );
        const updatedCart = currentCart
          .map((item) =>
            item._id === cartItemId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);
        return updatedCart;
      } else {
        return currentCart
          .map((item) =>
            item._id === cartItemId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  }
);

// 清空購物車
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { isAuthenticated },
      } = getState() as RootState;
      if (isAuthenticated) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
          withCredentials: true,
        });
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
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
