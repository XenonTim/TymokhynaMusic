import track_dao from "../dao/track_dao.js";

class track_service {
    async getSimilarTracks(trackId) {
        const track = await track_dao.getTrackById(trackId);
        if (!track) return [];

        const allTracks = await track_dao.getAllTracks();

        return allTracks.filter(
            t =>
                t._id.toString() !== track._id.toString() &&
                (t.genre === track.genre || t.artists.some(a => track.artists.includes(a)))
        );
    }
}

export default new track_service();
