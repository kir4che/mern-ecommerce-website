import { rateLimit } from "express-rate-limit";

// 一般 API 每 15 分鐘最多 150 次請求
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 150,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.path === "/api/payment/callback",
  message: {
    success: false,
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests. Please try again later.",
  },
});

// 驗證類（登入、註冊、忘記密碼）每 15 分鐘最多 10 次
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests. Please try again later.",
  },
});

// 優惠券驗證每 15 分鐘最多 20 次
export const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    valid: false,
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests. Please try again later.",
  },
});
