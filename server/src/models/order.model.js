"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    orderItems: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['已成立', '已付款', '已出貨', '已取消', '已完成', '已退貨'], default: '已成立' },
    shippingStatus: { type: String, enum: ['尚未寄件', '運送中', '已送達'], default: '尚未寄件' },
    paymentStatus: { type: String, enum: ['尚未付款', '已付款'], default: '尚未付款' },
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
