import { Router } from "express";

import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { addProduct, deleteProductById, getProductById, getProducts, updateProduct } from "../controllers/product.controller";

const router = Router();

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

router.use(authMiddleware);

router.route("/").post(isAdmin, addProduct);
router.route("/:id").patch(isAdmin, updateProduct);
router.route("/:id").delete(isAdmin, deleteProductById);

export { router as productRouter };
