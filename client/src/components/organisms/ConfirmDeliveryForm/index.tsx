import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { useAlert } from "@/context/AlertContext";
import type { Order } from "@/types";

import CopyIcon from "@/assets/icons/copy.inline.svg?react";

interface ConfirmDeliveryFormProps {
  order: Partial<Order>;
  shippingTrackingNo: string;
  setShippingTrackingNo: (value: string) => void;
  shippingCarrier: string;
  setShippingCarrier: (value: string) => void;
}

const ConfirmDeliveryForm = ({
  order,
  shippingTrackingNo,
  setShippingTrackingNo,
  shippingCarrier,
  setShippingCarrier,
}: ConfirmDeliveryFormProps) => {
  const { showAlert } = useAlert();

  const handleCopy = (text: string | undefined, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showAlert({ variant: "success", message: `已複製${label}！` });
  };

  return (
    <div className="pb-8 space-y-4">
      <div className="pb-2 space-y-2">
        <p className="flex items-center flex-wrap text-base">
          <span className="font-medium">訂單編號：</span>
          <span className="font-mono">{order?.orderNo}</span>
          <button
            type="button"
            className="ml-2 text-xs text-primary hover:text-primary-focus transition-colors"
            onClick={() => handleCopy(order?.orderNo, "訂單編號")}
          >
            <CopyIcon className="size-4" />
          </button>
        </p>
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="mb-1 text-sm font-medium text-gray-600">購買明細：</p>
          <ul className="pl-4 text-sm leading-6 list-disc text-gray-700">
            {order?.orderItems?.map((item) => (
              <li key={item._id || item.productId}>
                {item.title}{" "}
                <span className="text-gray-400">x {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="py-4 border-y border-gray-100">
        <p className="mb-2 text-sm font-medium text-gray-600">收件資訊：</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>收件人：{order?.name}</li>
          <li>聯絡電話：{order?.phone}</li>
          <li className="flex items-start">
            配送地址：{order?.address}
            <button
              type="button"
              className="ml-2 text-xs text-primary hover:text-primary-focus transition-colors mt-0.5 whitespace-nowrap"
              onClick={() => handleCopy(order?.address, "配送地址")}
            >
              <CopyIcon className="size-4" />
            </button>
          </li>
        </ul>
      </div>
      <div className="space-y-3 pt-2">
        <Select
          name="shippingCarrier"
          label="物流公司"
          value={shippingCarrier}
          options={[
            { label: "黑貓宅急便", value: "黑貓宅急便" },
            { label: "新竹物流", value: "新竹物流" },
            { label: "宅配通", value: "宅配通" },
          ]}
          onChange={(_, value) => setShippingCarrier(value as string)}
        />
        <Input
          id="shippingTrackingNo"
          value={shippingTrackingNo}
          label="配送單號"
          placeholder="請輸入物流單號"
          onChange={(e) => setShippingTrackingNo(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ConfirmDeliveryForm;
