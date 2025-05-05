import { Request, Response } from "express";
import { Types } from "mongoose";
import ShortUniqueId from 'short-unique-id';

import { OrderModel, OrderStatus } from "../models/order.model";
import { ordersFilrer } from "../utils/ordersFilrer";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
  role?: string;
}

const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, keyword, type, sortBy = "createdAt", orderBy = "desc" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter = ordersFilrer(keyword as string, type as string, req.userId);

    const orders = await OrderModel.find(filter)
      .select("_id orderNo name phone address orderItems subtotal shippingFee discount couponCode totalAmount status paymentStatus shippingStatus shippingTrackingNo paymentMethod returnReason returnDate note createdAt")
      .sort({ [sortBy as string]: orderBy === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalOrders = await OrderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// admin 用來取得所有訂單
const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, keyword, type, sortBy = "createdAt", orderBy = "desc" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter = ordersFilrer(keyword as string, type as string);
    
    // 查詢訂單
    const orders = await OrderModel.find(filter)
      .sort({ [sortBy as string]: orderBy === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // 總訂單數量
    const totalOrders = await OrderModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNumber),
      currentPage: pageNumber,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ success: false, message: 'Invalid order ID format.' });

  try {
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // 如果訂單的 userId 和當前 user 不匹配，則無權更新。
    if (req.role !== "admin" && !order.userId.equals(req.userId))
      return res.status(403).json({ success: false, message: "You are not authorized to view this order." });

    res.status(200).json({ success: true, message: "Order fetched successfully!", order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createOrder = async (req: AuthRequest, res: Response) => {
  const { orderItems, subtotal, shippingFee, couponCode, discount, totalAmount } = req.body;

  try {
    const uid = new ShortUniqueId({ length: 16 });
    const orderNo = uid.randomUUID();

    const order = new OrderModel({
      orderNo,
      userId: req.userId,
      orderItems,
      subtotal,
      shippingFee,
      couponCode,
      discount: discount ?? 0,
      totalAmount: totalAmount || subtotal + shippingFee - (discount ?? 0), // 同样使用 discount ?? 0
      paymentStatus: "unpaid",
    });
    await order.save();

    res.status(201).json({ success: true, message: "Order created Successfully!", order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrder = async (req: AuthRequest, res: Response) => {
  const updateData = req.body;

  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    if (!order.userId.equals(req.userId))
      return res.status(403).json({ success: false, message: "You are not authorized to update this order." });

    for (const key in updateData) {
      if (Object.prototype.hasOwnProperty.call(updateData, key))
        (order as any)[key] = updateData[key];
    }

    const updatedOrder = await order.save();
    
    res.status(200).json({ success: true, message: "Order updated successfully!", order: updatedOrder });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { getOrdersByUser, getOrders, getOrderById, createOrder, updateOrder };
