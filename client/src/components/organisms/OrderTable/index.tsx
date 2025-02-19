import { Fragment, useState } from "react";

import { ORDER_STATUS, PAYMENT_STATUS, SHIPPING_STATUS } from "@/constants/actionTypes";
import { addComma } from "@/utils/addComma";
import { formatDate } from "@/utils/formatDate";

import Button from "@/components/atoms/Button";

import { ReactComponent as ArrowDownIcon } from "@/assets/icons/nav-arrow-down.inline.svg";
import { ReactComponent as ArrowUpIcon } from "@/assets/icons/nav-arrow-up.inline.svg";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNo: string;
  createdAt: string;
  status: string;
  shippingStatus: string;
  paymentStatus: string;
  subtotal: number;
  orderItems: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  setSelectedOrderId: (orderId: string) => void;
  setModalOpen: (isOpen: boolean) => void;
  expandedOrderId: string | null;
  toggleOrderDetails: (orderId: string) => void;
  handleRepayment: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, setSelectedOrderId, expandedOrderId, setModalOpen, toggleOrderDetails, handleRepayment }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "asc" | "desc" }>({ key: "createdAt", direction: "desc" });

  // 只對訂單成立日期、金額進行排序
  const sortedOrders = [...orders].sort((a, b) => {
    const { key, direction } = sortConfig;
    const valueA = key === "createdAt" ? new Date(a[key]).getTime() : a[key];
    const valueB = key === "createdAt" ? new Date(b[key]).getTime() : b[key];

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      const newDirection = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction: newDirection };
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="p-2 text-left">訂單編號</th>
            <th className="p-2 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>
              成立日期
              {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? <ArrowUpIcon className="inline w-5 h-5 ml-1" /> : <ArrowDownIcon className="inline w-5 h-5 ml-1" />)}
            </th>
            <th className="p-2 text-left">訂單狀態</th>
            <th className="p-2 text-left">出貨狀態</th>
            <th className="p-2 text-left">付款狀態</th>
            <th className="p-2 text-right cursor-pointer" onClick={() => handleSort("subtotal")}>
              總金額
              {sortConfig.key === "subtotal" && (sortConfig.direction === "asc" ? <ArrowUpIcon className="inline w-5 h-5 ml-1" /> : <ArrowDownIcon className="inline w-5 h-5 ml-1" />)}
            </th>
            <th className="p-2 text-right"/>
          </tr>
        </thead>
        <tbody className="text-sm whitespace-nowrap">
          {sortedOrders.map((order) => (
            <Fragment key={order.orderNo}>
              <tr>
                <td className="p-2">{order.orderNo}</td>
                <td className="p-2">{formatDate(order.createdAt)}</td>
                <td className="p-2">{ORDER_STATUS[order.status]}</td> {/* 顯示訂單狀態 */}
                <td className="p-2">{SHIPPING_STATUS[order.shippingStatus]}</td> {/* 顯示出貨狀態 */}
                <td className="p-2">{PAYMENT_STATUS[order.paymentStatus]}</td> {/* 顯示付款狀態 */}
                <td className="p-2 text-right">NT$ {addComma(order.subtotal)}</td>
                <td className="p-2 text-right">
                  {order.status === "completed" ? (
                    <span>已完成</span>
                  ) : order.paymentStatus === 'unpaid' ? (
                    <Button onClick={() => handleRepayment(order._id)} className="px-3 h-9">
                      重新付款
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setModalOpen(true);
                      }}
                      className="px-3 h-9"
                      disabled={order.status !== "picked_up"}
                    >
                      完成訂單
                    </Button>
                  )}
                </td>
                <td className="p-2">
                  <Button
                    variant="icon"
                    icon={expandedOrderId === order._id ? ArrowUpIcon : ArrowDownIcon}
                    onClick={() => toggleOrderDetails(order._id)}
                    className="border-none"
                  />
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan={7} className="px-2 py-4">
                    <ul className="leading-6 list-disc list-inside">
                      {order.orderItems.map(item => (
                        <li key={item.productId}>
                          {item.title} - NT$ {addComma(item.price)} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
