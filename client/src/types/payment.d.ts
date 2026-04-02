type PaymentMethod = "ATM" | "WebATM" | "Credit";

export interface CreatePaymentData {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  note?: string;
  ChoosePayment: PaymentMethod;
}
