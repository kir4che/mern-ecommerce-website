import { Router } from "express";
import multer from "multer";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { uploadImage } from "../controllers/upload.controller";

// 設定 Multer，解析上傳的圖片並先存在伺服器記憶體中。
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => cb(null, ["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)), // 只接受 png、jpg、jpeg 三種格式
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制檔案大小為 5MB
});

const router = Router();
router.use(authMiddleware);
router.post("/image", isAdmin, upload.single("image"), uploadImage);

export { router as uploadRouter };
