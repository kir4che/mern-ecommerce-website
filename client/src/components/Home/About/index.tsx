import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import bg1 from "../../../assets/images/about/bg1.jpg";
import bg2 from "../../../assets/images/about/bg2.jpg";
import bg3 from "../../../assets/images/about/bg3.jpg";

const About = () => {
  return (
    <section className="relative pt-10 pb-16 overflow-hidden min-h-screenwithh">
      <h1 className="relative px-[2.5vw] md:px-0 text-2xl md:text-lg z-20 font-normal border-t border-white mx-[2.5vw] pt-2 space-x-2 text-secondary">
        <span>About us</span>
        <span className="text-base font-medium md:text-xxs">/ 日出麵包坊</span>
      </h1>
      <div className="relative px-[5vw] space-y-10 z-20 pt-[12vw] md:pt-[8vw] text-secondary">
        <h3 className="text-5xl md:text-4.5xl">
          日出麵包坊
          <br />
          手工麵包
          <br />
          新鮮・美味
          <br />
          精選食材，吃得安心。
        </h3>
        <div className="flex flex-col justify-between gap-12 md:gap-0 md:items-end md:flex-row">
          <p className="max-w-md leading-7 md:max-w-xs md:text-xs md:leading-6">
            日出麵包坊位於台灣，是一家擁有濃厚鄉村風情的麵包店。我們以追求最新鮮的食材和最美味的口感為己任，致力於為您提供每天的美好開始。在日出麵包坊，我們與當地農產者建立了深厚的合作關係，以確保我們的麵包和點心始終新鮮、安全，並且滿足您對品質的嚴格要求。我們希望透過每一口麵包，為您的一天帶來新的活力和愉悅。
          </p>
          <Link
            to="/pages/about"
            className="flex items-center w-full gap-3 hover:underline md:justify-end"
          >
            <span className="text-lg font-medium md:text-sm">了解更多</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="12"
              fill="none"
              viewBox="0 0 7 12"
            >
              <path
                fill="#ffffff"
                fillRule="evenodd"
                d="M.353.353a.5.5 0 0 1 .708 0l5.553 5.554-5.553 5.553a.5.5 0 0 1-.708-.707L5.2 5.907.353 1.061a.5.5 0 0 1 0-.708Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={0}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        speed={15000}
        loop
        modules={[Autoplay]}
        className="absolute top-0 left-0 flex w-full"
      >
        <SwiperSlide className="max-w-fit">
          <img
            src={bg1}
            alt="bg1"
            className="block object-cover object-bottom"
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide className="max-w-fit">
          <img
            src={bg2}
            alt="bg2"
            className="block object-cover object-bottom w-100"
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide className="max-w-fit">
          <img
            src={bg3}
            alt="bg3"
            className="block object-cover object-bottom w-[674px]"
            loading="lazy"
          />
        </SwiperSlide>
      </Swiper>
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/50"></div>
    </section>
  );
};

export default About;
