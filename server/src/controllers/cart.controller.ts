import { Request, Response } from "express";
import { Types } from "mongoose";

import { CartModel } from "../models/cart.model";
import { CartItemModel, ICartItem } from "../models/cartItem.model";
import { ProductModel } from "../models/product.model";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

const populateCartItemsWithProducts = async (items: ICartItem[]) => {
  if (!items.length) return [];

  const productIds = [...new Set(items.map(item => item.productId.toString()))];
  const products = await ProductModel.find(
    { _id: { $in: productIds } },
    "title price imageUrl countInStock"
  );
  const productMap = new Map(products.map(p => [p._id.toString(), p]));

  return items.map((item: ICartItem) => {
    const product = productMap.get(item.productId.toString());
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
  });
};

const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    // populate() 方法會將指定的欄位填入資料，也就是會將 cart.items 中的所有資料填入。
    const cart = await CartModel.findOne({ userId }).populate<{
      items: ICartItem[];
    }>("items");

    // 如果沒有找到購物車，重新爲該使用者創建一個新的購物車。
    if (!cart) {
      const newCart = new CartModel({ userId, items: [] });
      await newCart.save();
      return res
        .status(200)
        .json({ message: "New cart created successfully!", cart: [] });
    }

    const populatedItems = await populateCartItemsWithProducts(cart.items);

    res
      .status(200)
      .json({ message: "Cart fetched successfully!", cart: populatedItems });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "INTERNAL_SERVER_ERROR", message });
  }
};

const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  
  if (!productId || quantity === undefined || quantity === null)
    return res.status(400).json({ success: false, code: "CART_ITEM_FIELDS_REQUIRED", message: "Please provide all fields." });

  if (typeof quantity !== "number" || quantity < 1 || !Number.isInteger(quantity))
    return res.status(400).json({ success: false, code: "INVALID_QUANTITY", message: "Quantity must be a positive integer." });

  try {
    const userId = req.userId;
    
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
      await cart.save();
    }

    const product = await ProductModel.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, code: "PRODUCT_NOT_FOUND", message: "Product not found." });

    // 檢查購物車中是否已經存在相同商品的項目
    let existingCartItem = await CartItemModel.findOne({
      cartId: cart._id,
      productId,
    });

    if (existingCartItem) {
      // 更新數量
      existingCartItem.quantity = Math.min(
        existingCartItem.quantity + quantity,
        product.countInStock
      );
      await existingCartItem.save();
    } else {
      try {
        const newQuantity = Math.min(quantity, product.countInStock);
        const cartItem = new CartItemModel({
          cartId: cart._id,
          productId,
          quantity: newQuantity,
        });
        await cartItem.save();
        cart.items.push(cartItem._id);
        await cart.save();
      } catch (insertError: any) {
        if (insertError.code === 11000) {
          existingCartItem = await CartItemModel.findOne({ cartId: cart._id, productId });
          if (existingCartItem) {
            existingCartItem.quantity = Math.min(
              existingCartItem.quantity + quantity,
              product.countInStock
            );
            await existingCartItem.save();
          }
        } else {
          throw insertError;
        }
      }
    }

    const updatedCart = await CartModel.findOne({ userId }).populate<{ items: ICartItem[] }>("items");
    if (!updatedCart) return res.status(404).json({ success: false, code: "CART_NOT_FOUND", message: "Cart not found after update." });

    const populatedItems = await populateCartItemsWithProducts(updatedCart.items);

    res.status(200).json({ success: true, cart: populatedItems });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "ADD_TO_CART_FAILED", message });
  }
};

const syncLocalCart = async (req: AuthRequest, res: Response) => {
  const { localCart } = req.body;
  if (!Array.isArray(localCart))
    return res.status(400).json({ success: false, code: "INVALID_LOCAL_CART_DATA", message: "Invalid local cart data." });

  try {
    const userId = req.userId;
    
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
      await cart.save();
    }

    // 批次拉取所有商品資訊
    const productIds = [...new Set(localCart.map(item => item.productId))];
    const products = await ProductModel.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const newCartItemIds: Types.ObjectId[] = [];

    await Promise.all(localCart.map(async (item) => {
      const { productId, quantity } = item;
      const product = productMap.get(productId.toString());
      if (!product) return;

      const existingCartItem = await CartItemModel.findOne({
        cartId: cart._id,
        productId,
      });

      // 若購物車已有，就更新數量（但不超過庫存）；沒有就新增一筆。
      if (existingCartItem) {
        existingCartItem.quantity = Math.min(
          existingCartItem.quantity + quantity,
          product.countInStock
        );
        await existingCartItem.save();
      } else {
        const newQuantity = Math.min(quantity, product.countInStock);
        const cartItem = new CartItemModel({
          cartId: cart._id,
          productId,
          quantity: newQuantity,
        });
        await cartItem.save();
        newCartItemIds.push(cartItem._id);
      }
    }));

    if (newCartItemIds.length > 0) {
      cart.items.push(...newCartItemIds);
      await cart.save();
    }

    const updatedCart = await CartModel.findOne({ userId }).populate<{ items: ICartItem[] }>("items");
    if (!updatedCart)
      return res.status(404).json({ success: false, code: "CART_NOT_FOUND", message: "Cart not found after sync." });

    const populatedItems = await populateCartItemsWithProducts(updatedCart.items);

    res.status(200).json({ success: true, cart: populatedItems });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "SYNC_CART_FAILED", message });
  }
};

const removeFromCart = async (req: AuthRequest, res: Response) => {
  const itemId = req.params.id;

  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, code: "CART_NOT_FOUND", message: "Cart not found." });

    const cartItem = await CartItemModel.findOneAndDelete({
      _id: itemId,
      cartId: cart._id,
    });
    if (!cartItem)
      return res.status(404).json({ success: false, code: "CART_ITEM_NOT_FOUND", message: "Item not found in your cart." });

    await CartModel.updateOne(
      { _id: cart._id },
      { $pull: { items: cartItem._id } }
    );

    res.status(200).json({ success: true, message: "Selected item removed successfully!" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "REMOVE_FROM_CART_FAILED", message });
  }
};

const changeQuantity = async (req: AuthRequest, res: Response) => {
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { quantity } = req.body;

  if (!Types.ObjectId.isValid(itemId))
    return res.status(400).json({
      success: false,
      code: "INVALID_CART_ITEM_ID",
      message: "Invalid cart item ID.",
    });

  if (typeof quantity !== "number" || quantity < 1 || !Number.isInteger(quantity))
    return res.status(400).json({
      success: false,
      code: "INVALID_QUANTITY",
      message: "Quantity must be a positive integer.",
    });

  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart)
      return res.status(404).json({ success: false, code: "CART_NOT_FOUND", message: "Cart not found." });

    const cartItem = await CartItemModel.findOne({ _id: itemId, cartId: cart._id });
    if (!cartItem)
      return res.status(404).json({ success: false, code: "CART_ITEM_NOT_FOUND", message: "Item not found in your cart." });

    const product = await ProductModel.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({ success: false, code: "PRODUCT_NOT_FOUND", message: "Product not found." });
    }

    const stock = Number(product.countInStock ?? 0);
    if (!Number.isFinite(stock) || stock < 1)
      return res.status(400).json({
        success: false,
        code: "PRODUCT_OUT_OF_STOCK",
        message: "Product is out of stock.",
      });

    cartItem.quantity = Math.min(quantity, stock);
    await cartItem.save();

    const updatedCart = await CartModel.findOne({ userId }).populate<{
      items: ICartItem[];
    }>("items");

    if (!updatedCart)
      return res.status(404).json({
        success: false,
        code: "CART_NOT_FOUND",
        message: "Cart not found after update.",
      });

    const populatedItems = await populateCartItemsWithProducts(updatedCart.items);

    res.status(200).json({
      success: true,
      message: "Cart updated successfully!",
      cart: populatedItems,
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, code: "UPDATE_CART_ITEM_QUANTITY_FAILED", message: err instanceof Error ? err.message : "Unexpected error occurred." });
  }
};

const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, code: "CART_NOT_FOUND", message: "Cart not found." });

    await CartItemModel.deleteMany({ cartId: cart._id });
    cart.items = [];
    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully!", cart });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, code: "CLEAR_CART_FAILED", message });
  }
};

export {
  addToCart, changeQuantity,
  clearCart, getCart,
  removeFromCart, syncLocalCart
};

