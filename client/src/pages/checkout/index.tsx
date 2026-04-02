import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import { useCartCoupon } from "@/hooks/useCartCoupon";
import {
  useCreateOrderMutation,
  useCreatePaymentMutation,
  useGetOrderByIdQuery,
} from "@/store/slices/apiSlice";
import type { PaymentMethod } from "@/types/payment";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/atoms/Loading";
import Textarea from "@/components/atoms/Textarea";
import NotFound from "@/pages/notFound";

import CheckIcon from "@/assets/icons/check-circle.inline.svg?react";
import JCBIcon from "@/assets/icons/jcb-logo.inline.svg?react";
import MasterCardIcon from "@/assets/icons/mastercard-logo.inline.svg?react";
import UncheckIcon from "@/assets/icons/uncheck-circle.inline.svg?react";
import VisaIcon from "@/assets/icons/visa-logo.inline.svg?react";

const buyerSchema = z.object({
  name: z.string().min(1, "請填寫收件人姓名"),
  phone: z
    .string()
    .regex(/^09\d{8}$/, "請輸入有效的手機號碼（例如：0912345678）"),
  address: z.string().min(1, "請填寫配送地址"),
  note: z.string().optional(),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

const Checkout = () => {
  const location = useLocation();
  const params = useParams();
  const orderId = params.id;

  // 若有 orderId，表示是重新付款，拉取該訂單資料。
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderByIdQuery(
    orderId || "",
    { skip: !orderId }
  );

  const {
    cart,
    subtotal,
    shippingInfo,
    clearCart,
    isLoading: isLoadingCart,
  } = useCart();
  const { showAlert } = useAlert();

  const {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  } = useCartCoupon(subtotal, location.state?.coupon);

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { name: "", phone: "", address: "", note: "" },
  });

  const [paymentMethod, setPaymentMethod] = useState("ATM");

  const paymentMethods: Array<{
    method: string;
    label: string;
    additionalIcons?: ReactNode[];
  }> = [
    { method: "ATM", label: "ATM 虛擬帳號" },
    { method: "WebATM", label: "WebATM" },
    {
      method: "Credit",
      label: "信用卡",
      additionalIcons: [
        <VisaIcon key="visa" className="size-8" />,
        <MasterCardIcon key="mastercard" className="size-8" />,
        <JCBIcon key="jcb" className="size-6" />,
      ],
    },
  ];

  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  const onSubmit = async (formData: BuyerFormData) => {
    if (isCreatingOrder || isCreatingPayment || isLoadingOrder) return;

    try {
      let orderIdForPayment: string;

      if (isRepaymentMode && displayOrder) {
        // 重新付款：直接使用現有訂單
        orderIdForPayment = displayOrder._id;
      } else {
        // 正常結帳：建立新訂單
        if (cart.length === 0) return;

        const result = await createOrder({
          orderItems: cart.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
          couponCode: getCheckoutCoupon()?.code,
        }).unwrap();

        orderIdForPayment = result.order._id;
      }

      // 2. 清空購物車（僅在正常結帳時）
      if (!isRepaymentMode) await clearCart();

      // 3. 建立付款單，並導向綠界金流。
      const resData = await createPayment({
        orderId: orderIdForPayment,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        ChoosePayment: paymentMethod as PaymentMethod,
      }).unwrap();

      const form = document.createElement("form");
      form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
      form.method = "POST";
      form.style.display = "none";

      const ecpayFormData = new FormData();
      const params =
        typeof resData === "object" && resData && "params" in resData
          ? ((resData as { params?: Record<string, unknown> }).params ?? {})
          : {};
      Object.entries(params).forEach(([key, value]) => {
        ecpayFormData.append(key, String(value));
      });

      ecpayFormData.forEach((value, key) => {
        const input = document.createElement("input");
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch {
      showAlert({ variant: "error", message: "付款失敗，請稍後再試！" });
    }
  };

  // 重新付款：使用訂單資料；否則使用購物車資料。
  const isRepaymentMode = !!orderId && !!orderData?.order;
  const displayOrder = orderData?.order;
  const displaySubtotal = isRepaymentMode
    ? (displayOrder?.subtotal ?? 0)
    : subtotal;
  const displayDiscount = isRepaymentMode ? (displayOrder?.discount ?? 0) : 0;

  const orderItems =
    isRepaymentMode && displayOrder
      ? displayOrder.orderItems.map(
          (item: {
            productId: string;
            title: string;
            price: number;
            quantity: number;
            imageUrl?: string;
          }) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            amount: item.quantity * item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl || "",
          })
        )
      : cart.map((item) => ({
          productId: item.productId,
          title: item.product.title,
          price: item.product.price,
          amount: item.quantity * item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        }));

  const isProcessing =
    isCreatingOrder || isCreatingPayment || isLoadingOrder || isLoadingCart;

  const finalCouponDiscount = isRepaymentMode
    ? displayDiscount
    : couponDiscount;

  const displayShippingFee =
    isRepaymentMode && displayOrder
      ? (displayOrder.shippingFee ?? 0)
      : shippingInfo.shippingFee;

  const finalAmount =
    isRepaymentMode && displayOrder
      ? displayOrder.totalAmount
      : displaySubtotal + displayShippingFee - finalCouponDiscount;

  if (orderId && isLoadingOrder) return <Loading fullPage />;
  if (!orderId && isLoadingCart) return <Loading fullPage />;

  if (orderId && !displayOrder)
    return <NotFound message={["訂單不存在，請檢查訂單 ID。"]} />;
  if (!isRepaymentMode && cart.length === 0)
    return <NotFound message={["您的購物車是空的，請先挑選商品。"]} />;

  return (
    <div className="flex items-start justify-center max-lg:flex-col w-full max-w-7xl px-5 py-8 mx-auto gap-x-10 gap-y-8">
      <form
        id="checkout-form"
        className="flex-1 w-full order-2 lg:order-1"
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isProcessing}
        noValidate
      >
        <div className="mb-8 space-y-4">
          <h3 className="pb-2 text-base border-b border-slate-400">
            購買人資訊
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              {...register("name")}
              label="收件人姓名"
              error={errors.name?.message ?? ""}
              disabled={isProcessing}
            />
            <Input
              {...register("phone")}
              type="tel"
              label="聯絡電話"
              placeholder="0912345678"
              error={errors.phone?.message ?? ""}
              disabled={isProcessing}
            />
          </div>
          <Input
            {...register("address")}
            label="配送地址"
            placeholder="請填寫完整地址"
            error={errors.address?.message ?? ""}
            disabled={isProcessing}
          />
        </div>
        <div className="mb-8 space-y-4">
          <h3 className="pb-2 mb-4 text-base border-b border-slate-400">
            付款方式
            <span className="text-sm font-normal">
              （透過綠界金流提供安全的付款服務）
            </span>
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map(({ method, label, additionalIcons }) => (
              <Button
                key={method}
                variant="outline"
                className={cn(
                  "h-12 px-3 text-sm rounded",
                  paymentMethod === method ? "border-2" : ""
                )}
                type="button"
                disabled={isProcessing}
                onClick={() => setPaymentMethod(method)}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {paymentMethod === method ? (
                    <CheckIcon className="shrink-0" />
                  ) : (
                    <UncheckIcon className="shrink-0" />
                  )}
                  <span>{label}</span>
                  {additionalIcons && (
                    <span className="flex items-center gap-1 ml-1 shrink-0">
                      {additionalIcons.map((iconElement, index) => (
                        <span key={index} className="flex items-center">
                          {iconElement}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="pb-4 mb-4 text-xl font-bold border-b border-gray-200">
            訂單摘要
          </h3>
          <div className="space-y-4 text-[15px]">
            <div className="flex justify-between w-full">
              <p>
                商品總計 (
                {orderItems.reduce((acc, item) => acc + item.quantity, 0)} 件)
              </p>
              <p className="font-medium">NT$ {addComma(displaySubtotal)}</p>
            </div>
            <div className="flex justify-between w-full">
              <p>運費</p>
              <p className="font-medium">
                {displayShippingFee === 0
                  ? "免運費"
                  : `NT$ ${addComma(displayShippingFee)}`}
              </p>
            </div>
            {finalCouponDiscount > 0 && (
              <div className="flex justify-between w-full">
                <p>優惠折扣</p>
                <p className="font-medium text-red-600">
                  - NT$ {addComma(finalCouponDiscount)}
                </p>
              </div>
            )}
          </div>

          {!isRepaymentMode && (
            <div className="border-b space-y-2 border-gray-300 pb-4 mt-6">
              <div className="flex items-end gap-2">
                <Input
                  id="couponCode"
                  value={coupon.input}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="輸入優惠碼"
                  className="flex-1"
                  disabled={isValidatingCoupon || isProcessing}
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || isProcessing}
                  className="rounded py-2"
                >
                  套用
                </Button>
              </div>
              {hasAppliedCoupon && (
                <div className="flex justify-between items-center text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  <span>已套用：{coupon.code}</span>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleRemoveCoupon}
                    className="h-auto min-h-0 p-0 text-xs text-green-700 hover:text-green-800"
                    disabled={isProcessing}
                  >
                    移除
                  </Button>
                </div>
              )}
              {coupon.message && (
                <p className="text-xs text-gray-600">{coupon.message}</p>
              )}
            </div>
          )}

          {isRepaymentMode && displayOrder?.couponCode && (
            <div className="border-b border-gray-300 pb-4 mt-4">
              <p className="text-xs text-gray-600">
                已套用優惠碼 {displayOrder.couponCode}，折抵 NT${" "}
                {addComma(displayOrder.discount)}。
              </p>
            </div>
          )}

          <div className="flex flex-col gap-y-4 mt-8 mb-4">
            <div className="flex justify-between w-full font-bold items-center">
              <p className="text-lg">總付款金額</p>
              <p className="text-2xl">NT$ {addComma(finalAmount)}</p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 mt-4 rounded-full text-lg"
          >
            {isProcessing ? "處理中..." : "確認付款"}
          </Button>
        </div>
        <div className="mt-12 space-y-2">
          <h3>官網購物須知</h3>
          <ul className="pl-5 text-sm leading-6 list-disc">
            <li>訂單完成後，請務必確認您的收貨資訊是否正確。</li>
            <li>本網站提供多種支付方式，包括 ATM 轉帳、信用卡支付等。</li>
            <li>商品一經售出，恕無法退換貨，除非商品有瑕疵或錯誤。</li>
            <li>我們會在收到付款後 24 小時內處理您的訂單，並發送出貨通知。</li>
          </ul>
        </div>
      </form>
      <div className="flex flex-col flex-1 w-full order-1 lg:order-2">
        <ul className="mb-8 space-y-4">
          {orderItems.map((item) => (
            <li className="flex w-full gap-x-4" key={item.productId}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-20 rounded aspect-square"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/144x144?text=No Image")
                }
                loading="lazy"
              />
              <div className="flex items-end justify-between w-full">
                <div className="flex flex-col justify-between h-full">
                  <p className="font-medium">{item.title}</p>
                  <p>
                    NT$ {addComma(item.price)}
                    <span className="ml-2">數量：{item.quantity}</span>
                  </p>
                </div>
                <p className="text-base font-medium">
                  NT$ {addComma(item.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Textarea
          id="note"
          form="checkout-form"
          label="備註"
          {...register("note")}
          placeholder="有任何特殊需求或注意事項嗎？"
          rows={3}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default Checkout;
