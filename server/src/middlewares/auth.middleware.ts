import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import jwt, { Secret } from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token; // 從 cookie 中讀取 token

    if (!token) {
      throw new Error("Unauthorized!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as {
      userId: Types.ObjectId;
    };
    req.userId = decoded.userId; // 將 userId 附加到 req 物件上
    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid JWT token." });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    } else return res.status(401).json({ message: "Unauthorized access!" });
  }
};
