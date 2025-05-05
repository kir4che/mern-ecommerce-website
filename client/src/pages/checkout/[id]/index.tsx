import { useState } from "react";
import { useParams } from "react-router-dom";

import { useAxios } from "@/hooks/useAxios";
import { addComma } from "@/utils/addComma";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";
import PriceRow from "@/components/atoms/PriceRow";

import { ReactComponent as CheckIcon } from "@/assets/icons/check-circle.inline.svg";
import { ReactComponent as UncheckIcon } from "@/assets/icons/uncheck-circle.inline.svg";
import { ReactComponent as VisaIcon } from "@/assets/icons/visa-logo.inline.svg";
import { ReactComponent as MasterCardIcon } from "@/assets/icons/mastercard-logo.inline.svg";
import { ReactComponent as JCBIcon } from "@/assets/icons/jcb-logo.inline.svg";

const initialBuyerInfo = {
  name: "",
  phone: "",
  address: "",
  note: ""
};

const Checkout: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useAxios(`/orders/${id}`, { withCredentials: true });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [buyerInfo, setBuyerInfo] = useState(initialBuyerInfo);
  const [paymentMethod, setPaymentMethod] = useState("ATM");

  const paymentMethods = [
    { method: "ATM", label: "ATM 虛擬帳號" },
    { method: "WebATM", label: "WebATM" },
    { 
      method: "Credit",
      label: "信用卡",
      additionalIcons: [
        <VisaIcon className="w-8 h-8" />,
        <MasterCardIcon className="w-8 h-8" />,
        <JCBIcon className="w-6 h-6" />
      ]
    }
  ];

  const { refresh: createPayment } = useAxios("/payment",
    { method: "POST", withCredentials: true },
    {
      immediate: false,
      onSuccess: (res) => {
        const form = document.createElement("form");
        form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
        form.method = "POST";
        form.style.display = "none";

        // 使用 FormData 來構建表單資料
        const formData = new FormData();
        Object.entries(res.params).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        // 將表單資料加入到表單中
        formData.forEach((value, key) => {
          const input = document.createElement("input");
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        });

        // 將表單添加到頁面並提交
        document.body.appendChild(form);
        form.submit();
      },
      onError: () => setErrorMessage("付款失敗，請稍後再試！"),
    }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 建立付款單，並導向綠界金流。
    await createPayment({
      orderId: id,
      name: buyerInfo.name,
      phone: buyerInfo.phone,
      address: buyerInfo.address,
      note: buyerInfo.note,
      ChoosePayment: paymentMethod
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
  if (!isLoading && (error || !data)) return <NotFound message={["無法加載訂單資料，請稍後再試！"]} />;

  return (
    <Layout className="flex flex-col justify-center w-full max-w-screen-xl px-5 py-8 mx-auto lg:flex-row gap-x-10 gap-y-8">
      <form className="flex-1 order-2" onSubmit={handleSubmit}>
        {/* 購買人資訊 */}
        <div className="mb-8 space-y-4">
          <h3 className="pb-2 text-base border-b border-gray-400">購買人資訊</h3>
          <div className="flex flex-wrap gap-4">
            <Input
              label="收件人姓名"
              value={buyerInfo.name}
              onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
              helperText="請填寫真實姓名以確保順利收件"
              required
            />
            <Input
              label="聯絡電話"
              type="tel"
              value={buyerInfo.phone}
              onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
              placeholder="0912345678"
              pattern={{
                value: /^09\d{8}$/,
                message: '請輸入有效的手機號碼（例如：0912345678）'
              }}
              required
            />
          </div>
          <Input
            label="配送地址"
            value={buyerInfo.address}
            onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
            placeholder="請填寫完整地址"
            required
          />
        </div>
        {/* 付款方式 */}
        <div className="mb-8 space-y-4">
          <h3 className="pb-2 mb-4 text-base border-b border-gray-400">
            付款方式
            <span className="text-sm font-normal">（透過綠界金流提供安全的付款服務）</span>
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {paymentMethods.map(({ method, label, additionalIcons }) => (
              <Button
                key={method}
                className={`h-14 rounded-lg hover:bg-secondary hover:text-primary border ${
                  paymentMethod === method && "border-2"
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                {paymentMethod === method ? <CheckIcon /> : <UncheckIcon />}
                <p className="ml-0.5">{label}</p>
                {additionalIcons && additionalIcons.map((Icon, index) => <span key={index}>{Icon}</span>)}
              </Button>
            ))}
          </div>
        </div>
        {/* 支付金額明細 */}
        <div className="flex flex-col pt-4 border-t border-gray-400 gap-y-4">
          <PriceRow label="商品金額" value={data.order?.subtotal ?? 0} />
          <PriceRow label="運費" value={data.order?.shippingFee ?? 0} />
          <PriceRow label="折扣" value={-(data.order?.discount ?? 0)} className="text-red-500" />
          <div className="flex justify-between w-full mt-8 mb-4 font-medium">
            <p>總金額</p>
            <p className="font-semibold">
              NT$ <span className="text-2xl">{addComma(data?.order?.totalAmount)}</span>
            </p>
          </div>
          <Button type="submit" className="w-full rounded-md">確認付款</Button>
        </div>
        {/* 官網購物須知 */}
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
      <div className="flex flex-col flex-1 lg:order-3">
        {/* 購買的商品 */}
        <ul className="mb-8 space-y-4">
          {data?.order?.orderItems?.map((item) => (
            <li className="flex w-full gap-x-4" key={item.productId}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-20 rounded aspect-square"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/144x144?text=No Image')}
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
                <p className="text-base font-medium">NT$ {addComma(item.amount)}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* 備註 */}
        <label className="mb-2 text-sm">備註</label>
        <textarea
          value={buyerInfo.note}
          placeholder="有任何特殊需求或注意事項嗎？"
          onChange={(e) => setBuyerInfo({ ...buyerInfo, note: e.target.value })}
          rows={3}
          className="textarea textarea-bordered"
        />
      </div>
      {errorMessage && <Alert type="error" message={errorMessage} className="absolute transform -translate-x-1/2 w-fit top-6 left-1/2" />}
    </Layout>
  );
};

export default Checkout;
