import { Link, useParams } from "react-router-dom";
import Error from "../../error";
import Layout from "../../../layouts/AppLayout";
import Loading from "../../../components/Loading";
import useGetData from "../../../hooks/useGetData";

const Post = () => {
  const { id } = useParams();
  const { data, loading, error } = useGetData(`/posts/${id}`);
  const post = data?.post;

  if (loading) return <Loading />;
  else if (!loading && !post) return <Error message={[error]} />;

  return (
    <Layout>
      <article className="px-[5vw] mx-auto py-14">
        <section className="max-w-5xl mx-auto">
          <div className="flex items-center gap-5 pb-10 border-b border-gray-400">
            <time className="py-1 pr-4 text-sm font-light border-r border-gray-400">
              {post.date}
            </time>
            <h1 className="text-3xl font-medium">{post.title}</h1>
          </div>
        </section>
        <section className="max-w-5xl pt-12 pb-20 mx-auto space-y-10">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="object-cover object-center w-full md:h-[40vw]"
            loading="lazy"
          />
          <p className="leading-8 whitespace-pre-line">{post.content}</p>
        </section>
        <section className="border-t border-gray-400">
          <Link
            to="/blogs/news"
            className="flex items-center justify-end gap-2 pt-2 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="12"
              fill="none"
              viewBox="0 0 7 12"
            >
              <path
                fill="#081122"
                d="M6.262.353a.5.5 0 0 1 0 .708L1.415 5.907l4.847 4.846a.5.5 0 1 1-.708.707L.001 5.907 5.554.353a.5.5 0 0 1 .708 0Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            回上一頁
          </Link>
        </section>
      </article>
    </Layout>
  );
};

export default Post;
