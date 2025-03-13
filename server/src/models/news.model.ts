import { Schema, Types, model } from "mongoose";

export interface INews extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  category: string;
  date: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const NewsModel = model<INews>("news", newsSchema);
