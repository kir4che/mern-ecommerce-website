import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { useGetData } from "@/hooks/useGetData";

import Layout from "@/layouts/AppLayout";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
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
  note: "",
};

const Checkout: React.FC = () => {
  const { id } = useParams();
  const { data, error, isLoading, isError } = useAxios(`/orders/${id}`, { withCredentials: true });

  const [buyerInfo, setBuyerInfo] = useState(initialBuyerInfo);
  const [paymentMethod, setPaymentMethod] = useState("ATM");

  // 暫時不串接金流，直接設定付款成功
  const handlePay = async () => {
    if (!paymentMethod) return alert("請選擇付款方式");
    else if (!paymentForm.cardNumber) return alert("請輸入卡號");
    else if (!paymentForm.cardDate) return alert("請輸入卡片有效年月");
    else if (!paymentForm.cardCode) return alert("請輸入CVV/CVC");
    else if (!paymentForm.cardName) return alert("請輸入持卡人姓名");

    // 更新訂單狀態
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/orders/${id}`,
        {
          status: "已付款",
          paymentStatus: "已付款",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (res.status === 200) {
        alert("付款成功！");
        setPaymentMethod("");
        setPaymentForm({
          cardNumber: "",
          cardDate: "",
          cardCode: "",
          cardName: "",
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
      }
    }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 建立付款單，並導向綠界金流。
    await createPayment({
      orderId: id,
      orderNo: data.order.orderNo,
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
  
  if (!isLoading && (isError || !data)) return <NotFound message={error?.message} />;

  return (
    <Layout>
      <section className="px-[5vw] p-10">
        <h3 className="pb-2 mb-4 text-base border-b border-gray-300">
          付款方式
        </h3>
        <div className="space-y-3 text-sm">
          <button
            className={`${paymentMethod === "信用卡" ? "border-primary" : ""} flex bg-white items-center gap-2 p-4 border-2 rounded-lg`}
            onClick={() => setPaymentMethod("信用卡")}
          >
            {paymentMethod === "信用卡" ? (
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios-glyphs/30/ok--v1.png"
                alt="checked"
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
    </Layout>
  );
};

export default Checkout;
