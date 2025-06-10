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
