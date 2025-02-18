import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAxios(
  url: string | ((params?: Record<string, any>) => string),
  config: AxiosRequestConfig = {},
  options: { 
    immediate?: boolean; 
    skip?: boolean; 
    onSuccess?: (data: any) => void; 
    onError?: (err: any) => void; 
  } = {}
) {
  const [data, setData] = useState(null);
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

  async function fetchData(params?: Record<string, any>, newConfig?: Partial<AxiosRequestConfig>) {
    if (skip || status === 'loading') return;
  
    setStatus('loading');
    setError(null);
  
    const requestUrl = resolveUrl(params);
    if (!requestUrl) {
      setError('請求 URL 無效，請檢查參數！');
      onError?.('請求 URL 無效，請檢查參數！');
      return;
    }

    try {
      const response = await axios({
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

      if (!response?.data?.success) {
        setError(response.data?.message );
        onError?.(response.data?.message);
        return;
      }

      setData(response.data || {});
      setStatus('success');
      
      onSuccess?.(response.data);

      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Request failed!';
      setError(errorMessage);
      onError?.(errorMessage)
    }
  }

  useEffect(() => {
    if (immediate && !skip) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, skip, resolveUrl]);

  return {
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    refresh: fetchData
  };
}
