import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { authListenerMiddleware } from "@/store/middleware/authMiddleware";
import { cartListenerMiddleware } from "@/store/middleware/cartMiddleware";
import { apiSlice } from "@/store/slices/apiSlice";
import authReducer, { initializeAuth } from "@/store/slices/authSlice";
import guestCartReducer from "@/store/slices/guestCartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guestCart: guestCartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(
        // 優先執行
        authListenerMiddleware.middleware,
        cartListenerMiddleware.middleware
      )
      // RTK Query middleware 要加，query/mutation 才會正常運作。
      .concat(apiSlice.middleware),
});

store.dispatch(initializeAuth());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
