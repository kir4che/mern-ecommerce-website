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
exports.updateProduct = exports.getProducts = exports.getProductById = exports.deleteProductById = exports.addProduct = void 0;
const product_model_1 = require("../models/product.model");
const checkUserRole_1 = __importDefault(require("../utils/checkUserRole"));
const mongoose_1 = __importDefault(require("mongoose"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.ProductModel.find();
        res.status(200).json({ message: 'Products fetched Successfully!', products });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idOrIds = req.params.id;
        if (idOrIds.includes(',')) {
            const objectIds = idOrIds.split(',').map((id) => new mongoose_1.default.Types.ObjectId(id));
            const products = yield product_model_1.ProductModel.find({ _id: { $in: objectIds } });
            return res.status(200).json({ message: 'Products fetched successfully!', products });
        }
        else {
            const product = yield product_model_1.ProductModel.findById(idOrIds);
            return res.status(200).json({ message: 'Product fetched successfully!', product });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getProductById = getProductById;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, checkUserRole_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            const product = new product_model_1.ProductModel(req.body);
            yield product.save();
            res.status(201).json({ message: 'Product added Successfully!' });
        }));
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, checkUserRole_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = req.params.id;
            const product = yield product_model_1.ProductModel.findById(productId);
            if (!product)
                res.status(404).json({ message: 'Product not found!' });
            const updateData = req.body;
            if (!updateData || Object.keys(updateData).length === 0)
                return res.status(400).json({ message: 'Invalid update data. Please provide data to update.' });
            const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
            if (!updatedProduct)
                return res.status(404).json({ message: 'Product not found.' });
            res.status(200).json({ message: 'Product updated Successfully!', product: updatedProduct });
        }));
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, checkUserRole_1.default)(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
            const productId = req.params.id;
            const product = yield product_model_1.ProductModel.findById(productId);
            if (!product)
                res.status(404).json({ message: 'Product not found!' });
            yield product_model_1.ProductModel.deleteOne({ _id: productId });
            res.status(200).json({ message: 'Product deleted Successfully!' });
        }));
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteProductById = deleteProductById;
