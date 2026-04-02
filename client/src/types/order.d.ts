import {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  SHIPPING_STATUS_MAP,
} from "@/constants/actionTypes";
import type { BaseResponse } from "./common";

export type OrderStatus = keyof typeof ORDER_STATUS_MAP;
export type PaymentStatus = keyof typeof PAYMENT_STATUS_MAP;
export type ShippingStatus = keyof typeof SHIPPING_STATUS_MAP;

export interface UserRef {
  _id: string;
  name?: string;
  email?: string;
}

export interface OrderItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  amount: number;
  title: string;
  imageUrl?: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  userId: string | UserRef;
  name: string;
  phone: string;
  address: string;
  orderItems: OrderItem[];
  subtotal: number;
  shippingFee: number;
  couponCode?: string;
  discount?: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingStatus: ShippingStatus;
  shippingTrackingNo?: string;
  paymentMethod?: string;
  paymentDate?: string;
  returnReason?: string;
  returnDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  userId?: string;
  sortBy?: string;
  orderBy?: string;
  isAdmin?: boolean;
}

export interface CreateOrderData {
  orderItems: Array<{ productId: string; quantity: number }>;
  couponCode?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  shippingTrackingNo?: string;
}

export interface OrdersResponse extends BaseResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}
