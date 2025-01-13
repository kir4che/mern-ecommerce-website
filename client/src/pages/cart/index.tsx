import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { preventInvalidInput, handleQuantityChange, handleAddToCart, calculateFreeShipping } from "@/utils/cartUtils";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Alert from "@/components/atoms/Alert";

import { ReactComponent as CartImg } from "@/assets/images/ecommerce-cart-illustration.inline.svg";
import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";
import { ReactComponent as MinusIcon } from "@/assets/icons/minus.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";
import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";
import { ReactComponent as DeliveryTrunkIcon } from "@/assets/icons/delivery-trunk.inline.svg"

import "swiper/css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, error: cartError, totalAmount, removeFromCart, addToCart, changeQuantity, clearCart } = useCart();
  const { data } = useAxios<{ products: Product[] }>("/products");
  const products = data?.products as Product[];

  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef(null);

  const { refresh: createOrder } = useAxios("/orders",
    {
      method: "POST",
      withCredentials: true,
      data: {
        orderItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount
      },
    },
    {
      immediate: false,
      onSuccess: data => {
        console.log("order created:", data)
        clearCart();
        navigate(`/checkout/${data.order._id}`);
      },
      onError: () => {
        setError("訂單送出失敗，請稍後再試！");
      }
    }
  );

  const handleCheckout = () => {
    setError(null);
    createOrder({
      orderItems: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
    });
  };

  if (cartError) return <NotFound message={[cartError]} />;

  return !cart || cart.length === 0 ? (
    <Layout className="flex flex-col items-center justify-center gap-8 px-4 -mt-16 md:flex-row">
      <CartImg className="w-full max-w-96 sm:w-96" />
      <div className="space-y-6 text-center md:text-left">
        <p className="text-xl">購物車是空的，快去選購吧！</p>
        <Button onClick={() => navigate("/collections/all")} className="px-10">
          繼續購物
        </Button>
      </div>
    </Layout>
  ) : (
    <Layout className="relative flex flex-col w-full max-w-screen-xl px-5 py-8 mx-auto bg-secondary xl:px-0 md:flex-row gap-x-12">
      <div className="space-y-4 md:w-3/4">
        <div className="flex items-center justify-between">
          <h2>購物車</h2>
          <Button variant="link" onClick={() => setModalOpen(true)} className="text-primary">
            清空購物車
          </Button>
          <Modal
            isOpen={isModalOpen}
            onConfirm={() => clearCart()}
            onClose={() => setModalOpen(false)}
            title="確定要清空購物車嗎？"
          />
        </div>
        <div className="px-6 bg-white rounded-lg shadow">
          <ul className="flex flex-col py-5 gap-y-6">
            {cart.sort((a, b) => (b.product.countInStock > 0 ? 1 : -1) - (a.product.countInStock > 0 ? 1 : -1)).map((item) => (
              <li className={`flex w-full gap-x-4 ${item.product.countInStock <= 0 && "opacity-50"}`} key={item.productId}>
                <Link
                  to={`/products/${item.productId}`}
                  target="_blank"
                  className={`w-36 ${item.product.countInStock <= 0 && "pointer-events-none"}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="object-cover rounded aspect-square"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/144x144?text=No Image")}
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/products/${item.productId}`}
                      className={`font-medium ${item.product.countInStock <= 0 && "text-gray-400 pointer-events-none"}`}
                    >
                      {item.product.title}
                    </Link>
                    <Button
                      variant="icon"
                      icon={CloseIcon}
                      className="bg-white border-none h-fit"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </div>
                  <p className={`text-sm ${item.product.countInStock <= 0 ? "text-gray-400" : ""}`}>
                    NT${item.product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    {item.product.countInStock <= 0 ? (
                      <span className="font-semibold text-red-500">已售完</span>
                    ) : (
                      <div className="flex items-center">
                        <Button
                          variant="icon"
                          icon={MinusIcon}
                          className="bg-white border-gray-200 rounded-none h-7"
                          onClick={() =>
                            handleQuantityChange(item.quantity - 1, {
                              _id: item._id,
                              countInStock: item.product.countInStock,
                            }, value => changeQuantity(item._id, value))
                          }
                          disabled={item.quantity <= 1}
                        />
                        <Input
                          type="number"
                          min={1}
                          max={item.product.countInStock}
                          value={item.quantity}
                          defaultValue={1}
                          onChange={(e) =>
                            handleQuantityChange(e, { _id: item._id,
                              countInStock: item.product.countInStock
                            }, value => changeQuantity(item._id, value))
                          }
                          onKeyDown={preventInvalidInput}
                          disabled={item.product.countInStock <= 0}
                          className="noInnerSpin"
                          inputStyle="min-h-7 border-gray-200"
                        />
                        <Button
                          variant="icon"
                          icon={PlusIcon}
                          className="bg-white border-gray-200 rounded-none h-7"
                          onClick={() =>
                            handleQuantityChange(item.quantity + 1, {
                              _id: item._id,
                              countInStock: item.product.countInStock,
                            }, value => changeQuantity(item._id, value))
                          }
                          disabled={item.quantity >= item.product.countInStock}
                        />
                      </div>
                    )}
                    <p className={`text-lg font-semibold ${item.product.countInStock <= 0 && "text-gray-400"}`}>
                      NT${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* 免運門檻通知 */}
          <p className={`flex font-medium items-center gap-2 py-3 text-sm border-t ${calculateFreeShipping(totalAmount).isFreeShipping && ' text-orange-500'}`}>
            <DeliveryTrunkIcon className="w-6 h-6" />
            {calculateFreeShipping(parseInt(totalAmount)).message}
          </p>
        </div>
        {/* 推薦商品區塊 */}
        {products && products.length > 0 && (
          <div className="px-6 pt-4 pb-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">推薦商品！！！</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="icon"
                  icon={ArrowLeftIcon}
                  onClick={() => swiperRef.current?.slidePrev()}
                  className='bg-white border-none h-fit'
                />
                <Button
                  variant="icon"
                  icon={ArrowRightIcon}
                  onClick={() => swiperRef.current?.slideNext()}
                  className='bg-white border-none h-fit'
                />
              </div>
            </div>
            <Swiper
              slidesPerView={5}
              spaceBetween={24}
              loop
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {products.filter(item => item.tags.includes('推薦')).map(product => (
                <SwiperSlide className="block min-w-40" key={product._id}>
                  <Link to={`/products/${product._id}`} className="flex flex-col items-center gap-2" target="_blank">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full mb-2 rounded aspect-square"
                      onError={(e) => e.currentTarget.src = 'https://placehold.co/144x144?text=No Image'}
                      loading="lazy"
                    />
                    <p className="text-sm">{product.title}</p>
                    <p className="text-sm">NT${product.price.toLocaleString()}</p>
                  </Link>
                  <Button
                    key={product._id}
                    onClick={() => handleAddToCart(product, 1, addToCart)}
                    className='w-full h-8 mt-4 text-sm rounded-sm text-primary'
                  >
                    我要加購
                  </Button>
                </SwiperSlide>
              ))}
          </Swiper>
          </div>
        )}
      </div>
      {/* 小計明細  */}
      <div className="pt-12 md:w-1/4">
        <h3 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-400">
          小計明細
        </h3>
        <p className="flex justify-between">
          <span className="font-medium">商品金額</span>
          <span>NT${totalAmount}</span>
        </p>
        <p className="flex justify-between pt-2 pb-10 mt-6 font-medium border-t border-gray-400">
          <span>小計</span>
          <span className="font-semibold">NT${totalAmount}</span>
        </p>
        <Button className="w-full" onClick={handleCheckout} disabled={cart.length === 0}>
          前往付款
        </Button>
      </div>
      {error && <Alert type="error" message="訂單送出失敗，請稍後再試！" className="absolute transform -translate-x-1/2 w-fit top-6 left-1/2" />}
    </Layout>
  );
};

export default Cart;
