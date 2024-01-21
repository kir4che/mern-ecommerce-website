"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const order_model_1 = require("../models/order.model");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.session.user;
        if (role == 'admin') {
            yield (0, auth_middleware_1.default)(req);
            const orders = yield order_model_1.OrderModel.find();
            res.status(200).json({ message: 'Orders fetched successfully!', orders });
        }
        else {
            const userId = yield (0, auth_middleware_1.default)(req);
            const orders = yield order_model_1.OrderModel.find({ userId });
            res.status(200).json({ message: 'Orders fetched successfully!', orders });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth_middleware_1.default)(req);
        const order = yield order_model_1.OrderModel.findById(req.params.id);
        res.status(200).json({ message: 'Order fetched successfully!', order });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getOrderById = getOrderById;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, address, orderItems, totalAmount } = req.body;
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const order = new order_model_1.OrderModel({
            userId,
            name,
            phone,
            address,
            orderItems,
            totalAmount,
        });
        yield order.save();
        res.status(201).json({ message: 'Order created Successfully!', order });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, shippingStatus, paymentStatus } = req.body;
    try {
        yield (0, auth_middleware_1.default)(req);
        const order = yield order_model_1.OrderModel.findByIdAndUpdate(req.params.id, { status, shippingStatus, paymentStatus }, { new: true });
        res.status(200).json({ message: 'Order updated successfully!', order });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateOrder = updateOrder;
//# sourceMappingURL=order.controller.js.map