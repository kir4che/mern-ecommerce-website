import { useEffect, useCallback, useRef, useState } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";
import { store } from "@/store";
import { setAccessToken } from "@/store/slices/authSlice";

type RequestStatus = "idle" | "loading" | "success" | "error";
type UrlParams = Record<string, unknown> | FormData;

interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

interface AxiosState<TData> {
  data: TData | null;
  status: RequestStatus;
  error: ErrorResponse | null;
}

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Missing environment variable: VITE_API_URL");

export const api = axios.create({
  baseURL: API_URL,
});

// 加上 Authorization Header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// 處理 Token 過期
api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;

    // 如果 401 且 TOKEN_EXPIRED，嘗試刷新 token。
    if (
      err.response?.status === 401 &&
      err.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/user/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        // 重試原本的請求
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token 也過期了，清除所有資料並重新登入。
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export const useAxios = <TData = unknown>(
  url: string | ((params?: UrlParams) => string),
  config: AxiosRequestConfig = {},
  options: {
    immediate?: boolean;
    skip?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (err: ErrorResponse) => void;
    initialData?: TData | null;
  } = {}
) => {
  const {
    immediate = true,
    skip = false,
    onSuccess,
    onError,
    initialData = null,
  } = options;

  const requestIdRef = useRef(0);
  const optionsRef = useRef({ onSuccess, onError });

  // 同步最新的 callbacks 到 ref
  useEffect(() => {
    optionsRef.current = { onSuccess, onError };
  }, [onSuccess, onError]);

  const [state, setState] = useState<AxiosState<TData>>({
    data: initialData,
    status: initialData ? "success" : "idle",
    error: null,
  });

  const resolveUrl = useCallback(
    (params?: UrlParams) => (typeof url === "function" ? url(params) : url),
    [url]
  );

  const fetchData = useCallback(
    async (
      callParams?: UrlParams,
      overrideConfig?: Partial<AxiosRequestConfig>,
      signal?: AbortSignal
    ) => {
      if (skip) return;

      const currentRequestId = ++requestIdRef.current;
      setState((prev) => ({ ...prev, status: "loading", error: null }));

      const requestUrl = resolveUrl(callParams);
      if (!requestUrl) {
        const errorDetails: ErrorResponse = {
          message: "The request URL is invalid!",
        };
        if (currentRequestId === requestIdRef.current) {
          setState({ data: null, status: "error", error: errorDetails });
          optionsRef.current.onError?.(errorDetails);
        }
        return;
      }

      try {
        const mergedConfig: AxiosRequestConfig = {
          ...config,
          ...overrideConfig,
        };
        const method: Method =
          (mergedConfig.method?.toUpperCase() as Method) || "GET";
        const isGetLike = ["GET", "DELETE", "HEAD", "OPTIONS"].includes(method);

        const reqConfig: AxiosRequestConfig = {
          ...mergedConfig,
          url: requestUrl,
          method,
          signal,
          headers: {
            ...(!(callParams instanceof FormData) && {
              "Content-Type": "application/json",
            }),
            ...config.headers,
            ...overrideConfig?.headers,
          },
        };

        if (isGetLike) {
          reqConfig.params = callParams;
        } else {
          reqConfig.data = callParams;
        }

        const res = await api.request(reqConfig);
        const transformedData = res.data as TData;

        if (currentRequestId === requestIdRef.current) {
          setState({ data: transformedData, status: "success", error: null });
          optionsRef.current.onSuccess?.(transformedData);
        }

        return transformedData;
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;

        let errorDetails: ErrorResponse;

        if (axios.isAxiosError(err)) {
          const data = err.response?.data as {
            message?: string;
            code?: string;
            details?: unknown;
          };

          errorDetails = {
            message: data?.message ?? err.message ?? "Request failed!",
            code: data?.code,
            statusCode: err.response?.status,
            details: data?.details,
          };
        } else
          errorDetails = {
            message: (err as Error)?.message ?? "Request failed!",
          };

        if (currentRequestId === requestIdRef.current) {
          setState({ data: null, status: "error", error: errorDetails });
          optionsRef.current.onError?.(errorDetails);
        }
      }
    },
    [skip, resolveUrl, config]
  );

  useEffect(() => {
    if (immediate && !skip) {
      // 組合 AbortController，元件卸載時中斷請求。
      const controller = new AbortController();
      fetchData(undefined, undefined, controller.signal);
      return () => controller.abort();
    }
  }, [immediate, skip, fetchData]);

  const refresh = useCallback(
    (params?: UrlParams, overrideConfig?: Partial<AxiosRequestConfig>) =>
      fetchData(params, overrideConfig),
    [fetchData]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      status: initialData ? "success" : "idle",
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    refresh,
    reset,
  };
};
