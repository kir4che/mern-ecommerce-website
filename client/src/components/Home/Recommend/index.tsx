import Header from "./Header";

import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import RecommendProducts from "./Products";

const Recommend = () => {
  return (
    <section className="relative px-5 pb-[6vw] sm:pb-10 md:px-8">
      <Header />
      <div className="py-10">
        <RecommendProducts />
      </div>
      <Link
        to="/collections/all"
        className="flex items-center justify-end w-full gap-3 hover:underline"
      >
        <span className="text-lg font-medium sm:text-base">商品一覽</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="7"
          height="12"
          fill="none"
          viewBox="0 0 7 12"
        >
          <path
            fill="#081122"
            fillRule="evenodd"
            d="M.353.353a.5.5 0 0 1 .708 0l5.553 5.554-5.553 5.553a.5.5 0 0 1-.708-.707L5.2 5.907.353 1.061a.5.5 0 0 1 0-.708Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </section>
  );
};

export default Recommend;
