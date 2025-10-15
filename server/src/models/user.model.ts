import { Schema, Types, model, Document } from "mongoose";

export const ROLES = ["user", "admin"] as const;

export interface IUser extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "user" },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
