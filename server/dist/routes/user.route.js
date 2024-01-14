"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.route('/').get(user_controller_1.getUserData);
router.route('/register').post(user_controller_1.createNewUser);
router.route('/login').post(user_controller_1.loginUser);
router.route('/logout').post(user_controller_1.logoutUser);
//# sourceMappingURL=user.route.js.map