export const FREE_SHIPPING_THRESHOLD = 500;
export const BASIC_SHIPPING_FEE = 60;

export const calculateShippingFee = (subtotal: number): number => {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASIC_SHIPPING_FEE;
};

export const getShippingProgress = (subtotal: number): number => {
  return Math.min(Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100), 100);
};

export const getRemainingForFreeShipping = (subtotal: number): number => {
  return Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
};

export const isFreeShipping = (subtotal: number): boolean => {
  return calculateShippingFee(subtotal) === 0;
};
