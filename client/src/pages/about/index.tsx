import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ABOUT, SHOP_INFO, SHOP_LIST } from "@/constants/data";

import BlurImage from "@/components/atoms/BlurImage";
import Breadcrumb from "@/components/molecules/Breadcrumb";

import shop1 from "@/assets/images/about/shop1.jpg";
import shop2 from "@/assets/images/about/shop2.jpg";
import shop3 from "@/assets/images/about/shop3.jpg";
import shop4 from "@/assets/images/about/shop4.jpg";
import shop5 from "@/assets/images/about/shop5.jpg";

import "swiper/css";

const shopImages = [shop1, shop2, shop3, shop4, shop5];

const About = () => (
  <>
    <section className="relative px-5 pt-4 bg-center bg-no-repeat bg-cover md:px-8 bg-about-cover w-full">
      <div className="absolute inset-0 bg-linear-to-b to-black/25 via-black/35 from-white/15 z-0 pointer-events-none" />
      <div className="relative z-10">
        <Breadcrumb text={ABOUT.title} textColor="text-white" link="about" />
        <div className="max-w-6xl py-40 mx-auto space-y-8 text-white">
          <div className="space-y-1">
            <p className="text-base">About us</p>
            <h2 className="text-4xl leading-normal">{ABOUT.title}</h2>
          </div>
          <p className="whitespace-pre-line leading-7.5 sm:max-w-125 drop-shadow">
            {ABOUT.description2}
          </p>
        </div>
      </div>
    </section>
    <section className="py-12">
      {ABOUT.details.map((detail, index) => (
        <section
          key={detail.title}
          className="px-5 pt-4 pb-12 border-t border-primary md:px-8"
        >
          <h2 className="mb-3 text-lg md:text-sm md:mb-0">
            <span className="mr-2 text-2xl font-light">{`0${index + 1}`}</span>
            {detail.title}
          </h2>
          <div className="flex max-md:flex-col-reverse gap-6 mx-auto md:items-center md:justify-between md:max-w-6xl">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl leading-normal whitespace-pre-line">
                {detail.heading}
              </h3>
              <p className="sm:max-w-md whitespace-pre-line">
                {detail.content}
              </p>
            </div>
            <div className="flex-1">
              <BlurImage
                src={detail.image}
                alt={detail.title.toLowerCase().split(" / ")[1]}
                className="object-cover rounded w-full max-h-96 md:max-h-120"
              />
            </div>
          </div>
        </section>
      ))}
    </section>
    <div className="w-full overflow-hidden max-w-[100vw]">
      <Swiper
        slidesPerView={4}
        spaceBetween={0}
        modules={[Autoplay]}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={7000}
        loop
        allowTouchMove={false}
        className="w-full [&>.swiper-wrapper]:ease-linear!"
        breakpoints={{
          0: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4 },
        }}
      >
        {shopImages.map((image, index) => (
          <SwiperSlide key={image}>
            <BlurImage
              src={image}
              className="h-112.5 opacity-85 object-cover w-full"
              alt={`shop${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <section className="max-w-5xl px-5 py-12 mx-auto space-y-6 md:px-8">
      <div>
        <h2 className="text-4xl">Store Info</h2>
        <p className="text-base">店家資訊</p>
      </div>
      {SHOP_LIST.map((shop) => (
        <div
          key={shop.name}
          className="flex max-md:flex-col justify-between gap-y-6 gap-x-10"
        >
          <div className="flex-1 max-w-xl">
            <img
              src={shop.imageUrl}
              alt={shop.name}
              className="object-cover w-full max-h-60 md:max-h-80"
              loading="lazy"
            />
          </div>
          <div className="space-y-4 md:space-y-8 md:min-w-96">
            <p className="text-2xl font-medium">
              {shop.name}
              <span className="ml-1.5 text-base font-normal text-primary/45">
                {shop.alias}
              </span>
            </p>
            <ul>
              {shop.info && Object.keys(shop.info).length > 0 ? (
                Object.entries(shop.info).map(([key, value]) => (
                  <li key={key} className="py-2">
                    <span className="px-2 py-1 mr-3 text-sm font-medium rounded bg-primary/10">
                      {SHOP_INFO[key]}
                    </span>
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
    </section>
  </>
);

export default About;
