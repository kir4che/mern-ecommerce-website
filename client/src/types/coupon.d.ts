import type { BaseResponse } from "./common";

export type DiscountType = "percentage" | "fixed";

export interface CouponItem {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate: string;
  isActive: boolean;
  minPurchaseAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateCouponParams {
  code: string;
  subtotal?: number;
}

export interface CreateCouponData {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate: string;
  isActive?: boolean;
  minPurchaseAmount?: number;
}

export type UpdateCouponData = Partial<CreateCouponData>;

export interface CouponsResponse extends BaseResponse {
  coupons: CouponItem[];
}

export interface CouponDetailResponse extends BaseResponse {
  coupon: CouponItem;
}

export type CouponResponse =
  | {
      valid: true;
      code: string;
      type: DiscountType;
      value: number;
      discountAmount: number;
    }
  | { valid: false; message: string };
