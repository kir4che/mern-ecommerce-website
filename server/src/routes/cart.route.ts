import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { addToCart, changeQuantity, clearCart, getCart, removeFromCart, syncLocalCart } from "../controllers/cart.controller";

const router = Router();

router.use(authMiddleware);

router.route("/").get(getCart);
router.route("/").post(addToCart);
router.route("/:id").delete(removeFromCart);
router.route("/:id").patch(changeQuantity);
router.route("/").delete(clearCart);
router.route("/sync").post(syncLocalCart);

export { router as cartRouter };
