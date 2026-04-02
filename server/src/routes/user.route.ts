import { Router } from "express";

import {
  createNewUser,
  getUserData,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  updatePassword,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/reset-password").post(resetPassword); 
router.route("/reset-password/:token").post(updatePassword);

router.use(authMiddleware);

router.route("/").get(getUserData);
router.route("/logout").post(logoutUser);

export { router as userRouter };
