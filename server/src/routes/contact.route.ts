import { Router } from "express";

import { sendContact } from "../controllers/contact.controller";

const router = Router();

router.route("/").post(sendContact);

export { router as contactRouter };
