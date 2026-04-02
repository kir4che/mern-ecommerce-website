import { useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import AddToCartBtn from "@/components/atoms/AddToCartBtn";
import Button from "@/components/atoms/Button";
import CartSkeleton from "@/components/atoms/CartSkeleton";
import Input from "@/components/atoms/Input";
import CartItemRow from "@/components/molecules/CartItemRow";
import Modal, { type ModalRef } from "@/components/molecules/Modal";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartCoupon } from "@/hooks/useCartCoupon";
import { useGetProductsQuery } from "@/store/slices/apiSlice";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

import DeliveryTrunkIcon from "@/assets/icons/delivery-trunk.inline.svg?react";
import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import CartImg from "@/assets/images/ecommerce-cart-illustration.inline.svg?react";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    isLoading,
    error,
    totalQuantity,
    subtotal,
    shippingInfo,
    refetchCart,
    changeQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { showAlert } = useAlert();

  const swiperRef = useRef<SwiperType | null>(null);
  const clearModalRef = useRef<ModalRef>(null);

  const {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  } = useCartCoupon(subtotal);
  const { data: productsData } = useGetProductsQuery({
    tag: "推薦",
  });

  const finalAmount = useMemo(
    () => subtotal + shippingInfo.shippingFee - couponDiscount,
    [subtotal, shippingInfo.shippingFee, couponDiscount]
  );

  // 有庫存的在上面，缺貨的放最下面。
  const sortedCart = useMemo(() => {
    return [...cart].sort((a, b) => {
      const aStock = a.product.countInStock ?? 0;
      const bStock = b.product.countInStock ?? 0;
      return (bStock > 0 ? 1 : 0) - (aStock > 0 ? 1 : 0);
    });
  }, [cart]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showAlert({
        variant: "info",
        message: "請先登入會員，即可繼續完成結帳！",
      });
      navigate("/login", { state: { from: location } });
      return;
    }

    navigate("/checkout", {
      state: {
        coupon: getCheckoutCoupon(),
      },
    });
  };

  if (isLoading) return <CartSkeleton itemCount={cart.length || 3} />;

  if (error)
    return (
      <div className="flex-center max-md:flex-col gap-8 px-4 m-auto py-12">
        <CartImg className="w-full" />
        <div className="space-y-4 w-full text-center md:text-left">
          <h2>無法讀取購物車資料</h2>
          <p className="pb-4 text-gray-500">{error}，或請檢查您的網路狀態。</p>
          <Button
            onClick={() => refetchCart?.()}
            className="w-full md:w-40 h-11 rounded-full"
          >
            重新讀取
          </Button>
        </div>
      </div>
    );

  if (!cart || cart.length === 0)
    return (
      <div className="flex-center max-md:flex-col gap-8 px-4 m-auto">
        <CartImg className="w-full" />
        <div className="space-y-4 w-full text-center md:text-left">
          <h2>您的購物車是空的</h2>
          <p className="pb-4 text-gray-500">
            看起來您還沒有挑選任何美味的麵包呢！
          </p>
          <Button
            onClick={() => navigate("/collections/all")}
            className="w-full md:w-40 h-11 rounded-full"
          >
            去逛逛
          </Button>
        </div>
      </div>
    );

  return (
    <div className="relative flex max-md:flex-col w-full max-w-7xl px-5 py-8 mx-auto gap-8 lg:gap-12">
      <section className="flex-1 min-w-0 space-y-6">
        <div className="flex justify-between items-end">
          <h2>購物車 ({totalQuantity})</h2>
          <Button
            variant="link"
            onClick={() => clearModalRef.current?.showModal()}
          >
            清空購物車
          </Button>
          <Modal
            ref={clearModalRef}
            id="clearCartModal"
            onConfirm={clearCart}
            title="確定要清空購物車嗎？"
            showAlert
          />
        </div>
        <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="flex flex-col divide-y divide-gray-200 px-4 sm:px-6">
            {sortedCart.map((item) => {
              const isOutOfStock = (item.product.countInStock ?? 0) <= 0;

              return (
                <li
                  className={cn(
                    "flex w-full py-6 gap-4 sm:gap-6 transition-opacity",
                    isOutOfStock && "opacity-50"
                  )}
                  key={item.productId}
                >
                  <Link
                    to={`/products/${item.productId}`}
                    target="_blank"
                    className={cn(
                      "w-24 sm:w-32 shrink-0 rounded bg-gray-200 aspect-square",
                      isOutOfStock && "pointer-events-none"
                    )}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="object-cover size-full"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/144x144?text=No+Image")
                      }
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <div className="flex-between gap-2">
                      <Link
                        to={`/products/${item.productId}`}
                        className={cn(
                          "font-medium line-clamp-2 hover:text-gray-800",
                          isOutOfStock && "pointer-events-none"
                        )}
                      >
                        {item.product.title}
                      </Link>
                      <Button
                        variant="icon"
                        icon={CloseIcon}
                        className="hover:text-red-600"
                        onClick={() => {
                          void removeFromCart(item._id).catch((err) => {
                            showAlert({
                              variant: "error",
                              message: getErrorMessage(
                                err,
                                "移除商品失敗，請稍後再試！"
                              ),
                            });
                          });
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      NT$ {addComma(item.product.price)}
                    </p>
                    <div className="flex-between items-end mt-auto">
                      {isOutOfStock ? (
                        <span className="badge text-red-600 badge-outline font-medium">
                          已售完
                        </span>
                      ) : (
                        <CartItemRow
                          key={`${item._id}-${item.quantity}`}
                          item={item}
                          onChangeQuantity={changeQuantity}
                        />
                      )}
                      <p className="text-lg font-bold">
                        NT$ {addComma(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="flex font-medium text-primary items-center gap-2 text-sm sm:text-base">
              <DeliveryTrunkIcon className="size-5" />
              {shippingInfo.message}
            </p>
            <progress
              className="progress w-full mt-3 progress-warning"
              value={shippingInfo.progress}
              max="100"
            />
          </div>
        </div>
        {productsData?.products && productsData.products.length > 0 && (
          <section>
            <div className="flex-between mb-6">
              <h3 className="text-lg">推薦商品</h3>
              <div className="flex-between gap-1">
                <Button
                  variant="icon"
                  icon={ArrowLeftIcon}
                  onClick={() => swiperRef.current?.slidePrev()}
                />
                <Button
                  variant="icon"
                  icon={ArrowRightIcon}
                  onClick={() => swiperRef.current?.slideNext()}
                />
              </div>
            </div>
            <Swiper
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              spaceBetween={16}
              loop={productsData.products.length > 5}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {productsData.products.map((product) => {
                const isOutOfStock = (product.countInStock ?? 0) <= 0;
                return (
                  <SwiperSlide
                    key={product._id}
                    className="flex flex-col h-auto"
                  >
                    <Link
                      to={`/products/${product._id}`}
                      className={cn(
                        "group flex flex-col gap-2 flex-1",
                        isOutOfStock && "opacity-50 pointer-events-none"
                      )}
                      target="_blank"
                    >
                      <div className="rounded bg-gray-200 aspect-square">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="object-cover size-full max-w-full transition-transform duration-500 group-hover:scale-105"
                          onError={(e) =>
                            (e.currentTarget.src =
                              "https://placehold.co/144x144?text=No+Image")
                          }
                          loading="lazy"
                        />
                      </div>
                      <p className="line-clamp-1 text-sm font-medium mt-1">
                        {product.title}
                      </p>
                    </Link>
                    <p className="text-primary font-bold text-sm">
                      NT$ {addComma(product.price)}
                    </p>
                    <AddToCartBtn
                      btnType="text"
                      showIcon={false}
                      product={product}
                      quantity={1}
                      className="text-sm mt-2"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </section>
        )}
      </section>
      <div className="w-full md:w-80 lg:w-96 shrink-0">
        <div className="sticky top-24 rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-bold">訂單摘要</h3>
          <div className="space-y-2 my-4">
            <p className="flex-between">
              <span>商品總計 ({totalQuantity} 件)</span>
              <span className="font-medium">NT$ {addComma(subtotal)}</span>
            </p>
            <p className="flex-between">
              <span>運費</span>
              <span className="font-medium">
                {shippingInfo.shippingFee === 0
                  ? "免運費"
                  : `NT$ ${shippingInfo.shippingFee}`}
              </span>
            </p>
            {hasAppliedCoupon && couponDiscount > 0 && (
              <p className="flex-between">
                <span>優惠折扣</span>
                <span className="font-medium text-red-600">
                  - NT$ {addComma(couponDiscount)}
                </span>
              </p>
            )}
          </div>
          <div className="border-b space-y-2 border-gray-300 pb-4 mt-4 mb-8">
            <div className="flex items-end gap-2">
              <Input
                id="couponCode"
                value={coupon.input}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="輸入優惠碼"
                className="flex-1"
                disabled={isValidatingCoupon}
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon}
                className="rounded py-2"
              >
                套用
              </Button>
            </div>
            {hasAppliedCoupon && (
              <div className="flex-between text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                <span>已套用：{coupon.code}</span>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleRemoveCoupon}
                  className="h-auto min-h-0 p-0 text-xs"
                >
                  移除
                </Button>
              </div>
            )}
            {coupon.message && (
              <p className="text-xs text-gray-600">{coupon.message}</p>
            )}
          </div>
          <div className="flex-between mb-6">
            <span className="font-medium">總付款金額</span>
            <span className="text-2xl font-bold">
              NT$ {addComma(finalAmount)}
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={!cart?.length}
            className="w-full rounded-full"
          >
            前往結帳
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
