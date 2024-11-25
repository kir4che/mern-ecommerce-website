import { Router } from "express";
import {
  addToCart,
  changeQuantity,
  clearCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller";

const router = Router();

router.route("/").get(getCart);
router.route("/").post(addToCart);
router.route("/:id").delete(removeFromCart);
router.route("/:id").patch(changeQuantity);
router.route("/").delete(clearCart);

export { router as cartRouter };
