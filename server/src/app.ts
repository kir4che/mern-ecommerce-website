import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { cartRouter } from "@/routes/cart.route";
import { newRouter } from "@/routes/new.route";
import { productRouter } from "@/routes/product.route";
import { userRouter } from "@/routes/user.route";
import { orderRouter } from "@/routes/order.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// CORS 設定
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://mern-ecommerce-client-seven.vercel.app",
    credentials: true, // 允許發送 Cookie
  }),
);
app.options("*", cors());

app.use(express.json()); // 確保可以解析 JSON 格式的 request body
app.use(cookieParser());
app.use(express.static("public"));

// Session 設定
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false, // 固定寫法
    saveUninitialized: true, // 固定寫法: 是否保存初始化的 session
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      secure: false, // true: 只有 https 才能使用 cookie
    },
  }),
);

// 設定 API 路由
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/news", newRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// 連接 MongoDB
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB."))
  .catch((err) => console.error(err));

  app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
  });

export default app;
