import { useEffect, useState } from "react";
import axios from "axios";

export const useGetData = (
  url: string,
  options: { auth?: string | null; skip?: boolean } = {},
) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options.skip) return; // 如果設置為跳過請求，直接返回
    let isMounted = true; // 使用 isMounted 避免組件卸載後更新狀態

    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 支持跨域憑證
        });
        if (isMounted) setData(res.data);
      } catch (error) {
        if (isMounted)
          setError(error.response?.data?.message || "取得資料失敗，請稍後再試！");
      } finally {
        if (isMounted) setLoading(false); // 完成後設 loading 為 false
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};
