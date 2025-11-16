import Playlist from "../models/playlist_model.js";

class playlist_dao {
    async getAll() {
        return Playlist.find().populate("tracks owner", "-passwordHash");
    }

    async getById(id) {
        return Playlist.findById(id).populate("tracks owner", "-passwordHash");
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
}

export default new playlist_dao();
