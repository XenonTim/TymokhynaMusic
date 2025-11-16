import Track from "../models/track_model.js";

class track_dao {
    async getAllTracks() {
        return await Track.find();
    }

    async getTrackById(id) {
        return await Track.findById(id);
    }

    async createTrack(trackData) {
        const track = new Track(trackData);
        return await track.save();
    }

    async updateTrack(id, trackData) {
        return await Track.findByIdAndUpdate(id, trackData, { new: true });
    }

    async deleteTrack(id) {
        return await Track.findByIdAndDelete(id);
    }

}

export default new track_dao();