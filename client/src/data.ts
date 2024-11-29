import shop1 from "@/assets/images/shops/shop1.jpg";
import shop2 from "@/assets/images/shops/shop2.jpg";

export const CATEGORY_LIST = [
  { label: "全部", value: "/collections/all" },
  { label: "推薦", value: "/collections/recommend" },
  { label: "麵包", value: "/collections/bread" },
  { label: "蛋糕", value: "/collections/cake" },
  { label: "餅乾", value: "/collections/cookie" },
  { label: "其他", value: "/collections/other" },
];

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
