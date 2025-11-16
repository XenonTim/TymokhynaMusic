import express from "express";
import track_controller from "../controllers/track_controller.js";

const router = express.Router();

router.use("/", track_controller);

export default router;
