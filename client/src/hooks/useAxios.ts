import { useEffect, useCallback, useRef, useState } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";

type RequestStatus = "idle" | "loading" | "success" | "error";

interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
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
  withCredentials: true,
});

export function useAxios<TData = any>(
  url: string | ((params?: Record<string, any>) => string),
  config: AxiosRequestConfig = {},
  options: {
    immediate?: boolean;
    skip?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (err: ErrorResponse) => void;
    transformResponse?: (raw: any) => TData;
    initialData?: TData | null;
  } = {},
) {
  const {
    immediate = true,
    skip = false,
    onSuccess,
    onError,
    transformResponse,
    initialData = null,
  } = options;

  const initialDataRef = useRef(initialData);
  const configRef = useRef(config);
  const requestIdRef = useRef(0);

  const [state, setState] = useState<AxiosState<TData>>({
    data: initialDataRef.current,
    status: initialDataRef.current ? "success" : "idle",
    error: null,
  });

  const callbackRef = useRef({ onSuccess, onError, transformResponse });
  useEffect(() => {
    callbackRef.current = { onSuccess, onError, transformResponse };
  }, [onSuccess, onError, transformResponse]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const resolveUrl = useCallback(
    (params?: Record<string, any>) => {
      if (typeof url === "function") {
        return url(params);
      }
      return url;
    },
    [url],
  );

  const fetchData = useCallback(
    async (
      callParams?: Record<string, any>,
      overrideConfig?: Partial<AxiosRequestConfig>,
      signal?: AbortSignal,
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
          callbackRef.current.onError?.(errorDetails);
        }
        return;
      }

      try {
        const baseConfig = configRef.current ?? {};
        const mergedConfig: AxiosRequestConfig = {
          ...baseConfig,
          ...overrideConfig,
        };
        const method: Method =
          (mergedConfig.method?.toUpperCase() as Method) || "GET";
        const isGetLike = ["GET", "DELETE", "HEAD", "OPTIONS"].includes(method);
        const requestDataKey = isGetLike ? "params" : "data";

        const res = await api.request({
          ...mergedConfig,
          url: requestUrl,
          method,
          signal,
          headers: {
            "Content-Type": "application/json",
            ...baseConfig.headers,
            ...overrideConfig?.headers,
          },
          [requestDataKey]: callParams,
        });

        const transformedData = callbackRef.current.transformResponse
          ? callbackRef.current.transformResponse(res.data)
          : (res.data as TData);

        if (currentRequestId === requestIdRef.current) {
          setState({ data: transformedData, status: "success", error: null });
          callbackRef.current.onSuccess?.(transformedData);
        }

        return transformedData;
      } catch (err) {
        if (!axios.isCancel(err)) {
          const error = err as any;
          const errorDetails: ErrorResponse = {
            message:
              error?.response?.data?.message ||
              error?.message ||
              "Request failed!",
            code: error?.response?.data?.code,
            statusCode: error?.response?.status,
            details: error?.response?.data?.details,
          };

          if (currentRequestId === requestIdRef.current) {
            setState({ data: null, status: "error", error: errorDetails });
            callbackRef.current.onError?.(errorDetails);
          }
        }
      }
    },
    [skip, resolveUrl],
  );

  useEffect(() => {
    if (immediate && !skip) {
      const controller = new AbortController();
      fetchData(undefined, undefined, controller.signal);

      return () => {
        controller.abort();
      };
    }
  }, [immediate, skip, fetchData]);

  return {
    ...state,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    refresh: (
      params?: Record<string, any>,
      overrideConfig?: Partial<AxiosRequestConfig>,
    ) => fetchData(params, overrideConfig),
    reset: () =>
      setState({
        data: initialDataRef.current,
        status: initialDataRef.current ? "success" : "idle",
        error: null,
      }),
  };
}
