import { Request, Response } from "express";
import { Types } from "mongoose";
import ShortUniqueId from 'short-unique-id';
import * as crypto from 'crypto';

import { OrderModel } from "../models/order.model";

const createPaymentHandler = async (req: Request, res: Response) => {
  const { orderId, name, phone, address, note, ChoosePayment } = req.body;

  if (!Types.ObjectId.isValid(orderId))
    return res.status(400).json({ success: false, message: 'Invalid order ID format.' });

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });

    // 先更新訂單的購買人資訊
    order.set({ name, phone, address, note });
    await order.save();

    const { totalAmount, orderItems } = order;
    const uid = new ShortUniqueId({ length: 20 });
    const tradeNo = uid.randomUUID();
    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
    const ItemName = orderItems.map((item: { title: string; quantity: number; }) => `${item.title} x ${item.quantity}`).join("#");

    // 建立傳送給綠界的交易參數
    const base_param = {
      MerchantID: process.env.MERCHANT_ID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate,
      PaymentType: 'aio',
      TotalAmount: totalAmount,
      TradeDesc: "日出麵包坊",
      ItemName,
      ReturnURL: `${process.env.BACKEND_URL}/api/payment/callback`,
      ClientBackURL: `${process.env.FRONTEND_URL}/my-account`, // 付款完成後導回會員資訊頁，讓使用者查看訂單狀態。
      ChoosePayment,
      EncryptType: 1, // 一律為 1，表示 SHA256 加密。
      CustomField1: orderId
    };

    const CheckMacValue = generateCheckValue(base_param);
    const fullParams = Object.assign({}, base_param, { CheckMacValue });

    res.json({ success: true, params: fullParams });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Internal server err. Please try again later.' });
  }
};

// 產生綠界需要的檢查碼 (CheckMacValue) 
const generateCheckValue = (data: Record<string, any>) => {
  const keys = Object.keys(data).sort(); // 將參數鍵按字母排序
  let checkValue = '';
  for(const key of keys){ checkValue += `${key}=${data[key]}&` }
  checkValue = `HashKey=${process.env.HASH_KEY}&${checkValue}HashIV=${process.env.HASH_IV}`;

  checkValue = encodeURIComponent(checkValue).toLowerCase();
  // 替換特定字元，以符合綠界規範。
  checkValue = checkValue.replace(/%20/g, '+')
              .replace(/%2d/g, '-')
              .replace(/%5f/g, '_')
              .replace(/%2e/g, '.')
              .replace(/%21/g, '!')
              .replace(/%2a/g, '*')
              .replace(/%28/g, '(')
              .replace(/%29/g, ')')
              .replace(/%20/g, '+');

  // 進行 SHA256 雜湊運算並轉換為大寫
  checkValue = crypto.createHash('sha256').update(checkValue).digest('hex');
  checkValue = checkValue.toUpperCase();
  return checkValue;
};

// 綠界付款完成後的處理
const handlePaymentCallback = async (req: Request, res: Response) => {
  const { RtnCode, PaymentDate, CustomField1 } = req.body;
  console.log("ECPay callback:", req.body);
  try {
    // 判斷交易結果（1 代表付款成功，其他狀態則為失敗）以及更新訂單狀態
    const updateData = {
      status: RtnCode == 1 ? OrderStatus.Paid : OrderStatus.Created,
      paymentDate: new Date(PaymentDate).toISOString()
    };

    const order = await OrderModel.findById(CustomField1);
    if (!order) return res.status(404).send("Order not found.");

    order.set(updateData);
    await order.save();

    res.status(200).send("1");
  } catch (err: any) {
    res.status(500).send("0");
  }
};

export { createPaymentHandler, handlePaymentCallback };
