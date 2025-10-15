import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import type { Product } from "@/types/product";
import type { ProductsResponse } from "@/types/api";
import { useAxios } from "@/hooks/useAxios";
import { linkToCategory } from "@/utils/linkToCategory";
import { addComma } from "@/utils/addComma";

import AddToCartInputBtn from "@/components/molecules/AddToCartInputBtn";
import Loading from "@/components/atoms/Loading";
import Button from "@/components/atoms/Button";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

import "swiper/css";
import "swiper/css/navigation";

interface ProductCardProps {
  product: Product;
}

const ProductSlider = () => {
  const { data, isLoading, isError, refresh } =
    useAxios<ProductsResponse>("/products");
  const products = data?.products ?? [];
  const [retryState, setRetryState] = useState({
    count: 0,
    delay: 1000,
  });
  const [isRetrying, setIsRetrying] = useState(false);

  const recommendedProducts = useMemo(
    () => products.filter((item) => item.tags.includes("推薦")),
    [products]
  );

  const handleRetry = useCallback(async () => {
    if (retryState.count >= 3 || isRetrying) return;
    setIsRetrying(true);

    try {
      await refresh();
      setRetryState({ count: 0, delay: 1000 });
    } catch {
      setRetryState((prev) => ({
        count: prev.count + 1,
        delay: prev.delay * 2,
      }));
    } finally {
      setIsRetrying(false);
    }
  }, [retryState.count, isRetrying, refresh]);

  const swiperBreakpoints = useMemo(
    () => ({
      0: { slidesPerView: 1 },
      520: { slidesPerView: 1.5 },
      640: { slidesPerView: 2 },
      800: { slidesPerView: 2.5 },
      1024: { slidesPerView: 3.25 },
      1280: { slidesPerView: 3.6 },
      1440: { slidesPerView: 4 },
      1720: { slidesPerView: 5 },
    }),
    []
  );

  const swiperStyles = useMemo(
    () => ({
      "--swiper-navigation-color": "#252525",
      "--swiper-navigation-size": "2rem",
    }),
    []
  );

  if (isLoading)
    return (
      <div
        data-testid="loading-wrapper"
        className="flex items-center justify-center min-h-[200px]"
      >
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="mb-4 text-xl text-gray-800">抱歉，暫時無法取得商品資訊</p>
        <p className="mb-6 text-gray-600">
          {retryState.count < 3 ? "請點擊下方按鈕重試" : "請稍後再試"}
        </p>
        <Button
          onClick={handleRetry}
          disabled={retryState.count >= 3 || isRetrying}
          icon={RefreshIcon}
          className="flex items-center gap-2"
        >
          {isRetrying ? "重試中..." : "重新載入"}
        </Button>
        {retryState.count >= 3 && (
          <p className="mt-4 text-gray-500">
            您可以：
            <br />
            1. 檢查網路連線
            <br />
            2. 重新整理頁面
            <br />
            3. 稍後再試
          </p>
        )}
      </div>
    );

  if (!recommendedProducts.length)
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-600">
        <p>目前沒有推薦商品</p>
      </div>
    );

  return (
    <div className="relative">
      <Swiper
        spaceBetween={20}
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={recommendedProducts.length > 3}
        navigation
        breakpoints={swiperBreakpoints}
        style={swiperStyles as React.CSSProperties}
        className={`${isError ? "opacity-70" : ""} swiper-container`}
      >
        {recommendedProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <section className="relative sm:max-w-80">
      <div className="absolute z-10 p-2">
        <h3 className="px-2 mb-2 text-xl w-fit bg-primary text-secondary rounded">
          {product.title}
        </h3>
        <ul className="flex items-center gap-1.5 flex-wrap">
          {product.categories.map((category, index) => (
            <li
              key={index}
              className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary hover:bg-primary hover:text-secondary transition-colors duration-200"
            >
              <Link to={`/collections/${linkToCategory[category]}`}>
                # {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ProductLinkImg product={product} />
      <div className="flex flex-col gap-4 py-2 pl-4 border-l-2 border-primary">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-primary">
            NT$ {addComma(product.price)}
          </p>
          <AddToCartInputBtn product={product} />
        </div>
        <div className="h-20">
          <p
            className={`overflow-hidden line-clamp-3 leading-6 text-ellipsis text-gray-700 ${
              product.allergens.length > 0 ? "mb-2" : ""
            }`}
          >
            {product.description}
          </p>
        </div>
        {product.allergens.length > 0 && (
          <div className="flex justify-between items-center text-nowrap border-t pt-2">
            <p className="text-xs text-gray-400">過敏原標示</p>
            <p className="text-xs text-gray-600">
              {product.allergens.join(", ")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSlider;
