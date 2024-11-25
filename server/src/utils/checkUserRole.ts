import { NextFunction, Request, Response } from "express";
import auth from "../middlewares/auth.middleware";

// 檢查使用者權限
const checkUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await auth(req);
  let { role } = req.session.user;
  if (role == "admin") next();
  else
    res
      .status(403)
      .json({ message: "Permission denied. Only admins can add products." });
};

export default checkUserRole;
