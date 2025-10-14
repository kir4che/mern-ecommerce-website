import { useEffect, useCallback, useRef, useState } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";

type RequestStatus = "idle" | "loading" | "success" | "error";
type UrlParams = Record<string, unknown>;

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
  withCredentials: true,
});

export function useAxios<TData = unknown>(
  url: string | ((params?: UrlParams) => string),
  config: AxiosRequestConfig = {},
  options: {
    immediate?: boolean;
    skip?: boolean;
    onSuccess?: (data: TData) => void;
    onError?: (err: ErrorResponse) => void;
    transformResponse?: (raw: unknown) => TData;
    initialData?: TData | null;
  } = {}
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
    (params?: UrlParams) => {
      if (typeof url === "function") return url(params);
      return url;
    },
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

        const reqConfig: AxiosRequestConfig = {
          ...mergedConfig,
          url: requestUrl,
          method,
          signal,
          headers: {
            "Content-Type": "application/json",
            ...baseConfig.headers,
            ...overrideConfig?.headers,
          },
        };

        if (isGetLike) reqConfig.params = callParams;
        else reqConfig.data = callParams;

        const res = await api.request(reqConfig);

        const transformedData = callbackRef.current.transformResponse
          ? callbackRef.current.transformResponse(res.data as unknown)
          : (res.data as TData);

        if (currentRequestId === requestIdRef.current) {
          setState({ data: transformedData, status: "success", error: null });
          callbackRef.current.onSuccess?.(transformedData);
        }

        return transformedData;
      } catch (err: unknown) {
        if (axios.isCancel(err)) return;

        if (axios.isAxiosError(err)) {
          type ErrorPayload = {
            message?: string;
            code?: string;
            details?: unknown;
          };
          const d = (err.response?.data ?? {}) as ErrorPayload;

          const errorDetails: ErrorResponse = {
            message: d.message ?? err.message ?? "Request failed!",
            code: d.code,
            statusCode: err.response?.status,
            details: d.details,
          };

          if (currentRequestId === requestIdRef.current) {
            setState({ data: null, status: "error", error: errorDetails });
            callbackRef.current.onError?.(errorDetails);
          }
          return;
        }

        const fallback: ErrorResponse = {
          message: (err as Error)?.message ?? "Request failed!",
        };
        if (currentRequestId === requestIdRef.current) {
          setState({ data: null, status: "error", error: fallback });
          callbackRef.current.onError?.(fallback);
        }
      }
    },
    [skip, resolveUrl]
  );

  useEffect(() => {
    if (immediate && !skip) {
      const controller = new AbortController();
      fetchData(undefined, undefined, controller.signal);
      return () => controller.abort();
    }
  }, [immediate, skip, fetchData]);

  return {
    ...state,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    refresh: (
      params?: UrlParams,
      overrideConfig?: Partial<AxiosRequestConfig>
    ) => fetchData(params, overrideConfig),
    reset: () =>
      setState({
        data: initialDataRef.current,
        status: initialDataRef.current ? "success" : "idle",
        error: null,
      }),
  };
}
