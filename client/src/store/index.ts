import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer, { initializeAuth } from "@/store/slices/authSlice";
import cartReducer, { fetchCart } from "@/store/slices/cartSlice";
import { authListenerMiddleware } from "@/store/middleware/authMiddleware";
import { cartListenerMiddleware } from "@/store/middleware/cartMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  // prepend：優先執行 cartListenerMiddleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      authListenerMiddleware.middleware,
      cartListenerMiddleware.middleware
    ),
});

// 初始化驗證和購物車狀態
store.dispatch(initializeAuth());
store.dispatch(fetchCart());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
