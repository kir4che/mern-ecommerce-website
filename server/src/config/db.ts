import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    logger.info("Connected to MongoDB.");
  } catch (err: unknown) {
    logger.error("MongoDB connection err:", err);
  }
};
