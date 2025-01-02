import { Schema, Types, model } from "mongoose";

export interface INew extends Document {
  _id: Types.ObjectId;
  title: string;
  category: string;
  date: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const newSchema = new Schema<INew>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export const NewModel = model<INew>("new", newSchema);
