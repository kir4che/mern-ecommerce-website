import { useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useCart } from "@/context/CartContext";
import { useGetData } from "@/hooks/useGetData";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";

import "swiper/css";
import "swiper/css/navigation";

const ProductSlider = () => {
  const { addToCart } = useCart();
  const { data } = useGetData("/products");
  const products = data?.products || [];
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      product,
      quantity: quantities[product._id],
    });
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
  };

  return (
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
    >
      {products.map((product) => (
        <SwiperSlide key={product._id}>
          <section className="relative sm:max-w-80">
            <div className="absolute z-10">
              <h3 className="px-2 mb-3 text-xl w-fit bg-primary text-secondary">
                {product.title}
              </h3>
              <ul className="flex gap-1.5">
                {product.categories.map((category, index) => (
                  <li
                    key={index}
                    className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary"
                  >
                    # {category}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={`/products/${product._id}`}
              className="relative inline-block overflow-hidden rounded-full aspect-square img-with-overlay"
            >
              <img
                src={product.imageUrl}
                height="360px"
                width="360px"
                alt={product.title}
                className="object-cover w-full h-full object-center duration-700 ease-out scale-[1.2]"
              />
              <div className="hidden overlay">
                <p className="absolute z-10 font-light underline -translate-x-1/2 -translate-y-1/2 text-secondary top-1/2 left-1/2">
                  查看更多
                </p>
                <div className="absolute inset-0 rounded-full bg-primary/50" />
              </div>
            </Link>
            <div className="flex flex-col gap-6 py-2 pl-4 border-l-2 border-primary">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-medium">NT${product.price}</p>
                <div className="flex items-center gap-2">
                  <label className="text-sm">數量</label>
                  <Input
                    type="number"
                    min={1}
                    max={product.countInStock}
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product._id, Number(e.target.value))
                    }
                  />
                  <Button
                    variant="icon"
                    icon={PlusIcon}
                    onClick={() => handleAddToCart(product)}
                    className="w-6 h-6 border stroke-primary hover:stroke-secondary bg-secondary border-primary hover:bg-primary"
                  />
                </div>
              </div>
              <p className="line-clamp-3 mb-6 overflow-hidden text-ellipsis min-h-24">
                {product.description}
              </p>
              <div className="flex justify-between text-nowrap">
                <p className="text-sm text-gray-400">過敏原標示</p>
                <p className="text-sm">
                  {product.allergens.join(", ")}
                </p>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSlider;
