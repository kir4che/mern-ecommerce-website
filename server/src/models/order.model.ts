import { Schema, Types, model } from "mongoose";

export const ORDER_STATUS = ["已成立", "已付款", "已出貨", "已取消", "已完成", "已退貨"];
export const SHIPPING_STATUS = ["尚未寄件", "運送中", "已送達"];
export const PAYMENT_STATUS = ["尚未付款", "已付款"];

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  amount: number;
  title: string;
  imageUrl?: string;
}

export const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, default: undefined },
});

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  orderItems: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  couponCode?: string;
  discountAmount: number;
  status: string;
  shippingStatus: string;
  paymentStatus: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    orderItems: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 60 },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    status: { type: String, enum: ORDER_STATUS, default: "已成立" },
    shippingStatus: { type: String, enum: SHIPPING_STATUS, default: "尚未寄件" },
    paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "尚未付款" },
    note: { type: String, default: undefined },
  },
  { timestamps: true },
);

export const OrderModel = model<IOrder>("Order", orderSchema);
