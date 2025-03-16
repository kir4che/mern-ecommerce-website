import { useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { linkToCategory } from "@/utils/linkToCategory";
import {
  preventInvalidInput,
  handleQuantityChange,
  handleAddToCart,
} from "@/utils/cartUtils";
import { addComma } from "@/utils/addComma";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";
import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.inline.svg";

import "swiper/css";
import "swiper/css/navigation";

const ProductSlider = () => {
  const { cart, addToCart } = useCart();
  const { data, isLoading, isError, refresh } = useAxios("/products");
  const products = data?.products as Product[];

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [retryState, setRetryState] = useState({
    count: 0,
    delay: 1000,
  });
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (retryState.count >= 3 || isRetrying) return;
    setIsRetrying(true);

    try {
      await refresh();
      setRetryState({ count: 0, delay: 1000 });
    } catch (err: any) {
      setRetryState((prev) => ({
        count: prev.count + 1,
        delay: prev.delay * 2,
      }));
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
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
  }

  return (
    <div className="relative">
      <Swiper
        centeredSlides
        spaceBetween={24}
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        navigation
        breakpoints={{
          0: { slidesPerView: 1 },
          520: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          800: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.25 },
          1280: { slidesPerView: 3.6 },
          1440: { slidesPerView: 4 },
          1720: { slidesPerView: 5 },
        }}
        style={
          {
            "--swiper-navigation-color": "#252525",
            "--swiper-navigation-size": "2rem",
          } as React.CSSProperties
        }
        className={isError ? "opacity-70" : ""}
      >
        {products &&
          products
            .filter((item) => item.tags.includes("推薦"))
            .map((product) => (
              <SwiperSlide key={product._id}>
                <section
                  className={`relative sm:max-w-80 ${isError ? "pointer-events-none" : ""}`}
                >
                  <div className="absolute z-10">
                    <h3
                      className={`px-2 mb-2 text-xl w-fit bg-primary text-secondary ${isError ? "bg-opacity-50" : ""}`}
                    >
                      {product.title}
                    </h3>
                    <ul className="flex items-center gap-1.5">
                      {product.categories.map((category, index) => (
                        <li
                          key={index}
                          className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary"
                        >
                          <Link to={`/collections/${linkToCategory[category]}`}>
                            # {category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ProductLinkImg
                    product={product}
                    data={data}
                    isError={isError}
                  />
                  <div className="flex flex-col gap-6 py-2 pl-4 border-l-2 border-primary">
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-semibold">
                        NT$ {addComma(product.price)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          label="數量"
                          min={1}
                          max={product.countInStock}
                          value={quantities[product._id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              Number(e.target.value),
                              product,
                              (value) =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [product._id]: value,
                                })),
                            )
                          }
                          onKeyDown={preventInvalidInput}
                          disabled={product.countInStock <= 0}
                          wrapperStyle="flex items-center gap-2"
                          inputStyle="rounded-none"
                        />
                        <Button
                          key={product._id}
                          variant="icon"
                          icon={PlusIcon}
                          onClick={() =>
                            handleAddToCart(
                              product,
                              quantities[product._id],
                              addToCart,
                              (value) =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [product._id]: value,
                                })),
                            )
                          }
                          disabled={
                            product.countInStock <= 0 ||
                            cart.find((item) => item.productId === product._id)
                              ?.quantity >= product.countInStock
                          }
                          className="w-6 h-6 border-primary hover:border-primary hover:bg-primary"
                          iconStyle="hover:stroke-secondary"
                        />
                      </div>
                    </div>
                    <p
                      className={`overflow-hidden line-clamp-3 text-ellipsis ${product.allergens.length > 0 ? "mb-6" : ""}`}
                    >
                      {product.description}
                    </p>
                    {product.allergens.length > 0 && (
                      <div className="flex justify-between text-nowrap">
                        <p className="text-xs text-gray-400">過敏原標示</p>
                        <p className="text-xs">
                          {product.allergens.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
