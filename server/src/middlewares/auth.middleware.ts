import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
  role?: string;
}

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId || req.role !== "admin")
    return res.status(403).json({
      success: false,
      code: "FORBIDDEN",
      message: "沒有權限執行此操作，請使用管理者帳號登入。",
    });
  next();
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token; // 從 cookie 中讀取 token
    if (!token) {
      res.setHeader("WWW-Authenticate", 'Bearer realm="app"');
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "尚未登入或登入已過期，請重新登入。",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as {
      userId: Types.ObjectId;
      role: string;
    };
    req.userId = decoded.userId; // 將 userId 附加到 req 物件上
    req.role = decoded.role;

    next();
  } catch (err: any) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    } catch {}

    if (err?.name === "TokenExpiredError") {
      res.setHeader(
        "WWW-Authenticate",
        'Bearer error="invalid_token", error_description="token expired"'
      );
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "登入已過期，請重新登入。",
      });
    }

    if (err?.name === "JsonWebTokenError") {
      res.setHeader("WWW-Authenticate", 'Bearer error="invalid_token"');
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "身分驗證失敗，請重新登入。",
      });
    }

    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "身分驗證發生問題，請重新登入。",
    });
  }
};
