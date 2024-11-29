import { useEffect } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import Layout from "@/layouts/AppLayout";

import aboutItem from "@/assets/images/about/about-item.jpg";
import aboutMission from "@/assets/images/about/about-mission.jpg";
import aboutPolicy from "@/assets/images/about/about-policy.jpg";
import aboutPosture from "@/assets/images/about/about-posture.jpg";
import aboutPride from "@/assets/images/about/about-pride.jpg";
import shop1 from "@/assets/images/about/shop1.jpg";
import shop2 from "@/assets/images/about/shop2.jpg";
import shop3 from "@/assets/images/about/shop3.jpg";
import shop4 from "@/assets/images/about/shop4.jpg";
import shop5 from "@/assets/images/about/shop5.jpg";
import shop from "@/assets/images/shops/shop1.jpg";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <section className="px-8 pt-2 bg-center bg-no-repeat bg-cover min-h-screenwithh bg-about-cover">
        <Breadcrumb text="日光麵包坊" textColor="text-secondary" />
        <div className="space-y-8 md:px-[5vw] h-fit py-36 md:py-40 text-secondary">
          <div className="md:space-y-1">
            <p className="text-1.5xl md:text-base">About us</p>
            <h1 className="-ml-1 text-4xl md:text-2.5xl">日光麵包坊</h1>
          </div>
          <p className="leading-7 drop-shadow md:leading-6 md:max-w-xs md:text-sm">
            一家位於台北市的小巧麵包店，以精選食材和獨特手藝打造美味營養的麵包。與小麥農戶合作，直接從田野挑選最優質的小麥，確保每片麵包蘊含豐富營養。堅持使用新鮮、當季食材，讓每位顧客品味到最美味口感。
            <br />
            我們不僅是麵包店，更是注入愛與用心的烘焙之地。師傅們擁有豐富經驗和熱愛烘焙，細緻打磨從麵團揉製到烤製的每一個細節。期待每次相遇成為味蕾冒險，用心製作的麵包，願成為您每天清晨的陽光，為您帶來美好的一天。
          </p>
        </div>
      </section>
      <section className="py-10 space-y-20">
        <article className="border-t border-primary mx-[4.2vw] md:mx-[2.5vw]">
          <div className="flex items-baseline gap-2 mt-2 mb-8 md:mb-0">
            <p className="text-3xl md:text-base">01</p>
            <h2 className="md:text-sm">Our Mission / 使命</h2>
          </div>
          <div className="flex flex-col-reverse gap-5 md:items-center md:justify-end md:flex-row md:gap-[8vw]">
            <div className="space-y-8">
              <h3 className="text-4.5xl md:text-3xl">
                美味、新鮮
                <br />
                美好的早晨始於，
                <br />
                我們用心製作的麵包。
              </h3>
              <p className="md:max-w-lg md:text-sm">
                在日出麵包坊，我們的使命是提供客戶最美味、最新鮮的麵包，每天都為他們的生活注入一份美好的開始。我們深信，一個美好的早晨始於一口香噴噴的麵包，而這正是我們存在的意義。
                <br />
                <br />
                我們致力於每天都以最高的標準和熱情製作各種口味的麵包，滿足不同客戶的需求。從簡單的法國麵包到創意無限的特色麵包，我們的使命是將美味帶給大家，讓您的每一天都充滿能量和滿足感。
                <br />
                <br />
                讓我們一同迎接每天的日出，開始一天美好的旅程，從日出麵包坊出發。
              </p>
            </div>
            <img
              src={aboutMission}
              alt="mission"
              className="h-[72vw] md:h-[600px] object-cover object-top w-screen md:w-[45vw]"
              loading="lazy"
            />
          </div>
        </article>
        <article className="border-t border-primary mx-[4.2vw] md:mx-[2.5vw]">
          <div className="flex items-baseline gap-2 mt-2 mb-8 md:mb-0">
            <p className="text-3xl md:text-base">02</p>
            <h2 className="md:text-sm">Our Pride / 驕傲</h2>
          </div>
          <div className="flex flex-col-reverse gap-5 md:items-center md:justify-end md:flex-row md:gap-[8vw]">
            <div className="space-y-8">
              <h3 className="text-4.5xl md:text-3xl">
                品味驕傲，
                <br />
                從日出的工藝開始。
              </h3>
              <p className="md:max-w-lg md:text-sm">
                日出麵包坊的驕傲在於我們的製作工藝。每一個麵包都是由我們經驗豐富的烘焙師傅精心製作，用心挑選優質原材料，確保每一口都是一種享受。
                <br />
                <br />
                我們引以為傲的不僅是麵包的味道，更是我們對品質的承諾。我們追求卓越，不斷創新，以確保每一種麵包都能為客戶帶來滿足感，成為他們生活中不可或缺的一部分。
                <br />
                <br />
                在日出麵包坊，我們以每一款麵包為傲，因為它們不僅代表著我們的工藝水準，更代表著我們對品質的堅持。
              </p>
            </div>
            <img
              src={aboutPride}
              alt="pride"
              className="h-[72vw] md:h-[600px] object-cover object-center w-screen md:w-[45vw]"
              loading="lazy"
            />
          </div>
        </article>
        <article className="border-t border-primary mx-[4.2vw] md:mx-[2.5vw]">
          <div className="flex items-baseline gap-2 mt-2 mb-8 md:mb-0">
            <p className="text-3xl md:text-base">03</p>
            <h2 className="md:text-sm">Our Policy / 政策</h2>
          </div>
          <div className="flex flex-col-reverse gap-5 md:items-center md:justify-end md:flex-row md:gap-[8vw]">
            <div className="space-y-8">
              <h3 className="text-4.5xl md:text-3xl">
                新鮮是我們的承諾，
                <br />
                品質是我們的保證。
              </h3>
              <p className="md:max-w-lg md:text-sm">
                堅持使用最優質的原材料為基石，每天清晨開始，用心製作新鮮的麵包。這不僅為客戶帶來新鮮的口感，更是我們對品質的承諾，讓客戶品嚐到的不僅是美味，更是健康和安心。
                <br />
                <br />
                我們的堅持不僅體現在原材料的挑選上，更體現在烘焙過程的細緻掌控。從配方的挑選到烘焙的準確掌握，每一個步驟都是為了確保客戶得到的是最高水準的產品。我們嚴格遵守衛生標準，確保每一位烘焙師傅都具備高度的專業素養，使我們的政策成為客戶信任的保證。
              </p>
            </div>
            <img
              src={aboutPolicy}
              alt="policy"
              className="h-[72vw] md:h-[600px] object-cover object-center w-screen md:w-[45vw]"
              loading="lazy"
            />
          </div>
        </article>
        <article className="border-t border-primary mx-[4.2vw] md:mx-[2.5vw]">
          <div className="flex items-baseline gap-2 mt-2 mb-8 md:mb-0">
            <p className="text-3xl md:text-base">04</p>
            <h2 className="md:text-sm">Our Posture / 態度</h2>
          </div>
          <div className="flex flex-col-reverse gap-5 md:items-center md:justify-end md:flex-row md:gap-[8vw]">
            <div className="space-y-8">
              <h3 className="text-4.5xl md:text-3xl">
                以熱情為原料，
                <br />
                用心製作每一個微笑。
              </h3>
              <p className="md:max-w-lg md:text-sm">
                我們對待烘焙的態度不僅是一種手藝，更是一份熱情的表達。我們相信，以熱情為原料，製作每一個微笑，是我們能夠為客戶提供最美味麵包的秘密。
                <br />
                <br />
                我們的烘焙師傅並非只是技術嫻熟的製作者，更是用心將愛和熱情注入每一個麵包的創作者。從搓麵團到烘焙出爐，每一個步驟都反映了我們對品質的堅持和對客戶滿意度的高度關注。
                <br />
                <br />
                我們相信，微笑是最美味的語言，而本店的每一個麵包都是用心製作出的，希望能為客戶帶來滿滿的微笑。
              </p>
            </div>
            <img
              src={aboutPosture}
              alt="posture"
              className="h-[72vw] md:h-[600px] object-cover object-center w-screen md:w-[45vw]"
              loading="lazy"
            />
          </div>
        </article>
        <article className="border-t border-primary mx-[4.2vw] md:mx-[2.5vw]">
          <div className="flex items-baseline gap-2 mt-2 mb-8 md:mb-0">
            <p className="text-3xl md:text-base">05</p>
            <h2 className="md:text-sm">Our Item / 商品</h2>
          </div>
          <div className="flex flex-col-reverse gap-5 md:items-center md:justify-end md:flex-row md:gap-[8vw]">
            <div className="space-y-8">
              <h3 className="text-4.5xl md:text-3xl">
                口感奇蹟
                <br />
                每一口都是幸福的味道
                <br />
                味蕾的精選之地
              </h3>
              <p className="md:max-w-lg md:text-sm">
                日出麵包坊擁有多元的商品系列，滿足不同顧客的口味需求。從傳統的法國麵包到創意十足的特色麵包，我們的商品豐富多樣，絕對能滿足您的每一種味蕾。
                <br />
                <br />
                我們引入當地和國際的優質食材，精心搭配各種口味，以創造獨特而美味的麵包。無論您喜歡清新的果味、濃郁的巧克力還是濃郁的奶油，我們都有適合您的選擇。
                <br />
                <br />
                日出麵包坊的商品不僅是食物，更是一場對味覺的饗宴。我們的商品系列將為您帶來無限的驚喜，讓您每天都能品嚐到不同的美味。
              </p>
            </div>
            <img
              src={aboutItem}
              alt="item"
              className="h-[72vw] md:h-[600px] object-cover object-center w-screen md:w-[45vw]"
              loading="lazy"
            />
          </div>
        </article>
      </section>
      <section>
        <h1 className="mt-2 mb-3 space-x-2 text-2xl border-t border-primary mx-[4.2vw] md:mx-[2.5vw] font-normal md:text-lg">
          <span>Store</span>
          <span className="text-base font-medium md:text-xxs">/ 店家</span>
        </h1>
        <Swiper
          slidesPerView={4}
          spaceBetween={0}
          autoplay={{
            delay: 0,
          }}
          speed={6500}
          loop
          modules={[Autoplay]}
        >
          <SwiperSlide className="min-w-72">
            <img
              src={shop1}
              className="h-[450px] object-cover w-full"
              alt="shop1"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide className="min-w-72">
            <img
              src={shop2}
              className="h-[450px] object-cover w-full"
              alt="shop2"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide className="min-w-72">
            <img
              src={shop3}
              className="h-[450px] object-cover w-full"
              alt="shop3"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide className="min-w-72">
            <img
              src={shop4}
              className="h-[450px] object-cover w-full"
              alt="shop4"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide className="min-w-72">
            <img
              src={shop5}
              className="h-[450px] object-cover w-full"
              alt="shop5"
              loading="lazy"
            />
          </SwiperSlide>
        </Swiper>
      </section>
      <section className="flex flex-col justify-center max-w-6xl px-[5vw] pt-8 pb-12 mx-auto md:w-fit">
        <div className="mb-6 leading-tight md:mb-0">
          <h2 className="text-5xl">Store Info</h2>
          <p className="text-xl font-medium md:text-sm">店家資訊</p>
        </div>
        <div className="flex flex-col-reverse justify-center gap-4 md:items-end md:flex-row md:gap-[6vw]">
          <div className="space-y-6 md:space-y-10 md:pl-5 md:border-l border-primary">
            <h3 className="space-x-1.5 text-3.5xl md:text-xl">
              <span>日光本店</span>
              <span className="text-xl font-light md:text-sm">Sunrise</span>
            </h3>
            <div className="space-y-3 text-base md:text-xxs">
              <p className="space-x-5 md:space-x-3">
                <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200">
                  地址
                </span>
                <span className="font-medium">
                  <a
                    href="https://maps.app.goo.gl/qNLAEC3tF2YbEG5v6"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    104 臺北市中山區民生西路 30 號 1 樓
                  </a>
                </span>
              </p>
              <p className="space-x-5 md:space-x-3">
                <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200">
                  營業時間
                </span>
                <span className="font-medium">週一至週日 11:00 - 21:00</span>
              </p>
              <p className="space-x-5 md:space-x-3">
                <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200">
                  電話
                </span>
                <span className="font-medium">02-2517-7189</span>
              </p>
              <p className="space-x-5 md:space-x-3">
                <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200">
                  交通方式
                </span>
                <span className="font-medium">雙連站1號出口步行約 2 分鐘</span>
              </p>
            </div>
          </div>
          <img
            src={shop}
            alt="sunrise shop"
            className="object-cover w-full md:w-[45vw] h-max max-h-[45vw] md:max-h-[25vw]"
            loading="lazy"
          />
        </div>
      </section>
    </Layout>
  );
};

export default About;
