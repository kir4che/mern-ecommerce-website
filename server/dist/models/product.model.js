"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    categories: { type: [String], required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    expiryDate: { type: String, required: true },
    allergens: { type: [String], default: [] },
    delivery: { type: String, default: '常溫宅配' },
    storage: { type: String, default: '請保存於陰涼處，避免高溫或陽光照射。' },
    ingredients: { type: String, default: '' },
    nutrition: { type: String, default: '' },
    countInStock: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true,
});
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
//# sourceMappingURL=product.model.js.map