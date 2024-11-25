import { Schema, Types, model } from "mongoose";

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  cartId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

const cartItemSchema = new Schema<ICartItem>({
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

export const CartItemModel = model<ICartItem>("CartItem", cartItemSchema);
