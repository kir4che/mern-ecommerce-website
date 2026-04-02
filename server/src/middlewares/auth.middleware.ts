import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "admin")
    return res.status(403).json({ success: false, code: "ADMIN_ACCESS_REQUIRED", message: "你沒有權限執行此操作。" });
  next();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error("JWT_SECRET is not defined in environment variables");

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="app"');
    return res.status(401).json({
      success: false,
      code: "NO_TOKEN",
      message: "尚未登入或登入已過期，請重新登入。",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    req.userId = new Types.ObjectId(decoded.userId);
    req.role = decoded.role;

    next();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TokenExpiredError")
      return res.status(401).json({ success: false, code: "TOKEN_EXPIRED", message: "連線已過期，請重新登入。" });
    
    return res.status(401).json({ success: false, code: "INVALID_TOKEN", message: "無效的身份驗證。" });
  }
};
