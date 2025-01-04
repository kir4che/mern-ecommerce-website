export enum AuthActionType {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGOUT = "LOGOUT",
  LOGOUT_FAIL = "LOGOUT_FAIL"
}

export const ErrorMessages: Record<string, string> = {
  LOGIN_FAIL: "使用者帳號或密碼不正確，請重新輸入！",
  LOGOUT_FAIL: "登出失敗，請稍後再試！",
  STORAGE_FAIL: "登入狀態保存失敗，請檢查您的網路或重試。",
  LOGIN_RESPONSE_ERROR: "登入失敗，請稍後再試或聯繫我們。"
} as const;

export const ProductCategories = [
  { label: "所有商品", link: "all" },
  { label: "推薦", link: "recommend" },
  { label: "熱銷", link: "hot" },
  { label: "麵包", link: "bread" },
  { label: "蛋糕", link: "cake" },
  { label: "餅乾", link: "cookie" },
  { label: "其他", link: "other" },
] as const;
