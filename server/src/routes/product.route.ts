import { Router } from "express";

import {
  addProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProduct,
} from "@/controllers/product.controller";

const router = Router();

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);
router.route("/").post(addProduct);
router.route("/:id").patch(updateProduct);
router.route("/:id").delete(deleteProductById);

export { router as productRouter };
