import { Request, Response } from "express";
import { Types } from "mongoose";
import crypto from "crypto";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import { CartModel } from "../models/cart.model";
import { UserModel } from "../models/user.model";

interface AuthRequest extends Request {
  userId?: Types.ObjectId;
}

const getUserData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "User ID not found in request." });

    const user = await UserModel.findById(userId).select(
      "email role createdAt",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    res.status(200).json({
      success: true,
      message: "User fetched Successfully!",
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TokenExpiredError")
      return res
        .status(401)
        .json({ success: false, message: "Token has expired." });
    else
      return res.status(401).json({ success: false, message: "Unauthorized!" });
  }
};

const createNewUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 先確認該 email 是否已經被註冊過
    const isNewUser = await UserModel.findOne({ email });
    if (isNewUser)
      return res
        .status(400)
        .json({ success: false, message: "User already Exists!" });

    // 將 password 進行 hash
    const hashedPassword = await argon2.hash(password);
    // 建立新的 user
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    const newCart = new CartModel({ userId: newUser._id, items: [] });
    await newCart.save();

    res
      .status(201)
      .json({ success: true, message: "User registered Successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  try {
    // 確認該 email 是否已經被註冊過
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist!" });

    // 確認 password 是否正確
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password!" });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: rememberMe ? "7d" : "1d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role as "user" | "admin",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (userId)
      await UserModel.findByIdAndUpdate(userId, { refreshToken: null });

    res
      .status(200)
      .json({ success: true, message: "User logged out Successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email not found!" });

    // 生成一次性 Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 小時有效期
    await user.save();

    // 發送重設密碼的 Email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // SMTP 服務
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"日出麵包坊": ${process.env.GMAIL_USER}`,
      to: email,
      subject: "重設密碼通知信",
      html: `
        <p>您好，</p>
        <p>請點擊下方連結以重設您的密碼：</p>
        <a href="${resetUrl}" target="_blank" style="color: #007bff; text-decoration: none;">重設密碼</a>
        <p>此連結將在 1 小時內失效，<br/>如果未有忘記密碼的需求，請忽略此郵件。</p>
        <br/>
        <br/>
        <p>日出麵包坊 🍞</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  const { resetToken, password } = req.body;

  try {
    const user = await UserModel.findOne({
      resetToken,
      resetTokenExpiration: { $gt: new Date() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token!" });

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "Refresh token is required!" });

  try {
    // 驗證 Refresh Token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { userId: Types.ObjectId };

    // 檢查資料庫中的 Refresh Token 是否匹配
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken)
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token!" });

    // 生成新的 Access Token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully!",
      accessToken,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TokenExpiredError")
      return res
        .status(403)
        .json({ success: false, message: "Refresh token has expired!" });

    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ success: false, message });
  }
};

export {
  createNewUser,
  getUserData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  updatePassword,
};
