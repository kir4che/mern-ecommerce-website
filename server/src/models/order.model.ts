import { Schema, Types, model } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  orderItems: object[];
  totalAmount: number;
  status: string;
  shippingStatus: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["已成立", "已付款", "已出貨", "已取消", "已完成", "已退貨"],
      default: "已成立",
    },
    shippingStatus: {
      type: String,
      enum: ["尚未寄件", "運送中", "已送達"],
      default: "尚未寄件",
    },
    paymentStatus: {
      type: String,
      enum: ["尚未付款", "已付款"],
      default: "尚未付款",
    },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>("Order", orderSchema);
