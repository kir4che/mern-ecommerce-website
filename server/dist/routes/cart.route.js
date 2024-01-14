"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
exports.cartRouter = router;
router.route('/').get(cart_controller_1.getCart);
router.route('/').post(cart_controller_1.addToCart);
router.route('/:id').delete(cart_controller_1.removeFromCart);
router.route('/:id').patch(cart_controller_1.changeQuantity);
router.route('/').delete(cart_controller_1.clearCart);
//# sourceMappingURL=cart.route.js.map