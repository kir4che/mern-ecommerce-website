import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";

import { useAxios } from "@/hooks/useAxios";
import { formatDate } from "@/utils/formatDate";

import NotFound from "@/pages/notFound";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import Loading from "@/components/atoms/Loading";

interface NewsItemProps {
  _id: string;
  date: string;
  category: string;
  title: string;
  content: string;
}

const NewsItem: React.FC<NewsItemProps> = ({
  _id,
  date,
  category,
  title,
  content,
}) => (
  <li className="py-4 space-y-4 transition-all border-b border-dashed border-primary/80 hover:bg-gray-50">
    <time className="inline-block mb-2 text-sm font-light text-gray-600">
      {formatDate(date)}
    </time>
    <Link to={`/news/${_id}`}>
      <p className="flex items-center text-2xl font-medium group">
        <span className="px-2.5 py-1 mr-2 text-sm font-light rounded-full bg-primary text-secondary">
          {category}
        </span>
        <span className="transition-all group-hover:underline group-hover:underline-offset-4">
          {title}
        </span>
      </p>
    </Link>
    <p className="text-gray-700 line-clamp-3">{content}</p>
  </li>
);

const News = () => {
  const limit = 5; // 每頁顯示的新聞數量
  const [page, setPage] = useState(1); // 當前頁碼
  const [newsData, setNewsData] = useState({ news: [], total: 0 });

  // 獲取當前頁數據
  const { data, error, isLoading, isError } = useAxios(
    `/news?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  // 預加載下一頁數據
  const shouldSkipPreload = !data || page >= Math.ceil(data.total / limit);
  const { data: nextPageData } = useAxios(
    `/news?page=${page + 1}&limit=${limit}`,
    { method: "GET" },
    { skip: shouldSkipPreload }
  );

  // 更新當前頁的新聞數據
  useEffect(() => {
    if (data) setNewsData(data);
  }, [data]);

  const totalPages = Math.ceil(newsData.total / limit); // 總頁數

  // 處理頁碼變更
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages) {
        // 若有預加載數據且向下一頁移動，直接使用。
        if (newPage === page + 1 && nextPageData) {
          setNewsData(nextPageData);
        }
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [page, nextPageData, totalPages]
  );

  if (isError) return <NotFound message={error?.message} />;

  return (
    <>
      <PageHeader breadcrumbText="最新消息" titleEn="News" titleCh="最新消息" />
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      ) : (
        <>
          <ul className="max-w-screen-xl px-5 pt-10 mx-auto space-y-4 md:px-8">
            {newsData.news.map((news) => (
              <NewsItem key={news._id} {...news} />
            ))}
          </ul>
          {newsData.total > limit && (
            <Pagination
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
};

export default News;
