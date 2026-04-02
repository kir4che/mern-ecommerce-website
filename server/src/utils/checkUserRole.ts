import { NextFunction, Request, Response } from "express";

interface SessionUser {
  role?: string;
  [key: string]: any;
}

interface SessionRequest extends Request {
  session?: {
    user?: SessionUser;
    [key: string]: any;
  };
}

// 檢查使用者權限
const checkUserRole = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.session?.user;
  if (!user)
    return res.status(401).json({ success: false, code: "UNAUTHORIZED", message: "Unauthorized. Please log in." });

  const role = user.role;
  if (role === "admin") return next();

  return res
    .status(403)
    .json({ success: false, code: "ADMIN_ROLE_REQUIRED", message: "Permission denied. Only admins can add products." });
};

export default checkUserRole;
