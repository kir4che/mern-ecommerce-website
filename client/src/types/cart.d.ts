import type { BaseResponse } from "./common";
import type { Product } from "./product";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CartItem extends CartItemInput {
  _id: string;
  cartId: string;
  product: Product;
}

export interface SyncCartData {
  localCart: CartItemInput[];
}

export interface AddCartItemParams {
  productId: string;
  quantity: number;
  product?: Partial<Product>;
}

export interface UpdateCartItemQuantityParams {
  cartItemId: string;
  quantity: number;
}

export interface CartResponse extends BaseResponse {
  cart: CartItem[];
}
