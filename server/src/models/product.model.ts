import { Schema, Types, model } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  tagline: string;
  categories: string[];
  description: string;
  price: number;
  content: string; // 內容物
  expiryDate: string; // 有效期限
  allergens: string[]; // 過敏原
  delivery: string; // 配送
  storage: string; // 保存方式
  ingredients: string; // 成分
  nutrition: string; // 營養成分
  countInStock: number;
  salesCount: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    categories: { type: [String], required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    expiryDate: { type: String, required: true },
    allergens: { type: [String], default: [] },
    delivery: { type: String, default: "常溫宅配" },
    storage: { type: String, default: "請保存於陰涼處，避免高溫或陽光照射。" },
    ingredients: { type: String, default: "" },
    nutrition: { type: String, default: "" },
    countInStock: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = model<IProduct>("Product", productSchema);
