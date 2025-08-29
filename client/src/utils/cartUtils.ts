import type { Product } from "@/types/product";

export const preventInvalidInput = (
  e: React.KeyboardEvent<HTMLInputElement>,
) => {
  const invalidKeys = new Set<string>([".", ",", "-", "e"]);
  if (invalidKeys.has(e.key)) {
    e.preventDefault();
  }
};

// 處理商品數量變更
export const handleQuantityChange = (
  value: number | React.ChangeEvent<HTMLInputElement>,
  product: { _id: string; countInStock: number } | null,
  setQuantity: (value: number) => void,
  existingQuantity: number = 0,
) => {
  let inputValue: string;

  // value 可能是 number 或 event，根據 type 處理。
  if (typeof value === "number") {
    inputValue = value.toString();
  } else {
    inputValue = value.target.value.replace(/^0+(?!$)/, ""); // 去掉前綴的零
    value.target.value = inputValue; // 更新輸入框的值
  }

  // 計算可用庫存（總庫存減去購物車中的數量）
  const availableStock = (product?.countInStock || 0) - existingQuantity;

  const newQuantity = Math.max(
    1,
    Math.min(parseInt(inputValue, 10), availableStock),
  );
  if (!isNaN(newQuantity)) setQuantity(newQuantity);
};

// 加入商品到購物車
export const handleAddToCart = async (
  product: Partial<Product> | null,
  quantity: number,
  addToCart: (params: { productId: string; quantity: number }) => Promise<any>,
  setQuantity?: (value: number) => void,
) => {
  if (!product?._id) return;

  const validQuantity = Math.max(1, quantity || 1);

  await addToCart({ productId: product._id, quantity: validQuantity });

  setQuantity?.(product.countInStock > 0 ? 1 : 0);
};

// 移除購物車中商品
export const handleRemoveFromCart = async (
  productId: string,
  removeFromCart: (productId: string) => Promise<void>,
) => {
  try {
    await removeFromCart(productId);
  } catch (err: any) {
    throw new Error("移除商品失敗：" + err.message);
  }
};

interface FreeShippingInfo {
  isFreeShipping: boolean;
  shippingFee: number;
  message: string;
}

// 計算免運門檻
export const calculateFreeShipping = (
  cartTotal: number,
  threshold: number = 500,
): FreeShippingInfo => {
  const isFreeShipping = cartTotal >= threshold;
  const shippingFee = isFreeShipping ? 0 : 60;
  const message = isFreeShipping
    ? `已達 NT$${threshold} 最低免運門檻！`
    : `再湊 NT$${threshold - cartTotal} 元即可享免運費！`;

  return { isFreeShipping, shippingFee, message };
};
