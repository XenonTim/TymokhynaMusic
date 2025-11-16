// playlist_controller.js
import express from "express";
import playlist_dao from "../dao/playlist_dao.js";
import playlist_service from "../services/playlist_service.js";
import authMiddleware from "../middlewares/auth_middleware.js";
import adminMiddleware from "../middlewares/admin_middleware.js";
import mongoose from "mongoose";

const router = express.Router();

const checkOwnershipOrAdmin = async (req, res, next) => {
    try {
        const playlist = await playlist_dao.getById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        if (req.user.role !== 'admin' && playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Доступ заборонено: Ви не є власником цього плейлиста." });
        }

        req.playlist = playlist;
        next();
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        res.status(500).json({ message: "Помилка сервера під час перевірки доступу." });
    }
};

router.get("/", async (req, res) => {
    try {
        const playlists = await playlist_dao.getAll();
        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const playlist = await playlist_dao.getById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        res.json(playlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id/total-duration", async (req, res) => {
    try {
        const total = await playlist_service.getTotalDuration(req.params.id);
        res.json({ total_duration: total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        // Додаємо ID власника з JWT до даних плейлиста
        const playlistData = { ...req.body, owner: req.user.id };
        const playlist = await playlist_dao.create(playlistData);
        res.status(201).json(playlist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/:id", authMiddleware, checkOwnershipOrAdmin, async (req, res) => {
    try {
        const playlist = await playlist_dao.update(req.params.id, req.body);
        res.json(playlist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", authMiddleware, checkOwnershipOrAdmin, async (req, res) => {
    try {
        await playlist_dao.delete(req.params.id);
        res.json({ message: "Playlist deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;