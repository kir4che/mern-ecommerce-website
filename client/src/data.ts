import shop1 from "@/assets/images/shops/shop1.jpg";
import shop2 from "@/assets/images/shops/shop2.jpg";

import aboutMission from "@/assets/images/about/about-mission.jpg";
import aboutPride from "@/assets/images/about/about-pride.jpg";
import aboutPolicy from "@/assets/images/about/about-policy.jpg";
import aboutPosture from "@/assets/images/about/about-posture.jpg";
import aboutItem from "@/assets/images/about/about-item.jpg";

export const CATEGORY_LIST = [
  { label: "全部", value: "/collections/all" },
  { label: "推薦", value: "/collections/recommend" },
  { label: "麵包", value: "/collections/bread" },
  { label: "蛋糕", value: "/collections/cake" },
  { label: "餅乾", value: "/collections/cookie" },
  { label: "其他", value: "/collections/other" },
];

export const ABOUT = {
  title: "日出麵包坊",
  slogan: "日出麵包坊\n手工麵包\n新鮮・美味\n精選食材，吃得安心。",
  description:
    "日出麵包坊位於台灣，是一家擁有濃厚鄉村風情的麵包店。我們以追求最新鮮的食材和最美味的口感為己任，致力於為您提供每天的美好開始。",
  description2:
    "一家位於台北市的小巧麵包店，以精選食材和獨特手藝打造美味營養的麵包。與小麥農戶合作，直接從田野挑選最優質的小麥，確保每片麵包蘊含豐富營養。堅持使用新鮮、當季食材，讓每位顧客品味到最美味口感。\n我們不僅是麵包店，更是注入愛與用心的烘焙之地。師傅們擁有豐富經驗和熱愛烘焙，細緻打磨從麵團揉製到烤製的每一個細節。期待每次相遇成為味蕾冒險，用心製作的麵包，願成為您每天清晨的陽光，為您帶來美好的一天。",
  details: [
    {
      title: "Our Mission / 使命",
      heading: "美味、新鮮\n美好的早晨始於，\n我們用心製作的麵包。",
      content: `在日出麵包坊，我們的使命是提供客戶最美味、最新鮮的麵包，每天都為他們的生活注入一份美好的開始。`,
      image: aboutMission,
    },
    {
      title: "Our Pride / 驕傲",
      heading: "品味驕傲，\n從日出的工藝開始。",
      content: `日出麵包坊的驕傲在於我們的製作工藝。每一個麵包都是由我們經驗豐富的烘焙師傅精心製作。`,
      image: aboutPride,
    },
    {
      title: "Our Policy / 政策",
      heading: "新鮮是我們的承諾，\n品質是我們的保證。",
      content: `堅持使用最優質的原材料為基石，每天清晨開始，用心製作新鮮的麵包。`,
      image: aboutPolicy,
    },
    {
      title: "Our Posture / 態度",
      heading: "以熱情為原料，\n用心製作每一個微笑。",
      content: `我們對待烘焙的態度不僅是一種手藝，更是一份熱情的表達。`,
      image: aboutPosture,
    },
    {
      title: "Our Item / 商品",
      heading: "口感奇蹟\n每一口都是幸福的味道\n味蕾的精選之地",
      content: `日出麵包坊擁有多元的商品系列，滿足不同顧客的口味需求。`,
      image: aboutItem,
    },
  ],
};

export const SHOP_INFO = {
  address: "地址",
  time: "營業時間",
  phone: "電話",
  traffic: "交通方式",
};

export const SHOP_LIST = [
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
