import express from "express";
import playlist_controller from "../controllers/playlist_controller.js";

const router = express.Router();

router.use("/", playlist_controller);

export default router;
