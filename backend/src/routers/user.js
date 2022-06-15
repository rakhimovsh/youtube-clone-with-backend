import { Router } from "express";
import controller from "../controllers/user.js";
import validation from "../middlewares/validation.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.post("/login", validation, controller.LOGIN);
router.post(
  "/register",
  upload.single("file"),
  validation,
  controller.REGISTER
);
router.get("/users", controller.GET);
router.get("/users/:userId", controller.GET);

export default router;
