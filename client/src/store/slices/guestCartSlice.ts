import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import type { CartItemInput } from "@/types";

interface GuestCartState {
  items: CartItemInput[];
  hasShownLoginPrompt: boolean;
}

// 從 localStorage 還原購物車
const loadFromLocalStorage = (): CartItemInput[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const initialState: GuestCartState = {
  items: loadFromLocalStorage(),
  hasShownLoginPrompt: false,
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    // 加入商品或累加數量
    addItem(state, action: PayloadAction<CartItemInput>) {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) existing.quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    // 移除商品
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    // 更新商品數量
    changeItemQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) item.quantity = action.payload.quantity;
    },
    // 清空購物車
    clearItems(state) {
      state.items = [];
    },
    // 覆蓋整個購物車（登入同步前的本地購物車資料）
    setItems(state, action: PayloadAction<CartItemInput[]>) {
      state.items = action.payload;
    },
    // 標記已顯示登入提示
    markLoginPromptShown(state) {
      state.hasShownLoginPrompt = true;
    },
    // 重置登入提示狀態（登出時）
    resetLoginPrompt(state) {
      state.hasShownLoginPrompt = false;
    },
  },
});

export const {
  addItem,
  removeItem,
  changeItemQuantity,
  clearItems,
  setItems,
  markLoginPromptShown,
  resetLoginPrompt,
} = guestCartSlice.actions;

export const selectGuestItems = (state: RootState) => state.guestCart.items;
export const selectHasShownLoginPrompt = (state: RootState) =>
  state.guestCart.hasShownLoginPrompt;

export default guestCartSlice.reducer;
