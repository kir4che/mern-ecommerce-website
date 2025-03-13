enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  PickedUp = "picked_up",
  Completed = "completed",
  Canceled = "canceled",
  ReturnRequested = "return_requested",
  Returned = "returned",
}

enum PaymentStatus {
  Unpaid = "unpaid",
  Paid = "paid",
  Refunded = "refunded",
}

enum ShippingStatus {
  NotShipped = "not_shipped",
  Pending = "pending",
  InTransit = "in_transit",
  Delivered = "delivered",
  PickedUp = "picked_up",
  Returning = "returning",
  Returned = "returned",
}

interface OrderItem {
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
  userId: string;
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
