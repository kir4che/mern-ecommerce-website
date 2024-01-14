"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
exports.productRouter = router;
router.route('/').get(product_controller_1.getProducts);
router.route('/:id').get(product_controller_1.getProductById);
router.route('/').post(product_controller_1.addProduct);
router.route('/:id').patch(product_controller_1.updateProduct);
router.route('/:id').delete(product_controller_1.deleteProductById);
//# sourceMappingURL=product.route.js.map