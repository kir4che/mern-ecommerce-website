import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseAxiosOptions<T> {
  immediate?: boolean;  // 是否在組件掛載後立即發送請求，true 則不需手動觸發，false 則須手動呼叫 refresh 來發送請求。
  skip?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseAxiosResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  refresh: (params?: Record<string, any>, config?: Partial<AxiosRequestConfig>) => Promise<void>;
}

export function useAxios<T = any>(
  url: string | ((params?: Record<string, any>) => string),
  config: AxiosRequestConfig = {},
  options: UseAxiosOptions<T> = {}
): UseAxiosResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, skip = false, onSuccess, onError } = options;

  const resolveUrl = useCallback((params?: Record<string, any>) => {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    return typeof url === 'function' ? `${baseUrl}${url(params)}` : `${baseUrl}${url}`;
  }, [url]);

  async function fetchData(params?: Record<string, any>, newConfig?: Partial<AxiosRequestConfig>) {
    if (skip || status === 'loading') return;

    try {
      setStatus('loading');
      setError(null);

      const response: AxiosResponse<T> = await axios({
        url: resolveUrl(params),
        method: newConfig?.method || config.method || 'GET',
        data: { ...params?.data },
        ...config,
        ...newConfig,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
          ...newConfig?.headers,
        },
      });

      setData((prevData) => response.data);
      setStatus((prevStatus) => 'success');
      onSuccess?.(response.data);
    } catch (err) {
      let errorMessage = '取得資料失敗，請稍後再試！';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setStatus('error');
      onError?.(errorMessage);
    }
  }

  useEffect(() => {
    if (immediate && !skip) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, skip]);

  return {
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    refresh: fetchData
  };
}
