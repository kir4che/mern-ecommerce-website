// 將數字加上千分位逗號
export const addComma = (input: string | number | null | undefined): string => {
  if (input == null) return "";

  const num = Number(input);
  if (isNaN(num)) return "";

  return new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 0
  }).format(num);
};