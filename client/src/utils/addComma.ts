// 將數字加上千分位逗號
export const addComma = (input: string | number | null | undefined): string => {
  if (input == null) return "";

  const num = typeof input === "number" ? input : parseInt(input);

  if (isNaN(num)) return "";
  if (num === 0) return "0";

  return new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 0,
  }).format(num);
};
