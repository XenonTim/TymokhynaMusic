// track_controller.js
import express from "express";
import track_dao from "../dao/track_dao.js";
import track_service from "../services/track_service.js";
import authMiddleware from "../middlewares/auth_middleware.js";
import adminMiddleware from "../middlewares/admin_middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const tracks = await track_dao.getAllTracks();
        res.json(tracks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const track = await track_dao.getTrackById(req.params.id);
        if (!track) return res.status(404).json({ message: "Track not found" });
        res.json(track);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const track = await track_dao.createTrack(req.body);
        res.status(201).json(track);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const track = await track_dao.updateTrack(req.params.id, req.body);
        if (!track) return res.status(404).json({ message: "Track not found" });
        res.json(track);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const track = await track_dao.deleteTrack(req.params.id);
        if (!track) return res.status(404).json({ message: "Track not found" });
        res.json({ message: "Track deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id/similar", authMiddleware, async (req, res) => {
    try {
        const similarTracks = await track_service.getSimilarTracks(req.params.id);
        res.json(similarTracks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;