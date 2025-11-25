import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { cartRouter } from "./routes/cart.route";
import { newsRouter } from "./routes/news.route";
import { productRouter } from "./routes/product.route";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";
import { paymentRouter } from "./routes/payment.route";

import { connectDB } from "./config/db";

import { v2 as cloudinary } from "cloudinary";

if (process.env.NODE_ENV !== "production") dotenv.config();
connectDB();

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS 設定
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 設定首頁路由，確認後端運作正常。
app.get("/", (_req, res) => res.send("Express on Vercel."));

// 設定 API 路由
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/news", newsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);

export default app;
