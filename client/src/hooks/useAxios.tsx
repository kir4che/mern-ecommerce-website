import { useState, useEffect } from 'react';
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
  refresh: (config?: Partial<AxiosRequestConfig>) => Promise<void>;
}

export function useAxios<T = any>(
  url: string,
  config: AxiosRequestConfig = {},
  options: UseAxiosOptions<T> = {}
): UseAxiosResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const {
    immediate = true,  // 預設為立即發送請求
    skip = false,
    onSuccess,
    onError
  } = options;

  async function fetchData(newConfig?: Partial<AxiosRequestConfig>) {
    if (skip) return;  // 如果 skip 為 true，則不發送請求。

    try {
      setStatus('loading');
      setError(null);

      const response: AxiosResponse<T> = await axios({
        url: `${process.env.REACT_APP_API_URL}${url}`,
        ...config,
        ...newConfig,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
          ...newConfig?.headers,
        },
      });

      setData(response.data);
      setStatus('success'); 

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
  }, [immediate, skip, url]);

  return {
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    refresh: fetchData
  };
}
