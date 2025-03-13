export enum AUTH_ACTION_TYPE {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
  LOGOUT_FAIL = "LOGOUT_FAIL",
}

export const ERROR_MESSAGES = {
  LOGIN_FAIL: "使用者帳號或密碼不正確，請重新輸入！",
  LOGOUT_FAIL: "登出失敗，請稍後再試！",
  STORAGE_FAIL: "登入狀態保存失敗，請檢查您的網路或重試。",
  LOGIN_RESPONSE_ERROR: "登入失敗，請稍後再試或聯繫我們。",
} as const;

export const PRODUCT_CATEGORIES = [
  { label: "所有商品", link: "all" },
  { label: "推薦", link: "recommend" },
  { label: "熱銷", link: "hot" },
  { label: "麵包", link: "bread" },
  { label: "蛋糕", link: "cake" },
  { label: "餅乾", link: "cookie" },
  { label: "其他", link: "other" },
] as const;

export const ORDER_STATUS = {
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

export const PAYMENT_STATUS = {
  unpaid: "未付款",
  paid: "已付款",
  refunded: "已退款",
} as const;

export const SHIPPING_STATUS = {
  not_shipped: "未出貨",
  pending: "待出貨",
  in_transit: "配送中",
  delivered: "已送達",
  picked_up: "已取貨",
  returning: "退貨中",
  returned: "已退貨",
} as const;

export const ORDERS_FILTER_TYPES = {
  ALL: 0,
  UNPAID: 1,
  PENDING: 2,
  SHIPPED: 3,
  COMPLETED: 4,
} as const;

export const ORDER_FILTER_TYPE_LABELS = {
  0: "全部",
  1: "待付款",
  2: "待出貨",
  3: "已出貨",
  4: "已完成",
} as const;
