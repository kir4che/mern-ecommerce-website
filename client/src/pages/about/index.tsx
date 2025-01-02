import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ABOUT, SHOP_INFO, SHOP_LIST } from "@/data";

import Layout from "@/layouts/AppLayout";
import Breadcrumb from "@/components/molecules/Breadcrumb";

import shop1 from "@/assets/images/about/shop1.jpg";
import shop2 from "@/assets/images/about/shop2.jpg";
import shop3 from "@/assets/images/about/shop3.jpg";
import shop4 from "@/assets/images/about/shop4.jpg";
import shop5 from "@/assets/images/about/shop5.jpg";

const About = () => {
  const shopImages = [shop1, shop2, shop3, shop4, shop5];

  return (
    <Layout>
      <section className="px-5 pt-4 bg-center bg-no-repeat bg-cover md:px-8 bg-about-cover">
        <Breadcrumb text={ABOUT.title} textColor="text-secondary" />
        <div className="max-w-6xl py-40 mx-auto space-y-8 text-secondary">
          <div className="space-y-1">
            <p>About us</p>
            <h2 className="text-4xl leading-normal">{ABOUT.title}</h2>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: ABOUT.description2.replace(/\n/g, "<br/>"),
            }}
            className="sm:max-w-md drop-shadow"
          />
        </div>
      </section>
      <section className="py-12">
        {ABOUT.details.map((detail, index) => (
          <section
            key={index}
            className="px-5 pt-4 pb-12 border-t border-primary md:px-8"
          >
            <h2 className="mb-3 text-lg md:text-sm md:mb-0">
              <span className="mr-2 text-xl font-light md:text-base">{`0${index + 1}`}</span>
              {detail.title}
            </h2>
            <div className="flex flex-col-reverse gap-6 mx-auto md:items-center md:justify-between md:max-w-6xl md:flex-row">
              <div className="flex-1 space-y-6">
                <h3
                  dangerouslySetInnerHTML={{
                    __html: detail.heading.replace(/\n/g, "<br/>"),
                  }}
                  className="text-3xl leading-normal"
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: detail.content.replace(/\n/g, "<br/>"),
                  }}
                  className="sm:max-w-md"
                />
              </div>
              <div className="flex-1">
                <img
                  src={detail.image}
                  alt={detail.title.toLowerCase().split(" / ")[1]}
                  className="object-cover rounded w-full max-h-96 md:max-h-[640px]"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ))}
      </section>
      <Swiper
        loop
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={7000}
        slidesPerView={4}
        spaceBetween={0}
        modules={[Autoplay]}
      >
        {shopImages.map((image, index) => (
          <SwiperSlide key={index} className="min-w-72">
            <img
              src={image}
              className="h-[450px] opacity-85 object-cover w-full"
              alt={`shop${index + 1}`}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <section className="max-w-5xl px-5 py-12 mx-auto space-y-6 md:px-8">
        <div>
          <h2 className="text-4xl">Store Info</h2>
          <p>店家資訊</p>
        </div>
        {SHOP_LIST.map((shop) => (
          <div
            key={shop.name}
            className="flex flex-col justify-between md:flex-row gap-y-6 gap-x-10"
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
                <span className="ml-1.5 text-lg font-normal text-primary/45">
                  {shop.alias}
                </span>
              </p>
              <ul>
                {shop.info && Object.keys(shop.info).length > 0 ? (
                  Object.entries(shop.info).map(([key, value]) => (
                    <li key={key} className="py-2">
                      <span className="px-2 py-1 mr-2 font-medium rounded bg-primary/10">
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
    </Layout>
  );
};

export default About;
