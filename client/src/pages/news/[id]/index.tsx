import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useAxios } from "@/hooks/useAxios";
import { formatDate } from "@/utils/formatDate";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import PageHeader from "@/components/molecules/PageHeader";
import Loading from "@/components/atoms/Loading";

import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";

const New = () => {
  const { id } = useParams();
  const { data, error, isLoading, isError } = useAxios(`/news/${id}`);

  const newsItem = data?.newsItem || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  if (isError) return <NotFound message={error?.message} />;

  return (
    <Layout>
      <PageHeader 
        breadcrumbText="最新消息"
        titleEn="News"
        titleCh="最新消息"
      />
      <article className="max-w-screen-lg px-5 py-10 mx-auto md:px-8">
        <div className="flex flex-col gap-2 pb-6 border-b md:items-center md:flex-row border-primary/50">
          <time className="text-base font-light">{formatDate(newsItem.date)}</time>
          <hr className="hidden w-8 h-0.5 rotate-90 bg-primary/30 md:block" />
          <h1 className="leading-10">{newsItem.title}</h1>
        </div>
        <img
          src={newsItem.imageUrl}
          alt={newsItem.title}
          className="object-cover object-center w-full h-80 md:min-h-96 md:h-[24vw]"
        />
        <ReactMarkdown className="py-8 text-base markdown">
          {newsItem.content}
        </ReactMarkdown>
      </article>
      <div className="pt-4 border-t border-gray-400">
        <Link
          to="/news"
          className="flex items-center justify-end gap-2 text-base hover:underline-offset-4 hover:underline"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          回上一頁
        </Link>
      </div>
    </Layout>
  );
};

export default New;
