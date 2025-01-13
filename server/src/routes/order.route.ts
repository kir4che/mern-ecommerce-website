import { Router } from "express";

import { authMiddleware } from "@/middlewares/auth.middleware";
import {
  createOrder,
  getOrderById,
  getOrdersForAdmin,
  getOrders,
  updateOrder,
} from "@/controllers/order.controller";

const router = Router();
router.use(authMiddleware);

router.route("/").get(getOrders);
router.route("/admin").get(getOrdersForAdmin);
router.route("/:id").get(authMiddleware, getOrderById);
router.route("/").post(createOrder);
router.route("/:id").patch(authMiddleware, updateOrder);

export { router as orderRouter };
