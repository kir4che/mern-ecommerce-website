import { useMemo, useRef } from "react";
import { Link } from "react-router";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BlurImage from "@/components/atoms/BlurImage";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ProductSlider from "@/components/organisms/ProductSlider";
import { ABOUT, CATEGORY_LIST, SHOP_INFO, SHOP_LIST } from "@/constants/data";
import { useGetNewsQuery } from "@/store/slices/apiSlice";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import aboutBg from "@/assets/images/about/about-bg.jpg";

const SectionTitle = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className?: string;
}) => (
  <h2 className={cn("text-xl", className)}>
    {title}
    <span className="ml-2 text-sm font-normal text-inherit/80">
      / {subtitle}
    </span>
  </h2>
);

const App = () => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const { data } = useGetNewsQuery({});

  const newsList = useMemo(() => data?.news ?? [], [data]);
  const campaignNews = useMemo(() => newsList.slice(0, 8), [newsList]);
  const latestNews = useMemo(() => newsList.slice(0, 5), [newsList]);

  return (
    <div className="w-full">
      <section className="px-5 pb-8 md:px-8">
        <div className="relative">
          <div className="flex h-16 items-center overflow-hidden border-b border-primary">
            {[1, 2].map((group) => (
              <div
                key={`marquee-group-${group}`}
                className="flex shrink-0 animate-[marquee-right_50s_linear_infinite]"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <p
                    key={`item-${group}-${index}`}
                    className="mx-4 flex items-baseline gap-x-1 text-2xl font-medium"
                  >
                    Recommend
                    <span className="text-base font-normal">／本店推薦</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute w-45 right-0 top-16 z-10 ml-auto mt-4 md:top-3 md:m-0">
            <Select defaultText="從類別中尋找商品" options={CATEGORY_LIST} />
          </div>
        </div>
        <div className="pt-24 md:pt-10">
          <ProductSlider />
        </div>
        <Link
          to="/collections/all"
          className="flex items-center justify-end gap-2 group"
        >
          商品一覽
          <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
      {campaignNews.length > 0 && (
        <section className="px-5 pb-10 md:px-8">
          <div className="mb-4 flex items-center gap-2">
            <SectionTitle
              title="Campaign & Pickup"
              subtitle="最新活動"
              className="text-nowrap"
            />
            <hr className="w-full flex-1 border-primary/30" />
            <Button
              variant="icon"
              icon={ArrowLeftIcon}
              onClick={() => swiperRef.current?.slidePrev()}
              className="hover:opacity-70"
              aria-label="上一個活動"
            />
            <Button
              variant="icon"
              icon={ArrowRightIcon}
              onClick={() => swiperRef.current?.slideNext()}
              className="hover:opacity-70"
              aria-label="下一個活動"
            />
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
            {campaignNews.map((newsItem) => (
              <SwiperSlide key={newsItem._id}>
                <Link
                  to={`/news/${newsItem._id}`}
                  className="group space-y-2 block"
                >
                  <div className="w-full h-32 md:h-40 overflow-hidden rounded-sm">
                    <BlurImage
                      src={newsItem.imageUrl}
                      alt={newsItem.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-1 font-medium transition-colors group-hover:text-primary">
                    {newsItem.title}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
      <section className="relative w-full overflow-hidden pb-20 pt-12 md:pb-40">
        <div className="absolute inset-0 z-0 size-full">
          <BlurImage
            src={aboutBg}
            alt="日出麵包坊背景"
            className="block size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 size-full bg-black/50 pointer-events-none" />
        <div className="relative z-20 mx-auto mb-10 max-w-screen-2xl px-5 md:px-8">
          <hr className="mb-3 w-full border-white/70" />
          <SectionTitle
            title="About us"
            subtitle="日出麵包坊"
            className="text-white"
          />
        </div>
        <div className="relative z-20 mx-auto space-y-8 max-w-screen-2xl px-5 text-white md:px-8">
          <h3 className="whitespace-pre-line text-4xl font-bold leading-normal drop-shadow-md">
            {ABOUT.slogan}
          </h3>
          <div className="flex max-md:flex-col justify-between gap-y-10 md:items-end">
            <p className="whitespace-pre-line drop-shadow-sm sm:max-w-sm">
              {ABOUT.description}
            </p>
            <Link
              to="/about"
              className="flex items-center justify-end gap-2 text-white hover:underline hover:underline-offset-4 group"
            >
              了解更多
              <ArrowRightIcon className="size-5 stroke-white transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto my-12 w-full max-w-7xl space-y-3 px-5 md:px-8">
        <hr className="w-full border-primary/30" />
        <SectionTitle title="Shop List" subtitle="店家一覽" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 pt-4">
          {SHOP_LIST.map((shop) => (
            <div key={shop.name} className="flex w-full flex-col gap-3 group">
              <img
                src={shop.imageUrl}
                alt={shop.name}
                className="h-60 w-full object-cover md:h-72"
                loading="lazy"
              />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {shop.name}
                  <span className="ml-2 text-sm font-normal text-primary/60">
                    {shop.alias}
                  </span>
                </p>
                <ul className="text-sm leading-loose text-gray-600">
                  {shop.info && Object.keys(shop.info).length > 0 ? (
                    Object.entries(shop.info).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{SHOP_INFO[key]}：</span>
                        {value}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">即將開幕，敬請期待</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      {latestNews.length > 0 && (
        <section className="mx-auto my-12 w-full max-w-7xl px-5 md:px-8">
          <hr className="w-full border-primary/30" />
          <div className="flex-between my-4">
            <SectionTitle title="News" subtitle="最新消息" />
            <Link
              to="/news"
              className="text-sm flex-center gap-1 hover:underline hover:underline-offset-4 text-primary"
            >
              查看全部消息 <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <ul>
            {latestNews.map(({ _id, date, category, title }) => (
              <li
                key={_id}
                className="border-b border-dashed border-primary/30 py-3 transition-colors hover:bg-slate-50/50"
              >
                <Link
                  to={`/news/${_id}`}
                  className="flex max-sm:flex-col sm:items-center justify-between gap-y-2"
                >
                  <p className="flex items-center gap-3 transition-colors hover:text-primary">
                    <span className="px-2 badge badge-neutral text-xs text-nowrap rounded-full">
                      {category}
                    </span>
                    <span className="font-medium line-clamp-1">{title}</span>
                  </p>
                  <time className="font-light text-right text-gray-500 text-sm">
                    {formatDate(date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default App;
