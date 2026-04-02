import { Request, Response } from "express";
import { Types } from "mongoose";

import { CouponModel, DISCOUNT_TYPES } from "../models/coupon.model";
import {
  normalizeCouponCode,
  validateCouponForSubtotal,
  validateDiscountValue,
} from "../utils/coupon";

type CreateCouponRequestBody = {
  code?: string;
  discountType?: string;
  discountValue?: number;
  expiryDate?: string;
  isActive?: boolean;
  minPurchaseAmount?: number;
};

type CouponRequestBody = {
  code?: string;
  subtotal?: number;
};

// 取得所有優惠券
const getCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res
      .status(500)
      .json({ success: false, code: "COUPONS_FETCH_FAILED", message });
  }
};

// 建立優惠券
const createCoupon = async (
  req: Request<unknown, unknown, CreateCouponRequestBody>,
  res: Response
) => {
  const {
    code,
    discountType,
    discountValue,
    expiryDate,
    isActive = true,
    minPurchaseAmount = 0,
  } = req.body;

  if (!code || !discountType || typeof discountValue !== "number" || !expiryDate)
    return res.status(400).json({
      success: false,
      code: "COUPON_FIELDS_REQUIRED",
      message: "code, discountType, discountValue, and expiryDate are required.",
    });

  if (!DISCOUNT_TYPES.includes(discountType as (typeof DISCOUNT_TYPES)[number]))
    return res.status(400).json({
      success: false,
      code: "INVALID_DISCOUNT_TYPE",
      message: "discountType must be either percentage or fixed.",
    });

  const discountValidation = validateDiscountValue(discountType, discountValue);
  if (!discountValidation.valid)
    return res.status(400).json({
      success: false,
      code: "INVALID_DISCOUNT_VALUE",
      message: discountValidation.error,
    });

  if (minPurchaseAmount < 0)
    return res.status(400).json({
      success: false,
      code: "INVALID_MIN_PURCHASE_AMOUNT",
      message: "minPurchaseAmount cannot be less than 0.",
    });

  const parsedExpiryDate = new Date(expiryDate);
  if (Number.isNaN(parsedExpiryDate.getTime()))
    return res.status(400).json({
      success: false,
      code: "INVALID_EXPIRY_DATE",
      message: "expiryDate format is invalid.",
    });

  try {
    const coupon = await CouponModel.create({
      code: normalizeCouponCode(code),
      discountType,
      discountValue,
      expiryDate: parsedExpiryDate,
      isActive,
      minPurchaseAmount,
    });

    return res.status(201).json({ success: true, coupon });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    )
      return res.status(409).json({
        success: false,
        code: "COUPON_CODE_ALREADY_EXISTS",
        message: "Coupon code already exists.",
      });

    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res
      .status(500)
      .json({ success: false, code: "COUPON_CREATE_FAILED", message });
  }
};

// 更新優惠券
const updateCouponById = async (
  req: Request<{ id: string }, unknown, CreateCouponRequestBody>,
  res: Response
) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({
      success: false,
      code: "INVALID_COUPON_ID",
      message: "Invalid coupon ID format.",
    });

  const {
    code,
    discountType,
    discountValue,
    expiryDate,
    isActive,
    minPurchaseAmount,
  } = req.body;

  if (discountType && !DISCOUNT_TYPES.includes(discountType as (typeof DISCOUNT_TYPES)[number]))
    return res.status(400).json({
      success: false,
      code: "INVALID_DISCOUNT_TYPE",
      message: "discountType must be either percentage or fixed.",
    });

  if (discountValue !== undefined && typeof discountValue !== "number") {
    return res.status(400).json({
      success: false,
      code: "INVALID_DISCOUNT_VALUE",
      message: "Discount value must be a number.",
    });
  }

  if (discountValue !== undefined) {
    const discountValidation = validateDiscountValue(
      discountType || "fixed",
      discountValue
    );
    if (!discountValidation.valid)
      return res.status(400).json({
        success: false,
        code: "INVALID_DISCOUNT_VALUE",
        message: discountValidation.error,
      });
  }

  if (minPurchaseAmount !== undefined && minPurchaseAmount < 0)
    return res.status(400).json({
      success: false,
      code: "INVALID_MIN_PURCHASE_AMOUNT",
      message: "minPurchaseAmount cannot be less than 0.",
    });

  if (expiryDate !== undefined) {
    const parsedExpiryDate = new Date(expiryDate);
    if (Number.isNaN(parsedExpiryDate.getTime()))
      return res.status(400).json({
        success: false,
        code: "INVALID_EXPIRY_DATE",
        message: "expiryDate format is invalid.",
      });
  }

  try {
    const existingCoupon = await CouponModel.findById(id);

    if (!existingCoupon)
      return res.status(404).json({
        success: false,
        code: "COUPON_NOT_FOUND",
        message: "Coupon not found.",
      });

    // 合併後再次驗證（避免 percentage > 100）
    if (discountType === "percentage" || existingCoupon.discountType === "percentage") {
      const finalDiscountType = discountType ?? existingCoupon.discountType; // 最終折扣類型
      const finalDiscountValue = discountValue ?? existingCoupon.discountValue; // 最終折扣值
      const validation = validateDiscountValue(finalDiscountType, finalDiscountValue);

      if (!validation.valid)
        return res.status(400).json({
          success: false,
          code: "INVALID_DISCOUNT_VALUE",
          message: validation.error,
        });
    }

    // 建立更新資料（只更新有提供的欄位）
    const updateData: Partial<{
      code: string;
      discountType: string;
      discountValue: number;
      expiryDate: Date;
      isActive: boolean;
      minPurchaseAmount: number;
    }> = {};

    if (code !== undefined) updateData.code = normalizeCouponCode(code);
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = discountValue;
    if (expiryDate !== undefined) updateData.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (minPurchaseAmount !== undefined)
      updateData.minPurchaseAmount = minPurchaseAmount;

    const coupon = await CouponModel.findByIdAndUpdate(existingCoupon._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Coupon has been updated.",
      coupon,
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    )
      return res.status(409).json({
        success: false,
        code: "COUPON_CODE_ALREADY_EXISTS",
        message: "Coupon code already exists.",
      });

    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res
      .status(500)
      .json({ success: false, code: "COUPON_UPDATE_FAILED", message });
  }
};

// 刪除優惠券
const deleteCouponById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({
      success: false,
      code: "INVALID_COUPON_ID",
      message: "Invalid coupon ID format.",
    });

  try {
    const coupon = await CouponModel.findByIdAndDelete(id);

    if (!coupon)
      return res.status(404).json({
        success: false,
        code: "COUPON_NOT_FOUND",
        message: "Coupon not found.",
      });

    return res.status(200).json({
      success: true,
      message: "Coupon has been deleted.",
      coupon,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res
      .status(500)
      .json({ success: false, code: "COUPON_DELETE_FAILED", message });
  }
};

// 驗證優惠券是否可用
const validateCoupon = async (
  req: Request<unknown, unknown, CouponRequestBody>,
  res: Response
) => {
  const { code, subtotal } = req.body;

  if (!code)
    return res.status(400).json({
      valid: false,
      code: "COUPON_CODE_REQUIRED",
      message: "Please provide a coupon code.",
    });

  if (subtotal !== undefined && (typeof subtotal !== "number" || subtotal < 0))
    return res.status(400).json({
      valid: false,
      code: "INVALID_SUBTOTAL",
      message: "subtotal must be a number greater than or equal to 0.",
    });

  try {
    const normalizedCode = normalizeCouponCode(code);
    const coupon = await CouponModel.findOne({ code: normalizedCode });

    const subtotalForValidation = typeof subtotal === "number" ? subtotal : 0;

    const result = validateCouponForSubtotal(coupon, subtotalForValidation);

    if (!result.valid)
      return res.status(200).json({
        valid: false,
        code: result.code,
        message: result.message,
      });

    return res.status(200).json({
      valid: true,
      type: result.type,
      value: result.value,
      discountAmount: result.discountAmount,
      code: normalizedCode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res
      .status(500)
      .json({ valid: false, code: "COUPON_VALIDATE_FAILED", message });
  }
};

export {
  createCoupon,
  deleteCouponById,
  getCoupons,
  updateCouponById,
  validateCoupon
};

