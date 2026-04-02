import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router";

import { useGetNewsByIdQuery } from "@/store/slices/apiSlice";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

import Loading from "@/components/atoms/Loading";
import PageHeader from "@/components/molecules/PageHeader";
import NotFound from "@/pages/notFound";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";

const New = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading, isError } = useGetNewsByIdQuery(id!, {
    skip: !id,
  });

  const newsItem = data?.newsItem;

  if (isLoading) {
    return (
      <div className="flex-center">
        <Loading />
      </div>
    );
  }

  if (isError && !isLoading)
    return (
      <NotFound message={getErrorMessage(error, "無法載入最新消息內容")} />
    );

  return (
    <>
      <PageHeader breadcrumbText="最新消息" titleEn="News" titleCh="最新消息" />
      <article className="max-w-5xl px-5 py-10 mx-auto whitespace-pre-line md:px-8">
        <div className="flex max-md:flex-col gap-2 pb-6 border-b md:items-center border-primary/50">
          <time className="text-base font-light">
            {formatDate(newsItem.date)}
          </time>
          <hr className="hidden w-8 h-0.5 rotate-90 bg-primary/30 md:block" />
          <h1 className="leading-10">{newsItem.title}</h1>
        </div>
        <img
          src={newsItem.imageUrl}
          alt={newsItem.title}
          className="object-cover mb-4 object-center w-full h-80 md:min-h-96 md:h-[24vw]"
        />
        <ReactMarkdown
          components={{
            ul: ({ children }) => (
              <ul className="pl-2 whitespace-normal list-disc list-inside">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="pl-2 whitespace-normal list-disc list-inside">
                {children}
              </ol>
            ),
          }}
        >
          {newsItem.content}
        </ReactMarkdown>
      </article>
      <div className="p-5 border-t w-full border-slate-400">
        <Link
          to="/news"
          className="flex items-center justify-end gap-2 text-base hover:underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="size-5" />
          回上一頁
        </Link>
      </div>
    </>
  );
};

export default New;
