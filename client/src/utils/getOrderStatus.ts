import type { Order } from "@/types";

export const getOrderStatus = (order: Order) => {
  if (order.status === "canceled") return "已取消";
  if (order.paymentStatus === "unpaid") return "待付款";
  if (order.shippingStatus === "in_transit") return "配送中";
  if (order.shippingStatus === "delivered") return "待取貨";
  if (order.status === "completed") return "已完成";

  return "處理中";
};
