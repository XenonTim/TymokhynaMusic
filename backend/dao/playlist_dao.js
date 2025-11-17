import Playlist from "../models/playlist_model.js";

class playlist_dao {
    async getAll() {
        return Playlist.find().populate("tracks owner", "-passwordHash");
    }

    async getById(id) {
        return Playlist.findById(id).populate("tracks owner", "-passwordHash");
    }

    async getByOwner(ownerId) {
        return Playlist.find({ owner: ownerId }).populate([
            { path: "tracks" },
            { path: "owner", select: "-passwordHash" }
        ]);
    }

    async create(data) {
        return Playlist.create(data);
    }

    async update(id, data) {
        return Playlist.findByIdAndUpdate(id, data, { new: true }).populate("tracks owner", "-passwordHash");
    }

    async delete(id) {
        return Playlist.findByIdAndDelete(id);
    }

    async addTrack(playlistId, trackId) {
        return Playlist.findByIdAndUpdate(
            playlistId,
            { $push: { tracks: trackId } },
            { new: true }
        ).populate([
            { path: "tracks" },
            { path: "owner", select: "-passwordHash" }
        ]);
    }

    async removeTrack(playlistId, trackId) {
        return Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { tracks: trackId } },
            { new: true }
        ).populate([
            { path: "tracks" },
            { path: "owner", select: "-passwordHash" }
        ]);
    }
}

export default new playlist_dao();
