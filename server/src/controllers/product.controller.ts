import { Request, Response } from "express";
import mongoose from "mongoose";

import { ProductModel } from "../models/product.model";

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Products fetched Successfully!", products });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const idOrIds = req.params.id;

    if (idOrIds.includes(",")) {
      const objectIds = idOrIds
        .split(",")
        .map((id: string) => new mongoose.Types.ObjectId(id));
      const products = await ProductModel.find({ _id: { $in: objectIds } });
      return res.status(200).json({ success: true, message: "Products fetched successfully!", products });
    } else {
      const product = await ProductModel.findById(idOrIds);
      return res.status(200).json({ success: true, message: "Product fetched successfully!", product });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({ success: true, message: "Product added Successfully!" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await ProductModel.findById(productId);
    if (!product) res.status(404).json({ success: false, message: "Product not found!" });

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0)
      return res.status(400).json({ success: false, message: "Invalid update data. Please provide data to update." });

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true },
    );
    if (!updatedProduct)
      return res.status(404).json({ success: false, message: "Product not found." });

    res.status(200).json({
      message: "Product updated Successfully!",
      product: updatedProduct,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await ProductModel.findById(productId);
    if (!product) res.status(404).json({ success: false, message: "Product not found!" });

    await ProductModel.deleteOne({ _id: productId });
    res.status(200).json({ success: true, message: "Product deleted Successfully!" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { addProduct, deleteProductById, getProductById, getProducts, updateProduct };
