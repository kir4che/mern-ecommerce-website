import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useGetData } from "@/hooks/useGetData";

import Layout from "@/layouts/AppLayout";
import Button from "@/components/atoms/Button";
import Marquee from "@/components/atoms/Marquee";
import DropdownMenu from "@/components/atoms/DropdownMenu";
import ProductSlider from "@/components/molecules/ProductSlider";

import bg1 from "@/assets/images/about/bg1.jpg";
import bg2 from "@/assets/images/about/bg2.jpg";
import bg3 from "@/assets/images/about/bg3.jpg";
import shop1 from "@/assets/images/shops/shop1.jpg";
import shop2 from "@/assets/images/shops/shop2.jpg";
import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";

const categories = [
  { label: "全部", value: "/collections/all" },
  { label: "推薦", value: "/collections/recommend" },
  { label: "麵包", value: "/collections/bread" },
  { label: "蛋糕", value: "/collections/cake" },
  { label: "餅乾", value: "/collections/cookie" },
  { label: "其他", value: "/collections/other" },
];

const shopInfo = {
  address: "地址",
  time: "營業時間",
  phone: "電話",
  traffic: "交通方式",
};

const shops = [
  {
    name: "日出本店",
    alias: "Sunrise",
    info: {
      address: "台北市大安區忠孝東路四段 123 號",
      time: "週一至週日 08:00 - 20:00",
      phone: "02-1234-5678",
      traffic: "捷運忠孝復興站 2 號出口",
    },
    imageUrl: shop1,
  },
  {
    name: "日出二店",
    alias: "",
    imageUrl: shop2,
  },
];

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
    <h2 className={`text-lg ${className}`}>
      {title}
      <span className="ml-2 text-sm">/ {subtitle}</span>
    </h2>
  );

  return (
    <Layout>
      {/* 跑馬燈 & 商品類別 */}
      <section className="relative px-4 pb-[6vw] sm:pb-10 md:px-8">
        <div className="relative overflow-hidden md:flex md:items-center md:justify-between">
          <div className="border-b border-primary">
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
          </div>
          <div className="mt-4 ml-auto text-right md:m-0 md:absolute md:right-0">
            <DropdownMenu title="從類別中尋找商品" list={categories} />
          </div>
        </div>
        <div className="py-8">
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
                className="space-y-2.5 hover:underline hover:underline-offset-4"
              >
                <img
                  src={newsItem.imageUrl}
                  alt={newsItem.title}
                  className="object-cover w-full max-h-40"
                />
                <p className="text-base font-medium line-clamp-1">
                  {newsItem.title}
                </p>
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
          <h3 className="text-4xl">
            日出麵包坊
            <br />
            手工麵包
            <br />
            新鮮・美味
            <br />
            精選食材，吃得安心。
          </h3>
          <div className="flex flex-col justify-between gap-y-10 md:items-end md:flex-row">
            <p className="max-w-md text-sm md:max-w-xs">
              日出麵包坊位於台灣，是一家擁有濃厚鄉村風情的麵包店。我們以追求最新鮮的食材和最美味的口感為己任，致力於為您提供每天的美好開始。在日出麵包坊，我們與當地農產者建立了深厚的合作關係，以確保我們的麵包和點心始終新鮮、安全，並且滿足您對品質的嚴格要求。我們希望透過每一口麵包，為您的一天帶來新的活力和愉悅。
            </p>
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
      {/* Shop List */}
      <section className="max-w-screen-xl px-5 mx-auto my-12 space-y-3 md:px-8">
        <hr className="w-full border-primary/30" />
        {renderTitle("Shop List", "店家一覽")}
        <div className="flex flex-col gap-y-4 gap-x-12 md:flex-row">
          {shops.map((shop) => (
            <div key={shop.name} className="flex flex-col w-full gap-4">
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="object-cover w-full h-60 md:h-72"
                loading="lazy"
              />
              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-base font-medium">{shop.name}</p>
                  <p className="text-xs text-primary/45">{shop.alias}</p>
                </div>
                <ul className="text-sm leading-7">
                  {shop.info && Object.keys(shop.info).length > 0 ? (
                    Object.entries(shop.info).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{shopInfo[key]}：</span>
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
        <ul className="">
          {news?.slice(0, 3).map(({ _id, date, category, title }) => (
            <li key={_id}>
              <Link
                to={`/news/${_id}`}
                className="flex flex-wrap items-center justify-between py-4 border-b border-dashed gap-y-2 border-primary/80 whitespace-nowrap"
              >
                <p className="text-sm leading-7 text-wrap hover:underline hover:underline-offset-4">
                  <span className="px-2.5 py-1 mr-2 text-sm font-light rounded-full bg-primary text-secondary">
                    {category}
                  </span>
                  {title}
                </p>
                <p className="text-xs font-light">{date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default App;
