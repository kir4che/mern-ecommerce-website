import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

type RequestStatus = "idle" | "loading" | "success" | "error";

interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export function useAxios(
  url: string | ((params?: Record<string, any>) => string),
  config: AxiosRequestConfig = {},
  options: {
    immediate?: boolean;
    skip?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (err: ErrorResponse) => void;
  } = {},
) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<ErrorResponse | null>(null);

  const { immediate = true, skip = false, onSuccess, onError } = options;

  // 解析 URL
  const resolveUrl = useCallback(
    (params?: Record<string, any>) => {
      const baseUrl = process.env.REACT_APP_API_URL || "";
      if (typeof url === "function") {
        const resolved = url(params);
        if (!resolved || typeof resolved !== "string") return;
        return `${baseUrl}${resolved}`;
      }
      return `${baseUrl}${url}`;
    },
    [url],
  );

  const fetchData = useCallback(
    async (
      params?: Record<string, any>,
      newConfig?: Partial<AxiosRequestConfig>,
    ) => {
      if (skip || status === "loading") return;

      setStatus("loading");
      setError(null);

      const requestUrl = resolveUrl(params);
      if (!requestUrl) {
        const errorDetails: ErrorResponse = {
          message: "The request URL is invalid!",
        };
        setError(errorDetails);
        onError?.(errorDetails);
        setStatus("error");
        return;
      }

      try {
        const res = await axios({
          url: requestUrl,
          method: newConfig?.method || config.method || "GET",
          data: params,
          ...config,
          ...newConfig,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
            ...newConfig?.headers,
          },
        });

        if (!res?.data?.success) {
          const errorDetails: ErrorResponse = {
            message: res?.data?.message || "Request failed!",
            statusCode: res?.status,
            details: res?.data?.details,
          };
          setError(errorDetails);
          onError?.(errorDetails);
          setStatus("error");
          return;
        }

        setData(res.data || {});

        onSuccess?.(res.data);
        setStatus("success");

        return res.data;
      } catch (err: any) {
        const errorDetails: ErrorResponse = {
          message:
            err.response?.data?.message || err.message || "Request failed!",
          code: err.response?.data?.code,
          statusCode: err.response?.status,
          details: err.response?.data?.details,
        };
        setError(errorDetails);
        onError?.(errorDetails);
        setStatus("error");
      }
    },
    [config, onError, resolveUrl, skip, status, onSuccess],
  );

  useEffect(() => {
    if (immediate && !skip) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, skip, url]);

  return {
    data,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    refresh: fetchData,
  };
}
