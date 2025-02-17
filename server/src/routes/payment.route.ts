import { Router } from "express";

import { createPaymentHandler, handlePaymentCallback } from "../controllers/payment.controller";

const router = Router();

router.post("/", createPaymentHandler);
router.post("/callback", handlePaymentCallback); // 付款後更新訂單狀態

export { router as paymentRouter };
