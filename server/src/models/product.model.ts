import { Schema, Types, model, Document } from "mongoose";

const VALID_TAGS = ["推薦", "熱銷", "新品", "特價"] as const;
type Tag = typeof VALID_TAGS[number];

export interface IProduct extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  tagline: string;
  categories: string[];
  description: string;
  price: number;
  content: string; // 內容物
  expiryDate: Date; // 有效期限
  allergens: string[]; // 過敏原
  delivery: string; // 配送
  storage: string; // 保存方式
  ingredients: string; // 成分
  nutrition: string; // 營養成分
  countInStock: number;
  salesCount: number; // 銷量
  tags: Tag[]; // 標籤
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    categories: { type: [String], required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    content: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    allergens: { type: [String], default: [] },
    delivery: { type: String, default: "常溫宅配" },
    storage: { type: String, default: "請保存於陰涼處，避免高溫或陽光照射。" },
    ingredients: { type: String, default: "" },
    nutrition: { type: String, default: "" },
    countInStock: { type: Number, default: 0, min: 0 },
    salesCount: { type: Number, default: 0, min: 0 },
    tags: {
      type: [String],
      enum: VALID_TAGS, // 只允許 VALID_TAGS 中的值
      default: [],
    },
    imageUrl: { type: String, required: true },  },
  {
    timestamps: true,
  },
);

productSchema.index({ categories: 1 });
productSchema.index({ tags: 1 });

export const ProductModel = model<IProduct>("Product", productSchema);
