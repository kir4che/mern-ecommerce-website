import { useState } from "react";
import { Link } from 'react-router-dom';
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { linkToCategory } from "@/utils/linkToCategory";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";
import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.inline.svg";

import "swiper/css";
import "swiper/css/navigation";

const ProductSlider = () => {
  const { addToCart } = useCart();
  const { data, isLoading, error, refresh } = useAxios("/products", {
    method: "GET",
  });
  const products = data?.products || [];
  
  const [quantities, setQuantities] = useState({});
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
    } catch (error) {
      setRetryState((prev) => ({
        count: prev.count + 1,
        delay: prev.delay * 2,
      }));
    } finally {
      setIsRetrying(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!product.countInStock) {
      // 如果庫存為 0，顯示提示
      alert("商品暫時無法購買，請稍後再試");
      return;
    }

    addToCart({
      id: product._id,
      product,
      quantity: quantities[product._id] || 1,
    });
    setQuantities(prev => ({ ...prev, [product._id]: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="mb-4 text-xl text-gray-800">
          抱歉，暫時無法取得商品資訊
        </p>
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
          <p className="mt-4 text-sm text-gray-500">
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
        style={{
          "--swiper-navigation-color": "#252525",
          "--swiper-navigation-size": "2rem",
        } as React.CSSProperties}
        className={error && 'opacity-70'}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <section className={`relative sm:max-w-80 ${error && 'pointer-events-none'}`}>
              <div className="absolute z-10">
                <h3 className={`px-2 mb-3 text-xl w-fit bg-primary text-secondary ${error && 'bg-opacity-50'}`}>
                  {product.title}
                </h3>
                <ul className="flex items-center gap-1.5">
                  {product.categories.map((category, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary"
                    >
                      <Link to={`/collections/${linkToCategory[category]}`}># {category}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <ProductLinkImg product={product} data={data} error={error} />
              <div className="flex flex-col gap-6 py-2 pl-4 border-l-2 border-primary">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-medium">NT${product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">數量</label>
                    <Input
                      type="number"
                      min={1}
                      max={product.countInStock}
                      value={quantities[product._id]}
                      defaultValue={1}
                      disabled={product.countInStock === 0}
                      onChange={(e) =>
                        setQuantities(prev => ({ ...prev, [product._id]: Number(e.target.value) }))
                      }
                    />
                    <Button
                      variant="icon"
                      icon={PlusIcon}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0}
                      className='w-6 h-6 stroke-primary hover:stroke-secondary bg-secondary hover:border-primary hover:bg-primary'
                    />
                  </div>
                </div>
                <p className="mb-6 overflow-hidden line-clamp-3 text-ellipsis min-h-24">
                  {product.description}
                </p>
                <div className="flex justify-between text-nowrap">
                  <p className="text-sm text-gray-400">過敏原標示</p>
                  <p className="text-sm">{product.allergens.join(", ")}</p>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
