import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { addToCart, changeQuantity, clearCart, getCart, removeFromCart } from "../controllers/cart.controller";

const router = Router();

router.use(authMiddleware);
router.route("/").get(getCart);
router.route("/").post(addToCart);
router.route("/:id").delete(removeFromCart);
router.route("/:id").patch(changeQuantity);
router.route("/").delete(clearCart);

export { router as cartRouter };
