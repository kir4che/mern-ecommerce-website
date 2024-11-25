import { Link } from "react-router-dom";
import useGetData from "../../../hooks/useGetData";

const News = () => {
  const { data } = useGetData("/posts");
  const posts = data?.posts;

  return (
    <section className="py-10 overflow-hidden">
      <div className="flex px-[2.5vw] md:px-0 items-center justify-between pt-2 border-t border-primary/30 mx-[2.5vw]">
        <h1 className="space-x-2 text-2xl font-normal md:text-lg">
          <span>News</span>
          <span className="text-base font-medium md:text-xxs">/ 最新消息</span>
        </h1>
        <Link to="/blogs/news" className="text-sm hover:underline">
          View all
        </Link>
      </div>
      <ul className="mx-auto md:pt-0 pt-8 px-[5vw] w-fit">
        {posts &&
          posts.slice(0, 3).map((post, index) => (
            <li key={index}>
              <Link
                to={`/blogs/news/${post._id}`}
                className="flex items-center gap-y-4 md:gap-y-0 py-4 border-b-[1.5px] md:border-b-[0.875px] border-dashed border-primary"
              >
                <div className="flex items-center gap-2 min-w-40 md:min-w-36 w-fit">
                  <p className="w-[4.85rem] text-sm font-light md:w-16 md:text-xxs">
                    {post.date}
                  </p>
                  <p className="px-3 py-1 text-sm font-light rounded-full min-w-fit text-secondary md:text-xxs bg-primary">
                    {post.category}
                  </p>
                </div>
                <p className="inline-block w-full text-base duration-500 ease-in-out md:text-sm md:inline hover:opacity-60">
                  {post.title}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default News;
