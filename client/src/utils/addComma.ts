// 將數字加上千分位逗號
export const addComma = (input: string | number): string => {
  const str = String(input);
  if (!/^\d+$/.test(str)) {
    throw new Error("Please provide a valid number or numeric string.");
  }

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};