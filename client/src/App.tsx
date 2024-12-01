import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useGetData } from "@/hooks/useGetData";
import { formatDate } from "@/utils/formatDate";
import { CATEGORY_LIST, ABOUT, SHOP_INFO, SHOP_LIST } from "@/data";

import Layout from "@/layouts/AppLayout";
import Button from "@/components/atoms/Button";
import Marquee from "@/components/atoms/Marquee";
import DropdownMenu from "@/components/atoms/DropdownMenu";
import ProductSlider from "@/components/molecules/ProductSlider";

import bg1 from "@/assets/images/about/bg1.jpg";
import bg2 from "@/assets/images/about/bg2.jpg";
import bg3 from "@/assets/images/about/bg3.jpg";
import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";

const App = () => {
  const swiperRef = useRef(null);
  const { data } = useGetData("/news");
  const news = useMemo(() => {
    return (
      data?.news?.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ) || []
    );
  }, [data]);

  const renderTitle = (title: string, subtitle: string, className?: string) => (
    <h2 className={`text-xl ${className}`}>
      {title}
      <span className="ml-2 text-sm font-normal">/ {subtitle}</span>
    </h2>
  );

  return (
    <Layout>
      {/* 跑馬燈 & 商品類別 */}
      <section className="px-5 pb-8 md:px-8">
        <div className="relative md:border-b md:border-primary">
          <Marquee className="flex items-center gap-5 h-18">
            {Array.from({ length: 10 }, (_, index) => (
              <p
                className="flex items-baseline gap-2 text-2xl font-medium min-w-fit"
                key={index}
              >
                Recommend
                <span className="text-base font-normal">/ 本店推薦</span>
              </p>
            ))}
          </Marquee>
          <hr className="block border-b-1 border-primary md:hidden" />
          <div className="absolute right-0 z-10 mt-4 ml-auto text-right md:top-4 md:m-0">
            <DropdownMenu title="從類別中尋找商品" list={CATEGORY_LIST} />
          </div>
        </div>
        <div className="pt-24 pb-12 md:py-10">
          <ProductSlider />
        </div>
        <Link
          to="/collections/all"
          className="flex items-center justify-end gap-2 text-base font-medium hover:underline-offset-4 hover:underline"
        >
          商品一覽
          <ArrowRightIcon className="w-5 h-5 stroke-primary" />
        </Link>
      </section>
      {/* Campaign */}
      <section className="px-5 pb-10 md:px-8">
        <div className="flex flex-wrap items-center justify-between mb-2 ">
          <hr className="w-full border-primary/30" />
          {renderTitle("Campaign & Pickup", "最新活動")}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              icon={ArrowLeftIcon}
              onClick={() => swiperRef.current?.slidePrev()}
            />
            <Button
              variant="icon"
              icon={ArrowRightIcon}
              onClick={() => swiperRef.current?.slideNext()}
            />
          </div>
        </div>
        <Swiper
          slidesPerView="auto"
          centeredSlides
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            960: { slidesPerView: 4, spaceBetween: 20 },
            1152: { slidesPerView: 4.5, spaceBetween: 20 },
            1440: { slidesPerView: 5, spaceBetween: 24 },
            1600: { slidesPerView: 5.8, spaceBetween: 24 },
            1920: { slidesPerView: 6.4, spaceBetween: 32 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {news.slice(0, 8).map((newsItem) => (
            <SwiperSlide key={newsItem._id}>
              <Link
                to={`/news/${newsItem._id}`}
                className="space-y-1 hover:underline hover:underline-offset-4"
              >
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="object-cover w-full max-h-40"
                />
                <p className="font-medium line-clamp-1">{newsItem.title}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* About */}
      <section className="relative pt-12 pb-20 overflow-hidden md:pb-40">
        <div className="relative z-20 px-5 mx-auto mb-10 max-w-screen-2xl md:px-8">
          <hr className="w-full mb-3 border-secondary" />
          {renderTitle("About us", "日出麵包坊", "text-secondary")}
        </div>
        <div className="relative z-20 px-5 mx-auto space-y-8 max-w-screen-2xl md:px-8 text-secondary">
          <h3
            dangerouslySetInnerHTML={{
              __html: ABOUT.slogan.replace(/\n/g, "<br/>"),
            }}
            className="text-4xl leading-normal"
          />
          <div className="flex flex-col justify-between gap-y-10 md:items-end md:flex-row">
            <p
              dangerouslySetInnerHTML={{
                __html: ABOUT.description.replace(/\n/g, "<br/>"),
              }}
              className="sm:max-w-sm"
            />
            <Link
              to="/about"
              className="flex items-center justify-end gap-2 text-base font-medium hover:underline-offset-4 hover:underline"
            >
              了解更多
              <ArrowRightIcon className="w-5 h-5 stroke-secondary" />
            </Link>
          </div>
        </div>
        <Swiper
          slidesPerView="auto"
          spaceBetween={0}
          loop
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
          }}
          speed={15000}
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
      {/* Shop List */}
      <section className="max-w-screen-xl px-5 mx-auto my-12 space-y-3 md:px-8">
        <hr className="w-full border-primary/30" />
        {renderTitle("Shop List", "店家一覽")}
        <div className="flex flex-col gap-y-4 gap-x-12 md:flex-row">
          {SHOP_LIST.map((shop) => (
            <div key={shop.name} className="flex flex-col w-full gap-2">
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="object-cover w-full h-60 md:h-72"
                loading="lazy"
              />
              <div className="space-y-2">
                <p className="font-medium">
                  {shop.name}
                  <span className="ml-1.5 text-sm font-normal text-primary/45">
                    {shop.alias}
                  </span>
                </p>
                <ul className="text-sm leading-loose">
                  {shop.info && Object.keys(shop.info).length > 0 ? (
                    Object.entries(shop.info).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{SHOP_INFO[key]}：</span>
                        {value}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">即將開幕</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* News */}
      <section className="max-w-screen-xl px-5 mx-auto my-12 space-y-3 md:px-8">
        <hr className="w-full border-primary/30" />
        <div className="flex items-center justify-between">
          {renderTitle("News", "最新消息")}
          <Link
            to="/news"
            className="text-sm hover:underline hover:underline-offset-4"
          >
            View all
          </Link>
        </div>
        <ul>
          {news?.slice(0, 3).map(({ _id, date, category, title }) => (
            <li
              key={_id}
              className="py-4 border-b border-dashed border-primary/80"
            >
              <Link
                to={`/news/${_id}`}
                className="flex flex-wrap items-center justify-between gap-y-2"
              >
                <p className="text-wrap hover:underline hover:underline-offset-4">
                  <span className="px-2.5 inline-block py-1 mr-2 text-sm font-light rounded-full bg-primary text-secondary">
                    {category}
                  </span>
                  {title}
                </p>
                <p className="text-sm font-light">{formatDate(date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default App;
