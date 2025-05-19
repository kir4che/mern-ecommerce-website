import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "@/store";

interface CartItemInput {
  productId: string;
  quantity: number;
}

interface CartItem extends CartItemInput {
  _id: string;
  cartId: string;
  product: {
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

// 處理非同步邏輯：取得購物車內容
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    try {
      if (!isAuthenticated) {
        // 未登入：從本地取得購物車內容
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        // 從後端取得商品詳細資訊
        const cartWithDetails = await Promise.all(
          localCart.map(async (item: CartItemInput) => {
            return {
              productId: item.productId,
              quantity: item.quantity,
            };
          }),
        );
        return cartWithDetails;
      } else {
        // 已登入：從後端獲取購物車
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cart`,
          { withCredentials: true },
        );
        return response.data.cart || [];
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 同步本地購物車到後端
export const syncLocalCart = createAsyncThunk(
  "cart/syncLocalCart",
  async (_, { rejectWithValue }) => {
    try {
      const localCart = JSON.parse(
        localStorage.getItem("cart") || "[]",
      ) as CartItemInput[];
      if (localCart.length === 0) return [];

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/sync`,
        { localCart },
        { withCredentials: true },
      );

      // 清空本地購物車
      localStorage.setItem("cart", "[]");

      return response.data.cart || [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 加入商品至購物車
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { getState, rejectWithValue, dispatch },
  ) => {
    const state = getState() as RootState; // 當前 store 的所有狀態
    const isAuthenticated = state.auth.isAuthenticated;

    try {
      if (!isAuthenticated) {
        // 尚未登入：加入商品至本地購物車
        const localCart = JSON.parse(
          localStorage.getItem("cart") || "[]",
        ) as CartItemInput[];

        // 檢查商品是否已存在於本地購物車
        const existingItemIndex = localCart.findIndex(
          (item) => item.productId === productId,
        );

        // 更新商品數量或加入商品
        if (existingItemIndex !== -1)
          localCart[existingItemIndex].quantity += quantity;
        else localCart.push({ productId, quantity });

        localStorage.setItem("cart", JSON.stringify(localCart));

        // 重新取得購物車內容以更新 store
        return dispatch(fetchCart()).unwrap();
      } else {
        // 已登入：加入商品至後端購物車
        await axios.post(
          `${process.env.REACT_APP_API_URL}/cart`,
          { productId, quantity },
          { withCredentials: true },
        );
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/cart`,
          { withCredentials: true },
        );
        return response.data.cart || [];
      }
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 從購物車移除商品
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/${cartItemId}`,
        { withCredentials: true },
      );
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart`,
        { withCredentials: true },
      );
      return response.data.cart || [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 更新購物車商品數量
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/cart/${cartItemId}`,
        { quantity },
        { withCredentials: true },
      );
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/cart`,
        { withCredentials: true },
      );
      return response.data.cart || [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 清空購物車
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
        withCredentials: true,
      });
      return [];
    } catch (err: any) {
      return rejectWithValue(handleError(err));
    }
  },
);

// 使用 createSlice 建立 cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncLocalCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncLocalCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(syncLocalCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// 提供組件取得購物車內容的方式
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectTotalQuantity = (state: RootState) =>
  state.cart.cart.reduce((total, item) => total + item.quantity, 0);
export const selectSubtotal = (state: RootState) =>
  state.cart.cart.reduce(
    (total, item) => total + (item.quantity || 0) * (item.product?.price || 0),
    0,
  );

export default cartSlice.reducer;
