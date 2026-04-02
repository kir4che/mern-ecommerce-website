import { debounce } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  apiSlice,
  useAddCartItemMutation,
  useClearCartItemsMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "@/store/slices/apiSlice";
import {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
  selectGuestItems,
} from "@/store/slices/guestCartSlice";
import type { CartItem, Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { getErrorStatus } from "@/utils/getErrorMessage";
import {
  FREE_SHIPPING_THRESHOLD,
  calculateShippingFee,
  getRemainingForFreeShipping,
  getShippingProgress,
  isFreeShipping,
} from "@/utils/shipping";

const LOCAL_CART_ID_SUFFIX = "_local";

const extractProductIdFromCartItemId = (
  cartItemId: string,
  fallbackId?: string
): string => {
  if (cartItemId.endsWith(LOCAL_CART_ID_SUFFIX))
    return cartItemId.slice(0, -LOCAL_CART_ID_SUFFIX.length);
  return fallbackId ?? cartItemId;
};

export const useCart = () => {
  const dispatch = useAppDispatch();

  const removingIdSetRef = useRef<Set<string>>(new Set());
  const [pendingRemovalIds, setPendingRemovalIds] = useState<Set<string>>(
    new Set()
  );

  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const guestItems = useAppSelector(selectGuestItems);

  const {
    data: serverCartData,
    isLoading: serverLoading,
    error: serverError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [addCartItem] = useAddCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [clearCartItems] = useClearCartItemsMutation();

  const debouncedUpdateQuantity = useMemo(
    () =>
      debounce(async (cartItemId: string, quantity: number) => {
        try {
          await updateCartItemQuantity({ cartItemId, quantity }).unwrap();
        } catch (err: unknown) {
          console.error("更新購物車數量失敗:", err);
        }
      }, 500),
    [updateCartItemQuantity]
  );

  // 當使用者離開此頁面時，取消未發送的延遲請求。
  useEffect(() => {
    return () => {
      debouncedUpdateQuantity.cancel();
    };
  }, [debouncedUpdateQuantity]);

  const guestCart = useAppSelector((state: RootState): CartItem[] => {
    return guestItems.reduce<CartItem[]>((acc, item) => {
      const product = apiSlice.endpoints.getProductById.select(item.productId)(
        state
      ).data?.product;
      if (product) {
        acc.push({
          _id: `${item.productId}${LOCAL_CART_ID_SUFFIX}`,
          cartId: "local_cart",
          productId: item.productId,
          quantity: item.quantity,
          product,
        });
      }
      return acc;
    }, []);
  });

  // 同步合併購物車
  const mergedCart: CartItem[] = useMemo(() => {
    if (!isAuthenticated) return guestCart;

    const serverItems = serverCartData?.cart ?? [];
    const mergedMap = new Map(
      serverItems.map((item) => [item.productId, { ...item }])
    );

    guestCart.forEach((localItem) => {
      const existing = mergedMap.get(localItem.productId);
      if (existing) {
        existing.quantity += localItem.quantity; // 相同的商品就把數量相加
      } else {
        mergedMap.set(localItem.productId, localItem); // 不同的商品就直接新增
      }
    });

    return Array.from(mergedMap.values());
  }, [isAuthenticated, serverCartData?.cart, guestCart]);

  // 透過商品 id 去後端找出對應的「購物車項目 id」
  const getServerCartItemId = useCallback(
    (productId: string) => {
      return serverCartData?.cart.find((item) => item.productId === productId)
        ?._id;
    },
    [serverCartData?.cart]
  );

  // 最終要顯示在畫面上的購物車
  const cart: CartItem[] = useMemo(
    () =>
      mergedCart.filter(
        (item) =>
          !pendingRemovalIds.has(item._id) &&
          !pendingRemovalIds.has(item.productId)
      ),
    [mergedCart, pendingRemovalIds]
  );

  const isLoading = isAuthenticated && serverLoading;
  const error =
    isAuthenticated && serverError ? "無法取得購物車內容，請稍後再試。" : null;

  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price ?? 0),
        0
      ),
    [cart]
  );

  // 計算運費與免運提示訊息
  const shippingInfo = useMemo(() => {
    const freeShipping = isFreeShipping(subtotal);
    const diff = getRemainingForFreeShipping(subtotal);
    const progress = getShippingProgress(subtotal);
    const shippingFee = calculateShippingFee(subtotal);

    let message = `全館滿 NT$${addComma(FREE_SHIPPING_THRESHOLD)} 即可享免運費！`;
    if (freeShipping && subtotal > 0)
      message = `已達 NT$${addComma(FREE_SHIPPING_THRESHOLD)} 最低免運門檻！`;
    else if (!freeShipping && subtotal > 0)
      message = `再湊 NT$${addComma(diff)} 元即可享免運費！`;

    return {
      isFreeShipping: freeShipping,
      shippingFee,
      message,
      threshold: FREE_SHIPPING_THRESHOLD,
      progress,
    };
  }, [subtotal]);

  // 加入購物車
  const handleAddToCart = useCallback(
    async (productId: string, quantity: number, product?: Partial<Product>) => {
      if (!productId) throw new Error("商品 ID 不存在");
      const validQuantity = Math.max(1, quantity || 1); // 確保數量至少為 1

      if (isAuthenticated) {
        await addCartItem({
          productId,
          quantity: validQuantity,
          product,
        }).unwrap();
      } else {
        // 沒登入時，先確認商品存在，再存入本機 Redux 狀態。
        const result = await dispatch(
          apiSlice.endpoints.getProductById.initiate(productId)
        );
        if (result.isError) throw new Error("商品不存在或無法取得");
        dispatch(addItem({ productId, quantity: validQuantity }));
      }
    },
    [isAuthenticated, addCartItem, dispatch]
  );

  // 沒登入的使用者，當 guestItems 有變化時，去 RTK Query 的快取裡面抓商品詳細資料，確保 guestCart 的內容是最新的。
  useEffect(() => {
    if (isAuthenticated) return;
    const subscriptions = guestItems.map((item) =>
      dispatch(apiSlice.endpoints.getProductById.initiate(item.productId))
    );
    return () => subscriptions.forEach((sub) => sub.unsubscribe()); // 清理訂閱
  }, [isAuthenticated, guestItems, dispatch]);

  // 從購物車移除商品
  const handleRemoveFromCart = useCallback(
    async (cartItemId: string) => {
      // 已經在刪除中的就直接 return（防止連點）
      if (removingIdSetRef.current.has(cartItemId)) return;

      const targetItem = mergedCart.find((item) => item._id === cartItemId);
      if (!targetItem) return;

      const targetProductId = targetItem.productId;
      const serverCartItemId = getServerCartItemId(targetProductId);

      // 把商品標記為「處理中」
      removingIdSetRef.current.add(cartItemId);
      setPendingRemovalIds((prev) => new Set(prev).add(cartItemId));

      try {
        if (isAuthenticated && serverCartItemId) {
          try {
            await removeCartItem(serverCartItemId).unwrap();
            dispatch(removeItem(targetProductId));
          } catch (err: unknown) {
            if (getErrorStatus(err) !== 404) throw err;
          }
        } else {
          const productId = extractProductIdFromCartItemId(
            cartItemId,
            targetProductId
          );
          dispatch(removeItem(productId));
        }
      } finally {
        removingIdSetRef.current.delete(cartItemId);
        setPendingRemovalIds((prev) => {
          const updated = new Set(prev);
          updated.delete(cartItemId);
          updated.delete(targetProductId);
          return updated;
        });
      }
    },
    [isAuthenticated, mergedCart, getServerCartItemId, removeCartItem, dispatch]
  );

  // 修改商品數量
  const handleChangeQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) return;

      const targetItem = mergedCart.find((item) => item._id === cartItemId);
      if (!targetItem) return;

      const { productId } = targetItem;

      // 樂觀更新：不管有沒有登入，先改本機畫面狀態，讓使用者立刻看到變化。
      dispatch(changeItemQuantity({ productId, quantity }));

      if (isAuthenticated) {
        const serverCartItemId = getServerCartItemId(productId);
        // 使用者停下 500ms 後才發 API
        if (serverCartItemId)
          debouncedUpdateQuantity(serverCartItemId, quantity);
      }
    },
    [
      isAuthenticated,
      mergedCart,
      getServerCartItemId,
      dispatch,
      debouncedUpdateQuantity,
    ]
  );

  // 清空購物車
  const handleClearCart = useCallback(async () => {
    if (isAuthenticated) await clearCartItems().unwrap();
    else dispatch(clearItems());
    return true;
  }, [isAuthenticated, clearCartItems, dispatch]);

  return {
    cart,
    isLoading,
    error,
    totalQuantity,
    subtotal,
    shippingInfo,
    refetchCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    changeQuantity: handleChangeQuantity,
    clearCart: handleClearCart,
  };
};
