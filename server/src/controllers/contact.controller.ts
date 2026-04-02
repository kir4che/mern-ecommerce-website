import { Request, Response } from "express";
import nodemailer from "nodemailer";

const sendContact = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  try {
    if (!name || !email || !subject || !message)
      return res.status(400).json({
        success: false,
        code: "MISSING_FIELDS",
        message: "請填寫所有必填欄位",
      });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EMAIL",
        message: "請提供有效的 Email 格式",
      });
    }

    // 設置郵件傳輸器
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `網站聯絡表單：${subject}`,
      html: `
        <h3>來自網站聯絡表單的訊息</h3>
        <p><strong>姓名：</strong> ${name}</p>
        <p><strong>Email：</strong> ${email}</p>
        <p><strong>主旨：</strong> ${subject}</p>
        <p><strong>訊息：</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    };

    // 發送郵件
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "訊息已成功發送，我們會盡快回覆您。",
    });
  } catch {
    res.status(500).json({
      success: false,
      code: "CONTACT_SEND_FAILED",
      message: "發送訊息失敗，請稍後再試",
    });
  }
};

export { sendContact };
