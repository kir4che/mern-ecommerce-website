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
exports.clearCart = exports.changeQuantity = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cart_model_1 = require("../models/cart.model");
const cartItem_model_1 = require("../models/cartItem.model");
const product_model_1 = require("../models/product.model");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        // populate() 方法會將指定的欄位填入資料，也就是會將 cart.items 中的所有資料填入。
        const cart = (yield cart_model_1.CartModel.findOne({ userId }).populate('items'));
        if (!cart)
            return res.status(404).json({ message: 'Cart not found.' });
        const populatedItems = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_model_1.ProductModel.findById(item.productId);
            return {
                _id: item._id,
                cartId: item.cartId,
                productId: item.productId,
                quantity: item.quantity,
                product: product
                    ? {
                        title: product.title,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        countInStock: product.countInStock,
                    }
                    : null,
            };
        })));
        res.status(200).json({ message: 'Cart fetched successfully!', cart: populatedItems });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = req.body;
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const cart = yield cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found.' });
        // 檢查購物車中是否已經存在相同產品
        const existingCartItem = yield cartItem_model_1.CartItemModel.findOne({ cartId: cart._id, productId });
        if (existingCartItem) {
            // 更新數量
            existingCartItem.quantity += quantity;
            yield existingCartItem.save();
        }
        else {
            // 如果不存在，創建新的購物車項目
            const cartItem = new cartItem_model_1.CartItemModel({ cartId: cart._id, productId, quantity });
            yield cartItem.save();
            cart.items.push(cartItem._id);
            yield cart.save();
        }
        res.status(200).json({ message: 'Item added to cart successfully!', cart });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id;
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const cart = yield cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found.' });
        const cartItem = yield cartItem_model_1.CartItemModel.findById(itemId);
        if (!cartItem)
            return res.status(404).json({ message: 'Item not found in the cart.' });
        yield cartItem.deleteOne({ _id: itemId });
        res.status(200).json({ message: 'Selected items removed successfully!', cart });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.removeFromCart = removeFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const cart = yield cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found.' });
        const cartItem = yield cartItem_model_1.CartItemModel.findOne({ cartId: cart._id, productId: req.params.id });
        if (!cartItem)
            return res.status(404).json({ message: 'Item not found in the cart.' });
        cartItem.quantity = req.body.quantity;
        yield cartItem.save();
        res.status(200).json({ message: 'Cart updated successfully!', cart });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.changeQuantity = changeQuantity;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, auth_middleware_1.default)(req);
        const cart = yield cart_model_1.CartModel.findOne({ userId });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found.' });
        yield cartItem_model_1.CartItemModel.deleteMany({ cartId: cart._id });
        res.status(200).json({ message: 'Cart cleared successfully!', cart });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.clearCart = clearCart;
