import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB.");
  } catch (err: any) {
    console.error("MongoDB connection err:", err);
  }
};
