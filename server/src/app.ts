import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { cartRouter } from "./routes/cart.route";
import { couponRouter } from "./routes/coupon.route";
import { newsRouter } from "./routes/news.route";
import { orderRouter } from "./routes/order.route";
import { paymentRouter } from "./routes/payment.route";
import { productRouter } from "./routes/product.route";
import { userRouter } from "./routes/user.route";

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

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 允許帶 cookie
};

app.use(cors(corsOptions));
// 允許匹配所有路由的 OPTIONS 請求
app.options("/{*splat}", cors(corsOptions));
app.use(express.json());
// 解析 URL-encoded 請求內容
app.use(express.urlencoded({ extended: true }));

// 首頁路由，測試伺服器是否正常。
app.get("/", (_req, res) => res.send("Express on Vercel."));

// 設定 API 路由
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/news", newsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/coupons", couponRouter);

import { errorHandler } from "./middlewares/error.middleware";
app.use(errorHandler);

export default app;
