import { Product } from '@/types/product';

export const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['.', ',', '-', 'e'].includes(e.key)) {
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
    inputValue = value.target.value.replace(/^0+(?!$)/, '');
    value.target.value = inputValue; // 更新輸入框的值
  }

  let newQuantity = parseInt(inputValue, 10);
  if (isNaN(newQuantity)) return;

  if (newQuantity < 1) newQuantity = 1;
  else if (newQuantity > (product?.countInStock || Infinity)) {
    newQuantity = product?.countInStock || 1;
  }

  setQuantity(newQuantity);
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
    if (product.countInStock > 0) setQuantity?.(1);
    else setQuantity?.(0);
  } catch (error) {
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
  } catch (error) {
    console.error('Failed to remove from cart:', error);
  }
};

// 計算購物車總金額
export const calculateTotal = (cart) => {
  return cart.reduce((total, { product: { price }, quantity }) => total + price * quantity, 0);
}

// 計算免運門檻
export const calculateFreeShipping = (
  cartTotal: number,
  shippingThreshold: number = 500
): { message: string; isFreeShipping: boolean } => {
  if (cartTotal >= shippingThreshold) {
    return {
      isFreeShipping: true,
      message: `已達 NT$${shippingThreshold} 最低免運門檻！`,
    };
  } else {
    const remainingAmount = shippingThreshold - cartTotal;
    return {
      isFreeShipping: false,
      message: `再湊 NT$${remainingAmount} 元即可享免運費！`,
    };
  }
};