"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemModel = void 0;
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    cartId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cart', required: true },
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
});
exports.CartItemModel = (0, mongoose_1.model)('CartItem', cartItemSchema);
