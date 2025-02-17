import { Product } from '@/types/product';

export const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const invalidKeys = new Set<string>(['.', ',', '-', 'e']);
  if (invalidKeys.has(e.key)) {
    e.preventDefault();
  }
};

// 處理商品數量變更
export const handleQuantityChange = (
  value: number | React.ChangeEvent<HTMLInputElement>,
  product: { _id: string; countInStock: number } | null,
  setQuantity: (value: number) => void
) => {
  let inputValue: string;

  // value 可能是 number 或 event，根據 type 處理。
  if (typeof value === 'number') {
    inputValue = value.toString();
  } else {
    inputValue = value.target.value.replace(/^0+(?!$)/, ''); // 去掉前綴的零
    value.target.value = inputValue; // 更新輸入框的值
  }

  const newQuantity = Math.max(1, Math.min(parseInt(inputValue, 10), product?.countInStock || Infinity));
  if (!isNaN(newQuantity)) setQuantity(newQuantity);
};

interface AddToCartParams {
  productId: string;
  quantity: number;
}

// 加入商品到購物車
export const handleAddToCart = async (
  product: Product | null,
  quantity: number,
  addToCart: (params: AddToCartParams) => Promise<void>,
  setQuantity?: (value: number) => void
) => {
  if (!product) return;

  try {
    await addToCart({ productId: product._id, quantity: quantity ?? 1 });
    setQuantity?.(product.countInStock > 0 ? 1 : 0);
  } catch (err: any) {
    console.error('Failed to add to cart:', error);
  }
};

// 移除購物車中商品
export const handleRemoveFromCart = async (
  productId: string,
  removeFromCart: (productId: string) => Promise<void>
) => {
  try {
    await removeFromCart(productId);
  } catch (err: any) {
    console.error(`Failed to remove product with ID ${productId} from cart:`, error);
  }
};

interface FreeShippingInfo {
  isFreeShipping: boolean;
  shippingFee: number;
  message: string;
}

// 計算免運門檻
export const calculateFreeShipping = (cartTotal: number, threshold: number = 500): FreeShippingInfo => {
  const isFreeShipping = cartTotal >= threshold;
  const shippingFee = isFreeShipping ? 0 : 60;
  const message = isFreeShipping
    ? `已達 NT$${threshold} 最低免運門檻！`
    : `再湊 NT$${threshold - cartTotal} 元即可享免運費！`;

  return { isFreeShipping, shippingFee, message };
};