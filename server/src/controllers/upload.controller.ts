import { Request, Response } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image." });

    // 使用 Cloudinary 上傳圖片
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // 自動識別圖片類型
        (err, result) => {
          if (err) return reject(err);
          else if (!result)
            return reject(
              new Error("Upload failed: No response from Cloudinary.")
            );
          else resolve(result); // 上傳成功：使用 resolve 回傳結果
        }
      );

      // 確保圖片資料存在並上傳給 Cloudinary
      if (req.file?.buffer) uploadStream.end(req.file.buffer);
      else reject(new Error("Invalid image data."));
    });

    return res.json({
      success: true,
      message: "Image uploaded successfully!",
      imageUrl: result?.secure_url, // 回傳圖片連結
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error occurred.";
    return res.status(500).json({ success: false, message });
  }
};

export { uploadImage };
