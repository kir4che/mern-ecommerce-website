import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Link } from "react-router-dom";
import useGetData from "../../../hooks/useGetData";

const Campaign = () => {
  const { data } = useGetData("/posts");
  const posts = data?.posts;
  const swiperRef = useRef(null);

  return (
    <section className="campaign">
      <div className="flex items-center justify-between border-t px-[2.5vw] md:px-0 border-primary/30 mx-[2.5vw] pt-2 ">
        <h1 className="space-x-2 text-2xl font-normal md:text-lg">
          <span>Campaign & Pickup</span>
          <span className="text-base font-medium md:text-xxs">/ 店家推薦</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="space-x-2 font-light text-xxs">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <button
                onClick={() => swiperRef.current.slideTo(index)}
                key={index}
              >
                0{item}
              </button>
            ))}
          </div>
          <button onClick={() => swiperRef.current.slidePrev()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="10"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                fill="#081122"
                fillRule="evenodd"
                d="M0 4.772 4.419.353a.5.5 0 0 1 .707.707L1.414 4.772l3.712 3.711a.5.5 0 0 1-.707.707L0 4.772Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button onClick={() => swiperRef.current.slideNext()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="10"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                fill="#081122"
                fillRule="evenodd"
                d="M5.271 4.565.853 8.984a.5.5 0 1 1-.708-.708l3.712-3.711L.145.854A.5.5 0 1 1 .853.146L5.27 4.565Z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Swiper
        slidesPerView={5}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        modules={[Autoplay]}
        breakpoints={{
          0: {
            slidesPerView: 1.6,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 12,
          },
          1280: {
            slidesPerView: 4.5,
            spaceBetween: 18,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {posts &&
          posts.slice(0, 5).map((post) => (
            <SwiperSlide key={post._id}>
              <Link to={`/blogs/news/${post._id}`}>
                <img src={post.imageUrl} alt={post.title} />
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};

export default Campaign;
