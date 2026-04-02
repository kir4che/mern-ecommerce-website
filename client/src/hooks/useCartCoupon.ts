import { useCallback, useMemo, useState } from "react";

import { useCouponMutation } from "@/store/slices/apiSlice";
import { addComma } from "@/utils/addComma";
import { getErrorMessage } from "@/utils/getErrorMessage";

const COUPON_MESSAGES = {
  EMPTY_INPUT: "請先輸入優惠碼",
  REMOVED: "已移除優惠碼",
  INVALID: "優惠碼不可使用",
  VALIDATION_FAILED: "優惠碼驗證失敗，請稍後再試。",
  APPLIED: (code: string, discount: number) =>
    `已套用優惠碼 ${code}，折抵 NT$ ${addComma(discount)}。`,
} as const;

export type CouponState = {
  code: string;
  discountAmount: number;
  message: string | null;
  input: string;
};

export type CheckoutCoupon = Pick<CouponState, "code" | "discountAmount">;

const INITIAL_COUPON_STATE: CouponState = {
  code: "",
  discountAmount: 0,
  message: null,
  input: "",
};

export const useCartCoupon = (
  subtotal: number,
  initialCoupon?: CheckoutCoupon | null
) => {
  const [validateCoupon, { isLoading: isValidatingCoupon }] =
    useCouponMutation();

  const [coupon, setCoupon] = useState<CouponState>(() => {
    if (initialCoupon && initialCoupon.code)
      return {
        code: initialCoupon.code,
        discountAmount: initialCoupon.discountAmount,
        message: COUPON_MESSAGES.APPLIED(
          initialCoupon.code,
          initialCoupon.discountAmount
        ),
        input: initialCoupon.code,
      };
    return INITIAL_COUPON_STATE;
  });

  const couponDiscount = useMemo(() => {
    return Math.min(coupon.discountAmount, subtotal);
  }, [coupon.discountAmount, subtotal]);

  const hasAppliedCoupon = coupon.code.length > 0;

  const resetCoupon = useCallback((message: string) => {
    setCoupon({ ...INITIAL_COUPON_STATE, message });
  }, []);

  const setCouponInput = useCallback((value: string) => {
    setCoupon((prev) => ({
      ...prev,
      input: value.toUpperCase(),
      message: null,
    }));
  }, []);

  const handleApplyCoupon = useCallback(async () => {
    const code = coupon.input.trim();
    if (!code) {
      resetCoupon(COUPON_MESSAGES.EMPTY_INPUT);
      return;
    }

    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (
        !result.valid ||
        !result.code ||
        typeof result.discountAmount !== "number"
      ) {
        resetCoupon(getErrorMessage({ data: result }, COUPON_MESSAGES.INVALID));
        return;
      }

      setCoupon({
        code: result.code,
        discountAmount: result.discountAmount,
        input: result.code,
        message: COUPON_MESSAGES.APPLIED(result.code, result.discountAmount),
      });
    } catch (err: unknown) {
      resetCoupon(getErrorMessage(err, COUPON_MESSAGES.VALIDATION_FAILED));
    }
  }, [coupon.input, resetCoupon, subtotal, validateCoupon]);

  const handleRemoveCoupon = useCallback(() => {
    resetCoupon(COUPON_MESSAGES.REMOVED);
  }, [resetCoupon]);

  const getCheckoutCoupon = useCallback((): CheckoutCoupon | null => {
    if (!hasAppliedCoupon) return null;
    return {
      code: coupon.code,
      discountAmount: coupon.discountAmount,
    };
  }, [coupon.code, coupon.discountAmount, hasAppliedCoupon]);

  return {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  };
};
