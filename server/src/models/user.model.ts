import { Schema, Types, model, Document } from "mongoose";

export const ROLES = ["user", "admin"] as const;

export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "user" },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>("User", userSchema);
