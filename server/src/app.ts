import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import { cartRouter } from "./routes/cart.route";
import { newRouter } from "./routes/new.route";
import { productRouter } from "./routes/product.route";
import { userRouter } from "./routes/user.route";
import { orderRouter } from "./routes/order.route";

import { connectDB } from "./config/db";

dotenv.config();
connectDB();

const app = express();

// CORS 設定
app.use(cors({
    origin: process.env.FRONTEND_URL || "https://mern-ecommerce-client-seven.vercel.app",
    credentials: true, // 允許發送 Cookie
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.options("*", cors());

app.use(express.json()); // 確保可以解析 JSON 格式的 request body
app.use(cookieParser());
app.use(express.static("public"));

// Session 設定
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Jc+4DnHUNhPkZQgrWz6f9Uo9XCGGMppKZ0fNFQz/Cks=",
    resave: false, // 固定寫法
    saveUninitialized: true, // 固定寫法: 是否保存初始化的 session
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production", // true: 只有 https 才能使用 cookie
    },
  }),
);

app.get('/', (req, res) => res.send('Express on Vercel.'));

// 設定 API 路由
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/news", newRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

export default app;
