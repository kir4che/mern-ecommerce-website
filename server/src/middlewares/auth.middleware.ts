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
    return res.status(403).json({ success: false, message: "Access denied!" });
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
    if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid JWT token." });
    } else if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired." });
    } else
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request." });
  }
};
