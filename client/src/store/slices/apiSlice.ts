import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import type { RootState } from "@/store";
import { clearCredentials, setAccessToken } from "@/store/slices/authSlice";
import type {
  AddCartItemParams,
  AuthLoginResponse,
  CartResponse,
  CouponDetailResponse,
  CouponResponse,
  CouponsResponse,
  CreateCouponData,
  CreateNewsData,
  CreateOrderData,
  CreatePaymentData,
  CreateProductData,
  GetNewsParams,
  GetOrdersParams,
  GetProductsParams,
  LoginParams,
  NewsDetailResponse,
  NewsResponse,
  Order,
  OrdersResponse,
  Product,
  ProductDetailResponse,
  ProductsResponse,
  RegisterParams,
  ResetPasswordParams,
  ResetPasswordTokenParams,
  SyncCartData,
  UpdateCartItemQuantityParams,
  UpdateCouponData,
  UpdateNewsData,
  UpdateOrderData,
  UpdateProductData,
  UploadImageResponse,
  ValidateCouponParams,
} from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// 用來確保同一時間只有一個 token 更新流程在跑，避免多個 API 請求同時觸發多次更新。
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  // 每個請求都帶上最新的 access token（有的話）
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// 當 accessToken 過期 → 自動 refresh → 重試原請求
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock(); // 等待可能正在進行的 token 更新完成
  let result = await rawBaseQuery(args, api, extraOptions); // 首次請求

  // 401 + TOKEN_EXPIRED = access token 過期 → 嘗試更新 token
  if (
    result.error?.status === 401 &&
    (result.error.data as { code?: string })?.code === "TOKEN_EXPIRED"
  ) {
    // 確保同一時間只有一個 token 更新流程
    const release = await mutex.acquire();
    try {
      const tokenBefore = (api.getState() as RootState).auth.accessToken;
      const refreshToken = (api.getState() as RootState).auth.refreshToken;

      if (tokenBefore) {
        const refreshResult = await rawBaseQuery(
          {
            url: "/user/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          api.dispatch(setAccessToken(accessToken));
          result = await rawBaseQuery(args, api, extraOptions);
        } else await api.dispatch(clearCredentials());
      } else result = await rawBaseQuery(args, api, extraOptions);
    } finally {
      release();
    }
  }

  return result;
};

// 定義所有 API endpoints，並自動生成對應的 hooks。
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Products",
    "Product",
    "News",
    "NewsItem",
    "Orders",
    "Cart",
    "Coupons",
  ],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append("category", params.category);
        if (params.tag) searchParams.append("tag", params.tag);
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.sort) searchParams.append("sort", params.sort);
        if (params.search) searchParams.append("search", params.search);
        return `/products?${searchParams.toString()}`;
      },
      // 用同一個快取物件存多頁資料
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const filteredArgs = Object.fromEntries(
          Object.entries(queryArgs).filter(([key]) => key !== "page")
        );
        return `${endpointName}-${JSON.stringify(filteredArgs)}`;
      },
      // 自動合併分頁結果
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1 || !arg.page) {
          currentCache.products = newItems.products;
          currentCache.total = newItems.total;
        } else {
          const existingIds = new Set(currentCache.products.map((p) => p._id));
          for (const item of newItems.products) {
            if (!existingIds.has(item._id)) currentCache.products.push(item);
          }
        }
      },
      // 切換頁數時自動 refetch
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ["Products"],
    }),
    getProductById: builder.query<ProductDetailResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<ProductDetailResponse, CreateProductData>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      ProductDetailResponse,
      { id: string; data: UpdateProductData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      // 誰讓 cache 失效
      invalidatesTags: (_result, _error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // News
    getNews: builder.query<NewsResponse, GetNewsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        return `/news?${searchParams.toString()}`;
      },
      providesTags: ["News"],
    }),
    getNewsById: builder.query<NewsDetailResponse, string>({
      query: (id) => `/news/${id}`,
      providesTags: (_result, _error, id) => [{ type: "NewsItem", id }],
    }),
    createNews: builder.mutation<NewsDetailResponse, CreateNewsData>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation<
      NewsDetailResponse,
      { id: string } & UpdateNewsData
    >({
      query: ({ id, ...body }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "News",
        { type: "NewsItem", id },
      ],
    }),
    deleteNews: builder.mutation<void, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // Orders
    getOrders: builder.query<OrdersResponse, GetOrdersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("type", params.status);
        if (params.keyword) searchParams.append("keyword", params.keyword);
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.orderBy) searchParams.append("orderBy", params.orderBy);
        if (params.userId) searchParams.append("userId", params.userId);

        const endpoint = params.isAdmin ? "/orders/all" : "/orders";

        return `${endpoint}?${searchParams.toString()}`;
      },
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<{ order: Order }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation<{ order: Order }, CreateOrderData>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<
      { order: Order },
      { id: string } & UpdateOrderData
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Orders",
        { type: "Orders", id },
      ],
    }),

    // Coupon
    coupon: builder.mutation<CouponResponse, ValidateCouponParams>({
      query: (body) => ({
        url: "/coupons/validate",
        method: "POST",
        body,
      }),
    }),
    getCoupons: builder.query<CouponsResponse, void>({
      query: () => "/coupons",
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation<CouponDetailResponse, CreateCouponData>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation<
      CouponDetailResponse,
      { id: string; data: UpdateCouponData }
    >({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deactivateCoupon: builder.mutation<CouponDetailResponse, string>({
      query: (couponId) => ({
        url: `/coupons/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Payment
    createPayment: builder.mutation<
      { redirect_url: string },
      CreatePaymentData
    >({
      query: (body) => ({
        url: "/payment",
        method: "POST",
        body,
      }),
    }),

    // Upload
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        prepareHeaders: (headers: Headers) => {
          headers.delete("Content-Type");
          return headers;
        },
      }),
    }),

    // Auth
    resetPassword: builder.mutation<{ message: string }, ResetPasswordParams>({
      query: (body) => ({
        url: "/user/reset-password",
        method: "POST",
        body,
      }),
    }),
    resetPasswordToken: builder.mutation<
      { message: string },
      ResetPasswordTokenParams
    >({
      query: (body) => ({
        url: `/user/reset-password/${body.token}`,
        method: "POST",
        body: { password: body.password },
      }),
    }),
    register: builder.mutation<
      { user: Record<string, unknown> },
      RegisterParams
    >({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<AuthLoginResponse, LoginParams>({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    // Cart
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    syncCart: builder.mutation<CartResponse, SyncCartData>({
      query: (body) => ({
        url: "/cart/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<CartResponse, AddCartItemParams>({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      async onQueryStarted(
        { productId, quantity, product },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            const existingItem = draft.cart.find(
              (item) => item.productId === productId
            );
            if (existingItem) existingItem.quantity += quantity;
            else if (product) {
              draft.cart.push({
                _id: `${productId}_optimistic`,
                cartId: "optimistic",
                productId,
                quantity,
                product: product as Product,
              });
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
              draft.cart = data.cart;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeCartItem: builder.mutation({
      query: (cartItemId) => ({
        url: `/cart/${cartItemId}`,
        method: "DELETE",
      }),
      async onQueryStarted(cartItemId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draft) => {
            draft.cart = draft.cart.filter((item) => item._id !== cartItemId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          try {
            patchResult.undo();
          } catch {
            dispatch(apiSlice.util.invalidateTags(["Cart"]));
          }
        }
      },
    }),
    updateCartItemQuantity: builder.mutation<
      CartResponse,
      UpdateCartItemQuantityParams
    >({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/${cartItemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      async onQueryStarted(
        { cartItemId, quantity },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getCart", undefined, (draftCart) => {
            const item = draftCart.cart.find((i) => i._id === cartItemId);
            if (item) item.quantity = quantity;
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getCart", undefined, (draftCart) => {
              draftCart.cart = data.cart;
            })
          );
        } catch {
          try {
            patchResult.undo();
          } catch {
            dispatch(apiSlice.util.invalidateTags(["Cart"]));
          }
        }
      },
    }),
    clearCartItems: builder.mutation<void, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCouponMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeactivateCouponMutation,
  useUpdateOrderMutation,
  useCreatePaymentMutation,
  useUploadImageMutation,
  useResetPasswordMutation,
  useResetPasswordTokenMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCartQuery,
  useSyncCartMutation,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useClearCartItemsMutation,
} = apiSlice;
