// 將數字加上千分位逗號
export const addComma = (input: string | number | null | undefined): string => {
  if (input == null) return "";

  const str = String(input).trim();
  if (!/^\d+$/.test(str)) return "";

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};