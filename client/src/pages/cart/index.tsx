import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";
import {
  preventInvalidInput,
  handleQuantityChange,
  calculateFreeShipping,
} from "@/utils/cartUtils";
import { addComma } from "@/utils/addComma";

import Layout from "@/layouts/AppLayout";
import Modal from "@/components/molecules/Modal";
import AddToCartBtn from "@/components/molecules/AddToCartInputBtn/AddToCartBtn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import { ReactComponent as CartImg } from "@/assets/images/ecommerce-cart-illustration.inline.svg";
import { ReactComponent as PlusIcon } from "@/assets/icons/plus.inline.svg";
import { ReactComponent as MinusIcon } from "@/assets/icons/minus.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";
import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";
import { ReactComponent as DeliveryTrunkIcon } from "@/assets/icons/delivery-trunk.inline.svg";

import "swiper/css";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    error: cartError,
    subtotal,
    removeFromCart,
    changeQuantity,
    clearCart,
  } = useCart();
  const { showAlert } = useAlert();
  const swiperRef = useRef(null);

  const sortedCart = [...cart].sort(
    (a, b) =>
      Number(b.product.countInStock > 0) - Number(a.product.countInStock > 0),
  );
  const freeShippingInfo = calculateFreeShipping(subtotal);

  const { data } = useAxios("/products");
  const products = data?.products as Product[];

  const { refresh: createOrder } = useAxios(
    "/orders",
    {
      method: "POST",
      withCredentials: true,
    },
    {
      immediate: false,
      onSuccess: (data) => {
        clearCart();
        navigate(`/checkout/${data.order._id}`);
      },
      onError: () =>
        showAlert({
          variant: "error",
          message: "訂單送出失敗，請稍後再試！",
        }),
    },
  );

  const handleCheckout = () => {
    createOrder({
      orderItems: cart.map(({ productId, product, quantity }) => ({
        productId,
        ...product,
        quantity,
        amount: product.price * quantity,
      })),
      subtotal,
      shippingFee: freeShippingInfo.shippingFee,
    });
  };

  useEffect(() => {
    if (cartError) showAlert({ variant: "error", message: cartError });
  }, [cartError, showAlert]);

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
          <Button
            variant="link"
            onClick={() =>
              (
                document.getElementById("clearCartModal") as HTMLDialogElement
              ).showModal()
            }
            className="text-primary"
          >
            清空購物車
          </Button>
          <Modal
            id="clearCartModal"
            onConfirm={clearCart}
            title="確定要清空購物車嗎？"
            showAlert
          />
        </div>
        <div className="px-6 bg-white rounded-lg shadow">
          <ul className="flex flex-col py-5 gap-y-6">
            {sortedCart.map((item) => (
              <li
                className={`flex w-full gap-x-4 ${item.product.countInStock <= 0 ? "opacity-50" : ""}`}
                key={item.productId}
              >
                <Link
                  to={`/products/${item.productId}`}
                  target="_blank"
                  className={`w-36 ${item.product.countInStock <= 0 ? "pointer-events-none" : ""}`}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="object-cover rounded aspect-square"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/144x144?text=No Image")
                    }
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/products/${item.productId}`}
                      className={`font-medium ${item.product.countInStock <= 0 ? "text-gray-400 pointer-events-none" : ""}`}
                    >
                      {item.product.title}
                    </Link>
                    <Button
                      variant="icon"
                      icon={CloseIcon}
                      className="border-none h-fit"
                      onClick={() => removeFromCart(item._id)}
                    />
                  </div>
                  <p
                    className={
                      item.product.countInStock <= 0 ? "text-gray-400" : ""
                    }
                  >
                    NT$ {addComma(item.product.price)}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    {item.product.countInStock <= 0 ? (
                      <span className="font-semibold text-red-500">已售完</span>
                    ) : (
                      <div className="flex items-center">
                        <Button
                          variant="icon"
                          icon={MinusIcon}
                          className="border-gray-200 rounded-none h-7"
                          onClick={() =>
                            handleQuantityChange(
                              item.quantity - 1,
                              {
                                _id: item._id,
                                countInStock: item.product.countInStock,
                              },
                              (value) => changeQuantity(item._id, value),
                            )
                          }
                          disabled={item.quantity <= 1}
                        />
                        <Input
                          type="number"
                          min={1}
                          max={item.product.countInStock}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              Number(e.target.value),
                              {
                                _id: item._id,
                                countInStock: item.product.countInStock,
                              },
                              (value) => changeQuantity(item._id, value),
                            )
                          }
                          onKeyDown={preventInvalidInput}
                          disabled={item.product.countInStock <= 0}
                          wrapperStyle="noInnerSpin"
                          inputStyle="min-h-7 rounded-none border-gray-200"
                        />
                        <Button
                          variant="icon"
                          icon={PlusIcon}
                          className="border-gray-200 rounded-none h-7"
                          onClick={() =>
                            handleQuantityChange(
                              item.quantity + 1,
                              {
                                _id: item._id,
                                countInStock: item.product.countInStock,
                              },
                              (value) => changeQuantity(item._id, value),
                            )
                          }
                          disabled={item.quantity >= item.product.countInStock}
                        />
                      </div>
                    )}
                    <p
                      className={`text-lg font-semibold ${item.product.countInStock <= 0 ? "text-gray-400" : ""}`}
                    >
                      NT$ {addComma(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* 免運門檻通知 */}
          <p
            className={`flex font-medium items-center gap-2 py-3 border-t ${freeShippingInfo.isFreeShipping ? " text-orange-500" : ""}`}
          >
            <DeliveryTrunkIcon className="w-6 h-6" />
            {freeShippingInfo.message}
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
                  className="border-none h-fit"
                />
                <Button
                  variant="icon"
                  icon={ArrowRightIcon}
                  onClick={() => swiperRef.current?.slideNext()}
                  className="border-none h-fit"
                />
              </div>
            </div>
            <Swiper
              slidesPerView={Math.min(5, products.length)}
              spaceBetween={24}
              loop={products.length > 5}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {" "}
              {products
                .filter((item) => item.tags.includes("推薦"))
                .map((product) => (
                  <SwiperSlide className="block min-w-28" key={product._id}>
                    <Link
                      to={`/products/${product._id}`}
                      className={`flex flex-col gap-2 ${product.countInStock <= 0 ? "opacity-50 pointer-events-none" : ""}`}
                      target="_blank"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="object-cover w-full mb-2 rounded aspect-square"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/144x144?text=No Image")
                        }
                        loading="lazy"
                      />
                      <p className="line-clamp-1">{product.title}</p>
                      <p>NT$ {addComma(product.price)}</p>
                    </Link>
                    <AddToCartBtn
                      btnType="text"
                      title="我要加購"
                      btnStyle="w-full h-8 mt-4 text-sm rounded-sm text-primary"
                      showIcon={false}
                      product={product}
                      quantity={1}
                    />
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
          <span>NT$ {addComma(subtotal)}</span>
        </p>
        <p className="flex justify-between pt-2 pb-10 mt-6 font-medium border-t border-gray-400">
          <span>小計</span>
          <span className="font-semibold">NT$ {addComma(subtotal)}</span>
        </p>
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={!cart?.length}
        >
          前往付款
        </Button>
      </div>
    </Layout>
  );
};

export default Cart;
