import mongoose from 'mongoose';

const playlist_schema = new mongoose.Schema({
    name: { type: String, required: true },
    tracks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Track"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creation_date: { type: Date, default: Date.now }
});

playlist_schema.virtual("total_duration").get(function () {
    if (!this.tracks) return 0;
    return this.tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
});

playlist_schema.set("toJSON", { virtuals: true });

export default mongoose.model('Playlist', playlist_schema);