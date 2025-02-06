import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseAxiosOptions<T> {
  immediate?: boolean;  // 是否在組件掛載後立即發送請求，true 則不需手動觸發，false 則須手動呼叫 refresh 來發送請求。
  skip?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error | AxiosError) => void;
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

  // 解析 URL
  const resolveUrl = useCallback((params?: Record<string, any>) => {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    if (typeof url === 'function') {
      const resolved = url(params);
      if (!resolved || typeof resolved !== 'string') return;
      return `${baseUrl}${resolved}`;
    }
    return `${baseUrl}${url}`;
  }, [url]);

  const handleError = (err: Error | AxiosError) => {
    let errorMessage = '發生未知錯誤，請稍後再試！';
    if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data?.message || (err.response ? `伺服器錯誤 (${err.response.status})，請稍後再試！` : '伺服器無回應，請檢查網路連線！');
    } else errorMessage = err.message;

    setError(errorMessage);
    setStatus('error');
    onError?.(err);
  }

  async function fetchData(params?: Record<string, any>, newConfig?: Partial<AxiosRequestConfig>) {
    if (skip || status === 'loading') return;
  
    setStatus('loading');
    setError(null);
  
    const requestUrl = resolveUrl(params);
    if (!requestUrl) {
      handleError(new Error('請求 URL 無效，請檢查參數！'));
      return;
    }

    try {
      const response: AxiosResponse<T> = await axios({
        url: requestUrl,
        method: newConfig?.method || config.method || 'GET',
        data: params,
        ...config,
        ...newConfig,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
          ...newConfig?.headers,
        },
      });

      if (!response?.data) {
        handleError(new Error('伺服器回應資料無效，請稍後再試！'));
        return;
      }
  
      setData(response.data || {} as T);
      setStatus('success');
      onSuccess?.(response.data);
    } catch (error) {
      handleError(error as Error | AxiosError);
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
