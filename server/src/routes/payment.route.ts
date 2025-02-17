import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { createPaymentHandler, handlePaymentCallback } from "../controllers/payment.controller";

const router = Router();

router.post("/callback", handlePaymentCallback); // 付款後更新訂單狀態

router.use(authMiddleware);
router.post("/", createPaymentHandler);

export { router as paymentRouter };
