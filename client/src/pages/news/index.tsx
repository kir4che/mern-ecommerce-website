import { useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import removeMarkdown from "remove-markdown";

import { useGetNewsQuery } from "@/store/slices/apiSlice";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

import Loading from "@/components/atoms/Loading";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import NotFound from "@/pages/notFound";

interface NewsItemProps {
  _id: string;
  date: string | Date;
  category: string;
  title: string;
  content: string;
}

const NewsItem = ({ _id, date, category, title, content }: NewsItemProps) => (
  <li className="group border-b border-slate-200 py-6 last:border-0 transition-colors hover:bg-slate-50/50">
    <Link to={`/news/${_id}`} className="block space-y-3">
      <div className="flex items-center gap-2.5">
        <time className="font-light text-gray-600 text-sm">
          {formatDate(date)}
        </time>
        <span className="px-2 badge text-nowrap badge-neutral text-xs rounded-full">
          {category}
        </span>
      </div>
      <h3 className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors md:text-2xl">
        {title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3">
        {removeMarkdown(content)}
      </p>
    </Link>
  </li>
);

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { data, error, isLoading, isError } = useGetNewsQuery({ page, limit });

  const newsList = data?.news ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages)
        setSearchParams({ page: String(newPage) });
    },
    [totalPages, setSearchParams]
  );

  if (isError && !isLoading)
    return <NotFound message={getErrorMessage(error, "載入最新消息失敗")} />;

  return (
    <>
      <PageHeader breadcrumbText="最新消息" titleEn="News" titleCh="最新消息" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="max-w-4xl px-5 py-4 mx-auto md:px-8">
          <ul className="divide-y divide-slate-100">
            {newsList.map((news) => (
              <NewsItem key={news._id} {...news} />
            ))}
          </ul>
          {total > limit && (
            <Pagination
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </>
  );
};

export default News;
