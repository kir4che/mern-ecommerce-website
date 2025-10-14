import { Request, Response } from "express";
import { Types } from "mongoose";

import { ProductModel } from "../models/product.model";

const getProducts = async (req: Request, res: Response) => {
  try {
    const total = await ProductModel.countDocuments();

    const pipeline: any[] = [
      { $sort: { createdAt: -1 } },
      { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    ];

    let page = 1;
    let pages = 1;

    if (req.query.limit) {
      const limit = Number(req.query.limit);
      page = Number(req.query.page) || 1;
      pages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      pipeline.splice(1, 0, { $skip: skip }, { $limit: limit });
    }

    const products = await ProductModel.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      products,
      total,
      pages,
      page,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const idOrIds = req.params.id;

    if (!idOrIds)
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });

    // 多商品查詢
    if (idOrIds.includes(",")) {
      const ids = idOrIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => Types.ObjectId.isValid(id));

      if (ids.length === 0)
        return res.status(400).json({
          success: false,
          message: "No valid product IDs provided.",
        });

      const products = await ProductModel.aggregate([
        { $match: { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } } },
        { $sort: { createdAt: -1 } },
        { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
      ]);

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully!",
        products,
      });
    }

    if (!Types.ObjectId.isValid(idOrIds))
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });

    // 單筆查詢
    const products = await ProductModel.aggregate([
      { $match: { _id: new Types.ObjectId(idOrIds) } },
      { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    ]);

    if (!products.length)
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      product: products[0],
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({
        success: false,
        message: "Product data is required.",
      });

    const product = new ProductModel(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      productId: product._id,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId))
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0)
      return res.status(400).json({
        success: false,
        message: "Invalid update data. Please provide data to update.",
      });

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: updateData }, // 確保只更新特定欄位
      { new: true, runValidators: true } // 回傳更新後的資料
    );

    if (!updatedProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, message });
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!Types.ObjectId.isValid(productId))
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

export {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProduct,
};
