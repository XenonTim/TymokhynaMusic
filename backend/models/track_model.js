import mongoose from 'mongoose';

const track_schema = new mongoose.Schema({
    name: { type: String, required: true },
    artists: { type: [String], required: true },
    genre: { type: String, required: true },
    duration: { type: Number, required: true },
    year: { type: Number, required: true }
});

export default mongoose.model('Track', track_schema);