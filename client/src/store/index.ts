import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import {
  cartListenerMiddleware,
  initializeCart,
} from "@/store/middleware/cartMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  // prepend：優先執行 cartListenerMiddleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(cartListenerMiddleware.middleware),
});

// 初始化購物車
store.dispatch(initializeCart());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
