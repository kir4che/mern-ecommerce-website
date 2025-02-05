import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { addToCart, changeQuantity, clearCart, getCart, removeFromCart } from "../controllers/cart.controller";

const router = Router();
router.use(authMiddleware); // 確保 authMiddleware 先執行，再執行以下的 route。

router.route("/").get(getCart);
router.route("/").post(addToCart);
router.route("/:id").delete(removeFromCart);
router.route("/:id").patch(changeQuantity);
router.route("/").delete(clearCart);

export { router as cartRouter };
