import type { Order } from "@/types";
import { getOrderStatus } from "@/utils/getOrderStatus";

describe("getOrderStatus 函式", () => {
  const baseOrder: Order = {
    _id: "order-1",
    orderNo: "NO-1",
    userId: "user-1",
    name: "kir4che",
    phone: "0912345678",
    address: "台北市",
    orderItems: [],
    subtotal: 100,
    shippingFee: 60,
    totalAmount: 160,
    status: "processing",
    paymentStatus: "paid",
    shippingStatus: "pending",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  test("訂單已取消時回傳已取消", () => {
    expect(getOrderStatus({ ...baseOrder, status: "canceled" })).toBe("已取消");
  });

  test("付款未繳時回傳待付款", () => {
    expect(getOrderStatus({ ...baseOrder, paymentStatus: "unpaid" })).toBe(
      "待付款"
    );
  });

  test("運送狀態為運送中時回傳配送中", () => {
    expect(getOrderStatus({ ...baseOrder, shippingStatus: "in_transit" })).toBe(
      "配送中"
    );
  });

  test("運送狀態為已送達時回傳待取貨", () => {
    expect(getOrderStatus({ ...baseOrder, shippingStatus: "delivered" })).toBe(
      "待取貨"
    );
  });

  test("狀態為已完成時回傳已完成", () => {
    expect(getOrderStatus({ ...baseOrder, status: "completed" })).toBe(
      "已完成"
    );
  });

  test("預設 fallback 回傳處理中", () => {
    expect(getOrderStatus({ ...baseOrder })).toBe("處理中");
  });
});
