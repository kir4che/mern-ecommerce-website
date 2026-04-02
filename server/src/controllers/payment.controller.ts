import * as crypto from "crypto";
import { Request, Response } from "express";
import { Types } from "mongoose";
import ShortUniqueId from "short-unique-id";

import {
  ORDER_STATUS,
  OrderModel,
  PAYMENT_STATUS,
} from "../models/order.model";
import { ProductModel } from "../models/product.model";

const createPaymentHandler = async (req: Request, res: Response) => {
  const { orderId, name, phone, address, note, ChoosePayment } = req.body;

  if (!Types.ObjectId.isValid(orderId))
    return res
      .status(400)
      .json({ success: false, code: "INVALID_ORDER_ID", message: "Invalid order ID format." });

  try {
    const order = await OrderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, code: "ORDER_NOT_FOUND", message: "Order not found." });

    // 驗證訂單是否可以進行支付（只能支付未付款的訂單）
    if (order.paymentStatus !== "unpaid")
      return res
        .status(400)
        .json({
          success: false,
          code: "ORDER_ALREADY_PAID",
          message: "This order has already been paid.",
        });

    // 先更新訂單的購買人資訊（note 暫存於 pendingNote，付款成功後才正式寫入）
    order.set({ name, phone, address, pendingNote: note ?? "" });
    await order.save();

    const { totalAmount, orderItems } = order;
    const uid = new ShortUniqueId({ length: 20 });
    const tradeNo = uid.randomUUID();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const MerchantTradeDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const ItemName = orderItems
      .map(
        (item: { title: string; quantity: number }) =>
          `${item.title} x ${item.quantity}`
      )
      .join("#");

    // 建立傳送給綠界的交易參數
    const base_param = {
      MerchantID: process.env.MERCHANT_ID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate,
      PaymentType: "aio",
      TotalAmount: totalAmount,
      TradeDesc: "日出麵包坊",
      ItemName,
      ReturnURL: `${process.env.BACKEND_URL}/api/payment/callback`,
      ClientBackURL: `${process.env.FRONTEND_URL}/my-account`, // 付款完成後導回會員資訊頁，讓使用者查看訂單狀態。
      ChoosePayment,
      EncryptType: 1, // 一律為 1，表示 SHA256 加密。
      CustomField1: orderId,
    };

    const CheckMacValue = generateCheckValue(base_param);
    const fullParams = Object.assign({}, base_param, { CheckMacValue });

    res.json({ success: true, params: fullParams });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      code: "PAYMENT_CREATE_FAILED",
      message: "Internal server err. Please try again later.",
    });
  }
};

// 產生綠界需要的檢查碼 (CheckMacValue)
const generateCheckValue = (data: Record<string, any>) => {
  const keys = Object.keys(data).sort(); // 將參數鍵按字母排序
  let checkValue = "";
  for (const key of keys) {
    checkValue += `${key}=${data[key]}&`;
  }
  checkValue = `HashKey=${process.env.HASH_KEY}&${checkValue}HashIV=${process.env.HASH_IV}`;

  checkValue = encodeURIComponent(checkValue).toLowerCase();
  // 替換特定字元，以符合綠界規範。
  checkValue = checkValue
    .replace(/%20/g, "+")
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%20/g, "+");

  // 進行 SHA256 雜湊運算並轉換為大寫
  checkValue = crypto.createHash("sha256").update(checkValue).digest("hex");
  checkValue = checkValue.toUpperCase();
  return checkValue;
};

// 綠界付款完成後的處理
const handlePaymentCallback = async (req: Request, res: Response) => {
  const { RtnCode, PaymentDate, CustomField1, CheckMacValue } = req.body;
  console.log("ECPay callback:", req.body);
  try {
    const callbackData = { ...req.body };
    delete callbackData.CheckMacValue;
    const expectedCheckMacValue = generateCheckValue(callbackData);

    if (CheckMacValue !== expectedCheckMacValue) {
      console.error("Invalid CheckMacValue:", { received: CheckMacValue, expected: expectedCheckMacValue });
      return res.status(403).send("0");
    }

    // 判斷交易結果（1 代表付款成功，其他狀態則為失敗）以及更新訂單狀態
    const nextStatus: (typeof ORDER_STATUS)[number] =
      RtnCode == 1 ? "paid" : "created";
    const nextPaymentStatus: (typeof PAYMENT_STATUS)[number] =
      RtnCode == 1 ? "paid" : "unpaid";

    let paymentDate = PaymentDate ? new Date(PaymentDate) : new Date();
    if (Number.isNaN(paymentDate.getTime())) paymentDate = new Date();

    const order = await OrderModel.findById(CustomField1);
    if (!order) return res.status(404).send("Order not found.");

    // 避免重複扣庫存（callback 可能被綠界重送）
    if (order.paymentStatus === "paid") return res.status(200).send("1");

    const updateData: Record<string, unknown> = {
      status: nextStatus,
      paymentStatus: nextPaymentStatus,
      paymentDate,
    };

    // 付款成功才把暫存備註正式寫入
    if (RtnCode == 1 && order.pendingNote !== undefined) {
      updateData.note = order.pendingNote;
      updateData.pendingNote = undefined;
    }

    order.set(updateData);
    await order.save();

    if (RtnCode == 1)
      await ProductModel.bulkWrite(
        order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.productId, countInStock: { $gte: item.quantity } },
            update: { $inc: { countInStock: -item.quantity } },
          },
        }))
      );

    res.status(200).send("1");
  } catch (err: unknown) {
    res.status(500).send("0");
  }
};

export { createPaymentHandler, handlePaymentCallback };
