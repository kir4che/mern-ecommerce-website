import { Request, Response } from "express";
import { Types } from "mongoose";

import { ProductModel } from "../models/product.model";

const getProducts = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};

    // 分類篩選
    if (req.query.category && req.query.category !== 'all')
      filter.categories = req.query.category; 

    // 標籤篩選
    if (req.query.tag)
      filter.tags = req.query.tag; 

    // 關鍵字篩選
    if (req.query.search)
      filter.title = { $regex: req.query.search as string, $options: "i" };

    const total = await ProductModel.countDocuments(filter);

    // 處理分頁
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const pages = Math.ceil(total / limit) || 1; // 避免 total 為 0 時變成 0 頁
    const skip = (page - 1) * limit;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (req.query.sort === "lowest") sortOption = { price: 1 }; // 價格由低到高
    if (req.query.sort === "highest") sortOption = { price: -1 }; // 價格由高到低

    const products = await ProductModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("-createdAt -updatedAt -__v")
      .lean();

    return res.status(200).json({
      success: true,
      products,
      total,
      pages,
      page,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, code: "PRODUCTS_FETCH_FAILED", message });
  }
};

const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const idParam = req.params.id;

    if (!idParam)
      return res.status(400).json({ success: false, code: "PRODUCT_ID_REQUIRED", message: "Product ID is required." });

    // 處理多筆 id
    if (idParam.includes(",")) {
      const ids = idParam
        .split(",")
        .map((id) => id.trim())
        .filter((id) => Types.ObjectId.isValid(id));

      if (ids.length === 0)
        return res.status(400).json({ success: false, code: "INVALID_PRODUCT_IDS", message: "No valid product IDs provided." });

      const products = await ProductModel.find({ _id: { $in: ids } })
        .sort({ createdAt: -1 })
        .select("-createdAt -updatedAt -__v")
        .lean();

      return res.status(200).json({
        success: true,
        products,
      });
    }

    // 單筆查詢
    if (!Types.ObjectId.isValid(idParam))
      return res.status(400).json({ success: false, code: "INVALID_PRODUCT_ID", message: "Invalid product ID format." });

    const product = await ProductModel.findById(idParam)
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!product)
      return res.status(404).json({ success: false, code: "PRODUCT_NOT_FOUND", message: "Product not found." });

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, code: "PRODUCT_FETCH_FAILED", message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({ success: false, code: "PRODUCT_DATA_REQUIRED", message: "Product data is required." });

    const product = new ProductModel(req.body);
    await product.save();

    return res.status(201).json({
      success: true,
      productId: product._id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, code: "PRODUCT_CREATE_FAILED", message });
  }
};

const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, code: "INVALID_PRODUCT_ID", message: "Invalid product ID format." });

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0)
      return res.status(400).json({ success: false, code: "INVALID_PRODUCT_UPDATE_DATA", message: "Invalid update data. Please provide data to update." });

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ success: false, code: "PRODUCT_NOT_FOUND", message: "Product not found." });

    return res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, code: "PRODUCT_UPDATE_FAILED", message });
  }
};

const deleteProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, code: "INVALID_PRODUCT_ID", message: "Invalid product ID format." });

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct)
      return res.status(404).json({ success: false, code: "PRODUCT_NOT_FOUND", message: "Product not found." });

    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, code: "PRODUCT_DELETE_FAILED", message });
  }
};

export {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProduct
};
