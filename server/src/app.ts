import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import { cartRouter } from "./routes/cart.route";
import { newsRouter } from "./routes/news.route";
import { productRouter } from "./routes/product.route";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";
import { paymentRouter } from "./routes/payment.route";

import { connectDB } from "./config/db";

import { v2 as cloudinary } from "cloudinary";

dotenv.config();
connectDB();

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS 設定
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // 允許發送 Cookie
  })
);
app.options("*", cors());
app.use(express.json()); // 解析 JSON 格式的 request body
app.use(express.urlencoded({ extended: true })); // 解析 URL-encoded 請求
app.use(cookieParser()); // 解析 cookie

// Session 設定
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "Jc+4DnHUNhPkZQgrWz6f9Uo9XCGGMppKZ0fNFQz/Cks=",
    resave: false, // 固定寫法
    saveUninitialized: true, // 固定寫法: 是否保存初始化的 session
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 days
      secure: process.env.NODE_ENV === "production", // true: 只有 https 才能使用 cookie
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // true: 允許跨域請求攜帶 cookie
    },
  })
);

// 設定首頁路由，確認後端運作正常。
app.get("/", (req, res) => res.send("Express on Vercel."));

// 設定 API 路由
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/news", newsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

export default app;
