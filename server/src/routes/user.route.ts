import { Router } from "express";
import {
  createNewUser,
  getUserData,
  loginUser,
  logoutUser,
} from "../controllers/user.controller";

const router = Router();

router.route("/").get(getUserData);
router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export { router as userRouter };
