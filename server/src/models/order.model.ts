import { Schema, Types, model } from "mongoose";

export enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  PickedUp = "picked_up",
  Completed = "completed",
  Canceled = "canceled",
  ReturnRequested = "return_requested",
  Returned = "returned"
}

enum PaymentStatus {
  Unpaid = "unpaid",
  Paid = "paid",
  Refunded = "refunded"
}

enum ShippingStatus {
  NotShipped = "not_shipped",
  Pending = "pending",
  InTransit = "in_transit",
  Delivered = "delivered",
  PickedUp = "picked_up",
  Returning = "returning",
  Returned = "returned"
}

const ORDER_STATUS_FLOW: Record<OrderStatus, { paymentStatus: PaymentStatus; shippingStatus: ShippingStatus }> = {
  [OrderStatus.Created]: { paymentStatus: PaymentStatus.Unpaid, shippingStatus: ShippingStatus.NotShipped },
  [OrderStatus.Paid]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.NotShipped },
  [OrderStatus.Processing]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.Pending },
  [OrderStatus.Shipped]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.InTransit },
  [OrderStatus.Delivered]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.Delivered },
  [OrderStatus.PickedUp]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.PickedUp },
  [OrderStatus.Completed]:  { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.PickedUp },
  [OrderStatus.Canceled]: { paymentStatus: PaymentStatus.Unpaid, shippingStatus: ShippingStatus.NotShipped },
  [OrderStatus.ReturnRequested]: { paymentStatus: PaymentStatus.Paid, shippingStatus: ShippingStatus.Returning },
  [OrderStatus.Returned]: { paymentStatus: PaymentStatus.Refunded, shippingStatus: ShippingStatus.Returned },
};

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  amount: number;
  title: string;
  imageUrl?: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNo: string;
  userId: Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  orderItems: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  couponCode?: string;
  discount?: number; // 折扣金額
  totalAmount: number; // 最終應付金額（商品金額 + 運費 - 折扣）
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  shippingTrackingNo?: string;
  paymentMethod?: string;
  paymentDate?: Date;
  returnReason?: string;
  returnDate?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  imageUrl: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNo: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    orderItems: [orderItemSchema],
    subtotal: { type: Number, default: 0, required: true },
    shippingFee: { type: Number, default: 60 },
    couponCode: { type: String },
    subtotal: { type: Number, default: 0, required: true, min: 0 },
    shippingFee: { type: Number, default: 60, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { 
      type: String, 
      enum: Object.values(OrderStatus), 
      default: OrderStatus.Created 
    },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.Unpaid 
    },
    shippingStatus: { 
      type: String, 
      enum: Object.values(ShippingStatus), 
      default: ShippingStatus.NotShipped 
    },
    shippingTrackingNo: { type: String, unique: true, sparse: true, default: undefined },
    paymentMethod: { type: String },
    paymentDate: { type: Date },
    returnReason: { type: String },
    returnDate: { type: Date },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

orderSchema.pre("save", function(next) {
  const order = this;

  // 根據 status 自動更新 paymentStatus 跟 shippingStatus
  if (ORDER_STATUS_FLOW[order.status as OrderStatus]) {
    order.paymentStatus = ORDER_STATUS_FLOW[order.status as OrderStatus].paymentStatus;
    order.shippingStatus = ORDER_STATUS_FLOW[order.status as OrderStatus].shippingStatus;
  }

  next();
});

orderSchema.index({ orderNo: "text" });
orderSchema.index({ userId: 1 });
orderSchema.index({ "orderItems.title": "text" });
orderSchema.index({ status: 1 });

export const OrderModel = model<IOrder>("Order", orderSchema);
