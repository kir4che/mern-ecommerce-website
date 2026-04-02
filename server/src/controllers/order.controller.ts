import { Request, Response } from "express";
import { Types } from "mongoose";
import ShortUniqueId from "short-unique-id";

import { CouponModel } from "../models/coupon.model";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { normalizeCouponCode, validateCouponForSubtotal } from "../utils/coupon";
import { ordersFilrer } from "../utils/ordersFilrer";
import { calculateShippingFee } from "../utils/shipping";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
  role?: string;
}

const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,
      type,
      sortBy = "createdAt",
      orderBy = "desc",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter = ordersFilrer(keyword as string, type as string, req.userId);

    const orders = await OrderModel.find(filter)
      .select(
        "_id userId orderNo name phone address orderItems subtotal shippingFee discount couponCode totalAmount status paymentStatus shippingStatus shippingTrackingNo paymentMethod returnReason returnDate note createdAt"
      )
      .sort({ [sortBy as string]: orderBy === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalOrders = await OrderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "USER_ORDERS_FETCH_FAILED", message });
  }
};

// admin 用來取得所有訂單
const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,
      type,
      sortBy = "createdAt",
      orderBy = "desc",
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter = ordersFilrer(keyword as string, type as string);

    // 查詢訂單
    const orders = await OrderModel.find(filter)
      .populate("userId", "name email")
      .sort({ [sortBy as string]: orderBy === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // 總訂單數量
    const totalOrders = await OrderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "ORDERS_FETCH_FAILED", message });
  }
};

const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const orderId = Array.isArray(id) ? id[0] : id;

  if (!Types.ObjectId.isValid(orderId))
    return res
      .status(400)
      .json({ success: false, code: "INVALID_ORDER_ID", message: "Invalid order ID format." });

  try {
    const order = await OrderModel.findById(orderId);

    // 驗證訂單是否存在
    if (!order)
      return res.status(404).json({ success: false, code: "ORDER_NOT_FOUND", message: "Order not found." });

    // 驗證訂單所有權：只有訂單所有人或 admin 才能查看
    if (req.role !== "admin" && req.userId && !order.userId.equals(req.userId))
      return res.status(403).json({
        success: false,
        code: "ORDER_VIEW_FORBIDDEN",
        message: "You are not authorized to view this order.",
      });

    res
      .status(200)
      .json({ success: true, order });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "ORDER_FETCH_FAILED", message });
  }
};

const createOrder = async (req: AuthRequest, res: Response) => {
  const { orderItems, couponCode } = req.body as {
    orderItems?: Array<{ productId?: string; quantity?: number }>;
    couponCode?: string;
  };

  if (!Array.isArray(orderItems) || orderItems.length === 0)
    return res.status(400).json({
      success: false,
      code: "ORDER_ITEMS_REQUIRED",
      message: "Order items are required.",
    });

  try {
    const normalizedItems = orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (
      normalizedItems.some(
        (item) =>
          !item.productId ||
          !Types.ObjectId.isValid(item.productId) ||
          typeof item.quantity !== "number" ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
      )
    )
      return res.status(400).json({
        success: false,
        code: "INVALID_ORDER_ITEMS",
        message: "Order items contain invalid productId or quantity.",
      });

    const productIds = normalizedItems.map((item) => item.productId as string);
    const products = await ProductModel.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const computedOrderItems = normalizedItems.map((item) => {
      const product = productMap.get(item.productId as string);
      if (!product)
        throw new Error(`PRODUCT_NOT_FOUND:${item.productId as string}`);

      const safeQuantity = Math.min(item.quantity as number, product.countInStock);
      return {
        productId: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        quantity: safeQuantity,
        price: product.price,
        amount: product.price * safeQuantity,
      };
    });

    const subtotal = computedOrderItems.reduce((sum, item) => sum + item.amount, 0);
    const shippingFee = calculateShippingFee(subtotal);
    let discount = 0;
    let appliedCouponCode: string | undefined;

    // 驗證並計算折扣金額
    if (typeof couponCode === "string" && couponCode.trim()) {
      const normalizedCode = normalizeCouponCode(couponCode);
      const coupon = await CouponModel.findOne({ code: normalizedCode });
      const couponValidationResult = validateCouponForSubtotal(coupon, subtotal);

      // 優惠碼無效處理
      if (!couponValidationResult.valid)
        return res.status(400).json({
          success: false,
          code: couponValidationResult.code,
          message: couponValidationResult.message,
        });

      discount = couponValidationResult.discountAmount;
      appliedCouponCode = normalizedCode;
    }

    const totalAmount = subtotal + shippingFee - discount;

    const uid = new ShortUniqueId({ length: 16 });
    const orderNo = uid.randomUUID();

    const order = new OrderModel({
      orderNo,
      userId: req.userId,
      orderItems: computedOrderItems,
      subtotal,
      shippingFee,
      discount,
      couponCode: appliedCouponCode,
      totalAmount,
      paymentStatus: "unpaid",
    });
    await order.save();

    res
      .status(201)
      .json({ success: true, message: "Order created Successfully!", order });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith("PRODUCT_NOT_FOUND:"))
      return res.status(404).json({
        success: false,
        code: "PRODUCT_NOT_FOUND",
        message: "One or more products were not found.",
      });

    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "ORDER_CREATE_FAILED", message });
  }
};

const updateOrder = async (req: AuthRequest, res: Response) => {
  const updateData = req.body;

  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, code: "ORDER_NOT_FOUND", message: "Order not found." });

    if (!order.userId.equals(req.userId))
      return res.status(403).json({
        success: false,
        code: "ORDER_UPDATE_FORBIDDEN",
        message: "You are not authorized to update this order.",
      });

    // 只允許更新特定欄位
    const allowedFields = ['name', 'phone', 'address', 'note'];
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      filteredData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "ORDER_UPDATE_FAILED", message });
  }
};

export { createOrder, getOrderById, getOrders, getOrdersByUser, updateOrder };
