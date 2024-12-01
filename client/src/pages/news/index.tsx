import { useState, useEffect, useCallback, memo } from "react";
import { Link } from "react-router-dom";

import { useGetData } from "@/hooks/useGetData";
import { formatDate } from "@/utils/formatDate";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import Loading from "@/components/atoms/Loading";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import Pagination from "@/components/molecules/Pagination";

const News = () => {
  const limit = 5;
  const [page, setPage] = useState(1);
  const [prefetchData, setPrefetchData] = useState(null);
  const [newsData, setNewsData] = useState({ news: [], total: 0 });

  const { data, loading, error } = useGetData(
    `/news?page=${page}&limit=${limit}`,
  );
  // 預抓取下一頁的 news，若當前頁數為最後一頁則跳過。
  const { data: prefetch } = useGetData(
    `/news?page=${page + 1}&limit=${limit}`,
    {
      skip: page >= Math.ceil(newsData.total / limit),
    },
  );

  useEffect(() => {
    if (data) setNewsData(data);
  }, [data]);

  useEffect(() => {
    if (prefetch) setPrefetchData(prefetch);
  }, [prefetch]);

  const totalPages = Math.ceil(newsData.total / limit);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage <= totalPages && newPage > 0) {
        setPage(newPage);
        if (newPage > page) {
          // 使用已預抓取的數據，避免延遲。
          setNewsData(prefetchData);
        }
      }
    },
    [page, prefetchData, totalPages],
  );

  if (error) return <NotFound message={[error]} />;
  if (loading) return <Loading />;

  return (
    <Layout>
      <div className="px-5 pt-4 md:px-8 min-h-40 bg-primary">
        <Breadcrumb text="最新消息" textColor="text-secondary" />
        <h2 className="flex flex-col items-center justify-center gap-y-2 text-secondary">
          <span className="text-lg font-light">News</span>
          <span className="text-2xl">最新消息列表</span>
        </h2>
      </div>
      <ul className="max-w-screen-xl px-5 pt-10 mx-auto space-y-4 md:px-8">
        {newsData.news.map(({ _id, date, category, title, content }) => (
          <li
            key={_id}
            className="py-4 space-y-4 border-b border-dashed border-primary/80"
          >
            <time className="inline-block mb-2 font-light">
              {formatDate(date)}
            </time>
            <Link to={`/news/${_id}`}>
              <p className="flex items-center text-2xl font-medium hover:underline hover:underline-offset-4">
                <span className="px-2.5 text-nowrap py-1 mr-2 text-sm font-light rounded-full self-start bg-primary text-secondary">
                  {category}
                </span>
                {title}
              </p>
            </Link>
            <p className="line-clamp-3">{content}</p>
          </li>
        ))}
      </ul>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
};

export default memo(News);
