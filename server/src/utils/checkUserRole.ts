import { NextFunction, Request, Response } from "express";

// 檢查使用者權限
const checkUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.session?.user;
  if (!user)
    return res.status(401).json({ message: "Unauthorized. Please log in." });

  const role = (user as { role?: string }).role;
  if (role === "admin") return next();

  return res
    .status(403)
    .json({ message: "Permission denied. Only admins can add products." });
};

export default checkUserRole;
