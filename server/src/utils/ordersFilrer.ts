import { Types } from "mongoose";

const ORDER_TYPE_FILTERS: Record<number, any> = {
  0: { status: { $ne: "canceled" } }, // 全部
  1: { paymentStatus: "unpaid", status: { $ne: "canceled" } }, // 待付款
  2: { paymentStatus: "paid", shippingStatus: "pending", status: { $ne: "canceled" } }, // 待出貨
  3: { status: { $in: ["shipped", "delivered", "picked_up"] } }, // 已出貨
  4: { status: "completed" }, // 已完成
  5: { status: "canceled" }, // 已取消
};

export const ordersFilrer = (keyword?: string, type?: string, userId?: Types.ObjectId) => {
  let filter: any = {};

  if (userId) filter.userId = userId;

  if (keyword)
    filter.$or = [
      { orderNo: { $regex: keyword, $options: "i" } },
      { orderItems: { $elemMatch: { title: { $regex: keyword, $options: "i" } } } }
    ];

  if (type !== undefined && ORDER_TYPE_FILTERS.hasOwnProperty(Number(type)))
    Object.assign(filter, ORDER_TYPE_FILTERS[Number(type)]);

  return filter;
};
