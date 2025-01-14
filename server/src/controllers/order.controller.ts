import { Request, Response } from "express";
import { Types } from "mongoose";

import { OrderModel } from "@/models/order.model";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const orders = await OrderModel.find({ userId });
    res.status(200).json({ message: "Orders fetched successfully!", orders });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json({ message: "Orders fetched successfully!", orders });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    // 如果訂單的 userId 和當前 user 不匹配，則無權更新。
    if (!order.userId.equals(req.userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this order." });
    }

    res.status(200).json({ message: "Order fetched successfully!", order });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const createOrder = async (req: AuthRequest, res: Response) => {
  const { orderItems, subtotal, shippingFee, couponCode, discount, totalAmount } = req.body;

  try {
    const userId = req.userId;
    const order = new OrderModel({
      userId,
      orderItems,
      subtotal,
      shippingFee,
      couponCode,
      discount: discount ?? 0,
      totalAmount: totalAmount || subtotal + shippingFee - (discount ?? 0), // 同样使用 discount ?? 0
    });
    await order.save();

    res.status(201).json({ message: "Order created Successfully!", order });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrder = async (req: AuthRequest, res: Response) => {
  const { status, shippingStatus, paymentStatus } = req.body;

  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (!order.userId.equals(req.userId))
      return res.status(403).json({ message: "You are not authorized to update this order." });

    // 更新訂單
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status, shippingStatus, paymentStatus },
      { new: true },
    );
    res.status(200).json({ message: "Order updated successfully!", order: updatedOrder });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export { getOrders, getOrdersForAdmin, getOrderById, createOrder, updateOrder };
