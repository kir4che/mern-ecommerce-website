// 檢查值是否存在
export const isExist = (value: any) =>
  value !== null &&
  value !== "" &&
  typeof value !== "undefined" &&
  value !== false;
