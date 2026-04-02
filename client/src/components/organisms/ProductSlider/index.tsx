import { Link } from "react-router";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useGetProductsQuery } from "@/store/slices/apiSlice";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { linkToCategory } from "@/utils/linkToCategory";

import Button from "@/components/atoms/Button";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";
import ProductSliderSkeleton from "@/components/atoms/ProductSliderSkeleton";
import ProductActionForm from "@/components/molecules/ProductActionForm";

import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

import "swiper/css";
import "swiper/css/navigation";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1 },
  520: { slidesPerView: 1.5 },
  640: { slidesPerView: 2 },
  800: { slidesPerView: 2.5 },
  1024: { slidesPerView: 3.25 },
  1280: { slidesPerView: 3.6 },
  1440: { slidesPerView: 4 },
  1720: { slidesPerView: 5 },
};

const ProductCard = ({ product }: { product: Product }) => (
  <div className="card">
    <figure className="relative">
      <ProductLinkImg product={product} />
      <div className="absolute top-4 left-0 z-10">
        <span className="badge badge-primary rounded-none text-nowrap text-xl h-10 tracking-wider text-white font-medium">
          {product.title}
        </span>
      </div>
    </figure>
    <div className="card-body">
      <div className="flex flex-wrap -mt-6">
        {product.categories.map((category) => (
          <Link
            key={category}
            to={`/collections/${linkToCategory[category]}`}
            className="badge h-7 badge-outline hover:bg-primary hover:text-white transition-colors"
          >
            # {category}
          </Link>
        ))}
      </div>
      <p className="line-clamp-3 text-sm h-22">{product.description}</p>
      {product.allergens.length > 0 && (
        <div className="flex-between text-xs py-2.5 border-t border-gray-200">
          <span className="text-gray-500">過敏原標示</span>
          <span className="text-gray-700 font-medium">
            {product.allergens.join(", ")}
          </span>
        </div>
      )}
      <div className="card-actions flex-between gap-2">
        <p className="text-2xl font-bold text-nowrap">
          NT$ {addComma(product.price)}
        </p>
        <ProductActionForm product={product} variant="card" />
      </div>
    </div>
  </div>
);

const ProductSlider = () => {
  const { data, isLoading, error, refetch, isFetching } = useGetProductsQuery({
    tag: "推薦",
  });

  if (isLoading) return <ProductSliderSkeleton />;

  if (error)
    return (
      <div className="flex-center flex-col min-h-72">
        <p className="text-xl font-semibold">抱歉，暫時無法取得商品資訊。</p>
        <p className="text-gray-700">請檢查網路連線後重試</p>
        <Button
          icon={RefreshIcon}
          onClick={refetch}
          disabled={isFetching}
          className="text-sm py-2 mt-4"
        >
          {isFetching ? "載入中" : "重新載入"}
        </Button>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-72 flex-center">
        <p className="text-xl font-semibold">目前沒有任何推薦的商品</p>
      </div>
    );

  const availableProducts = data.products.filter(
    (product) => product.countInStock >= 1
  );

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={32}
        modules={[Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={availableProducts.length > 5}
        breakpoints={SWIPER_BREAKPOINTS}
        data-testid="swiper"
      >
        {availableProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
