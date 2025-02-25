import { Order } from "@/types/order";

import Input from "@/components/atoms/Input";

interface ConfirmDeliveryFormProps {
  order: Order;
  shippingTrackingNo: string;
  setShippingTrackingNo: (value: string) => void;
};

const ConfirmDeliveryForm: React.FC<ConfirmDeliveryFormProps> = ({ order, shippingTrackingNo, setShippingTrackingNo }) => {
  return (
    <div className="pb-8 space-y-3">
    <div className="pb-2 space-y-2">
      <p className="text-base">
        訂單編號：{order?.orderNo}
        <button className="ml-2 text-blue-500" onClick={() => navigator.clipboard.writeText(order?.address)}>複製</button>
      </p>
      <ul className="pl-4 text-sm leading-6 list-disc">
        {order?.orderItems.map((item) => (
          <li key={item._id}>
            {item.title} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
    <ul className="py-4 leading-7 border-y">
      <li>購買人：{order?.name}</li>
      <li>地址：{order?.address} <button className="ml-2 text-blue-500" onClick={() => navigator.clipboard.writeText(order?.address)}>複製</button></li>
      <li>電話：{order?.phone}</li>
    </ul>
    <Input
      value={shippingTrackingNo}
      label="配送編號"
      onChange={(e) => setShippingTrackingNo(e.target.value)}
      pattern={{
        value: /^[A-Z0-9]{8,20}$/,
        message: "請輸入正確的配送編號"
      }}
    />
    </div>
  );
}

export default ConfirmDeliveryForm;
