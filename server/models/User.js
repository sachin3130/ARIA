const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define Track schema
const TrackSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    info: { type: String, required: true }
});
const Track = model('track', TrackSchema);

// Define User schema
const UserSchema = new Schema({
    userid: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String},
    image: { type: String },
    favourite: {
        items: [{ type: String }]
    },
    explore: {
        items: [{ type: String }]
    },
    search: {
        items: [{ type: String }]
    },
    playlists: [{
        playlist: {
            name: { type: String, required: true },
            image: { type: String },
            items: [{ type: String }]
        }
    }]
});

const User = model('user', UserSchema);
module.exports = { User, Track };



