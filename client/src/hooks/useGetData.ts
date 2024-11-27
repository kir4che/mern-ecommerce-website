import { useEffect, useState } from "react";
import axios from "axios";

export const useGetData = (url: string, auth: string | null = null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (res.status === 200) setData(res.data);
        else setError("取得資料失敗，請稍後再試！");
      } catch (error) {
        setError("取得資料失敗，請稍後再試！");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, auth]);

  return { data, loading, error };
};
