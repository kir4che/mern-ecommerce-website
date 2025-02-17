import { Schema, Types, model } from "mongoose";

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: Types.ObjectId[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem", required: true }],
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

export const CartModel = model<ICart>("Cart", cartSchema);
