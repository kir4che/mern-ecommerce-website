import { Request, Response } from "express";
import { Types } from "mongoose";

import { CartModel } from "../models/cart.model";
import { CartItemModel, ICartItem } from "../models/cartItem.model";
import { ProductModel } from "../models/product.model";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

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
      return res.status(200).json({ message: "New cart created successfully!", cart: [] });
    }

    // 透過 Promise.all() 方法，將所有的購物車項目進行填入。
    const populatedItems = await Promise.all(
      cart.items.map(async (item: ICartItem) => {
        const product = await ProductModel.findById(item.productId);

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
      }),
    );

    res.status(200).json({ message: "Cart fetched successfully!", cart: populatedItems });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ success: false, message: "Please provide all fields." });

  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    // 檢查購物車中是否已經存在相同產品
    const existingCartItem = await CartItemModel.findOne({
      cartId: cart._id,
      productId,
    });

    if (existingCartItem) {
      // 更新數量
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // 如果不存在，創建新的購物車項目
      const cartItem = new CartItemModel({
        cartId: cart._id,
        productId,
        quantity,
      });
      await cartItem.save();
      cart.items.push(cartItem._id);
      await cart.save();
    }

    res.status(200).json({ success: true, message: "Item added to cart successfully!", cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromCart = async (req: AuthRequest, res: Response) => {
  const itemId = req.params.id;

  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    const cartItem = await CartItemModel.findById(itemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found in the cart." });

    await cartItem.deleteOne({ _id: itemId });
    res.status(200).json({ message: "Selected items removed successfully!", cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changeQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    const cartItem = await CartItemModel.findById(req.params.id);
    if (!cartItem)
      return res.status(404).json({ success: false, message: "Item not found in the cart." });

    cartItem.quantity = req.body.quantity;
    await cartItem.save();

    res.status(200).json({ success: true, message: "Cart updated successfully!", cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found." });

    await CartItemModel.deleteMany({ cartId: cart._id });
    res.status(200).json({ success: true, message: "Cart cleared successfully!", cart });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const syncLocalCart = async (req: AuthRequest, res: Response) => {
  const { localCart } = req.body;
  if (!Array.isArray(localCart)) {
    return res.status(400).json({ success: false, message: "Invalid local cart data." });
  }

  try {
    const userId = req.userId;
    let cart = await CartModel.findOne({ userId });
    
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
      await cart.save();
    }

    // Process each local cart item
    for (const item of localCart) {
      const { productId, quantity } = item;
      
      // Verify product exists and check stock
      const product = await ProductModel.findById(productId);
      if (!product) continue;

      // Find existing cart item
      const existingCartItem = await CartItemModel.findOne({
        cartId: cart._id,
        productId,
      });

      if (existingCartItem) {
        // Calculate new quantity (sum of local and backend), respecting stock limit
        const newQuantity = Math.min(existingCartItem.quantity + quantity, product.countInStock);
        existingCartItem.quantity = newQuantity;
        await existingCartItem.save();
      } else {
        // Create new cart item with quantity limited by stock
        const newQuantity = Math.min(quantity, product.countInStock);
        const cartItem = new CartItemModel({
          cartId: cart._id,
          productId,
          quantity: newQuantity,
        });
        await cartItem.save();
        cart.items.push(cartItem._id);
      }
    }

    await cart.save();

    // Return updated cart with product details
    const updatedCart = await CartModel.findOne({ userId }).populate<{
      items: ICartItem[];
    }>("items");

    const populatedItems = await Promise.all(
      updatedCart!.items.map(async (item: ICartItem) => {
        const product = await ProductModel.findById(item.productId);
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
      }),
    );

    res.status(200).json({
      success: true,
      message: "Local cart synchronized successfully!",
      cart: populatedItems,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { addToCart, getCart, removeFromCart, changeQuantity, clearCart, syncLocalCart };
