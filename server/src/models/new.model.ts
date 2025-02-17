import { Schema, Types, model, Document } from "mongoose";

export interface INew extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  title: string;
  category: string;
  date: Date;
  content: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const newSchema = new Schema<INew>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

export const NewModel = model<INew>("new", newSchema);
