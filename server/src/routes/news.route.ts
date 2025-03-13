import { Router } from "express";

import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { addNew, deleteNewById, getNew, getNewById, updateNew } from "../controllers/news.controller";

const router = Router();

router.route("/").get(getNew);
router.route("/:id").get(getNewById);

router.use(authMiddleware);

router.route("/").post(isAdmin, addNew);
router.route("/:id").patch(isAdmin, updateNew);
router.route("/:id").delete(isAdmin, deleteNewById);

export { router as newsRouter };
