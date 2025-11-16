import playlist_dao from "../dao/playlist_dao.js";

class playlist_service {
    async getTotalDuration(playlistId) {
        const playlist = await playlist_dao.getById(playlistId);
        if (!playlist || !playlist.tracks) return 0;

        return playlist.tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
    }
}

export default new playlist_service();
