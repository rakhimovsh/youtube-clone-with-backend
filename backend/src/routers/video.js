import { Router } from "express";
import controller from "../controllers/video.js";
import upload from "../middlewares/multer.js";
import checkToken from "../middlewares/checkToken.js";
const router = Router();

router.get("/video", controller.GET);
router.get("/admin/video", checkToken, controller.GET);
router.post(
  "/admin/video",
  checkToken,
  upload.single("video"),
  controller.POST
);
router.get("/download/:videoName", controller.DOWNLOAD);
router.delete("/admin/video/:videoId", checkToken, controller.DELETE);
export default router;
