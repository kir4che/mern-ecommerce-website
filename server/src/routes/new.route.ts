import { Router } from "express";

import { addNew, deleteNewById, getNew, getNewById, updateNew } from "../controllers/news.controller";

const router = Router();

router.route("/").get(getNew);
router.route("/:id").get(getNewById);
router.route("/").post(addNew);
router.route("/:id").patch(updateNew);
router.route("/:id").delete(deleteNewById);

export { router as newRouter };
