import { Router } from "express";

import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { createOrder, getOrderById, getOrders, getOrdersByUser, updateOrder } from "../controllers/order.controller";

const router = Router();
router.use(authMiddleware);

router.route("/").get(getOrdersByUser);
router.route("/all").get(isAdmin, getOrders);
router.route("/:id").get(getOrderById);
router.route("/").post(createOrder);
router.route("/:id").patch(updateOrder);

export { router as orderRouter };
