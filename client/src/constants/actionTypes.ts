export const PRODUCT_CATEGORIES = [
  { label: "麵包", value: "bread" },
  { label: "蛋糕", value: "cake" },
  { label: "餅乾", value: "cookie" },
  { label: "其他", value: "other" },
] as const;

export const PRODUCT_TAGS = [
  { label: "推薦", value: "recommend" },
  { label: "熱銷", value: "hot" },
  { label: "新品", value: "new" },
  { label: "特價", value: "sale" },
] as const;

export const PRODUCT_COLLECTIONS = [
  { label: "所有商品", value: "all", type: "all" },
  { label: "推薦", value: "recommend", type: "tag" },
  { label: "熱銷", value: "hot", type: "tag" },
  { label: "麵包", value: "bread", type: "category" },
  { label: "蛋糕", value: "cake", type: "category" },
  { label: "餅乾", value: "cookie", type: "category" },
] as const;

export const ORDER_STATUS_MAP = {
  created: "已成立",
  paid: "已付款",
  processing: "處理中",
  shipped: "已出貨",
  delivered: "已送達",
  picked_up: "已取貨",
  completed: "已完成",
  canceled: "已取消",
  return_requested: "退貨申請中",
  returned: "已退貨",
} as const;

export const PAYMENT_STATUS_MAP = {
  unpaid: "未付款",
  paid: "已付款",
  refunded: "已退款",
} as const;

export const SHIPPING_STATUS_MAP = {
  pending: "待出貨",
  in_transit: "配送中",
  delivered: "已送達",
  picked_up: "已取貨",
  returning: "退貨中",
  returned: "已退貨",
} as const;

export const ORDER_FILTER_OPTIONS = [
  { id: "ALL", value: 0, label: "全部" },
  { id: "UNPAID", value: 1, label: "待付款" },
  { id: "PENDING", value: 2, label: "待出貨" },
  { id: "SHIPPED", value: 3, label: "已出貨" },
  { id: "COMPLETED", value: 4, label: "已完成" },
] as const;
