import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getUserData,
  createNewUser,
  loginUser,
  logoutUser,
  resetPassword,
  updatePassword,
} from "../controllers/user.controller";

const router = Router();

router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.use(authMiddleware);

router.route("/").get(getUserData);
router.route("/reset-password").post(resetPassword);
router.route("/update-password").post(updatePassword);

export { router as userRouter };
