import { Router } from "express";

import {
  createCoupon,
  deleteCouponById,
  getCoupons,
  updateCouponById,
  validateCoupon,
} from "../controllers/coupon.controller";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.route("/validate").post(validateCoupon);

router.use(authMiddleware);
router.use(isAdmin);

router.route("/").post(createCoupon).get(getCoupons);
router.route("/:id").patch(updateCouponById).delete(deleteCouponById);

export { router as couponRouter };
