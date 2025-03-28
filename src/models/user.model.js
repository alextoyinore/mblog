/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * Mongoose schema for user data
 */
const UserSchema = new mongoose.Schema({
    profileImage: { url: String, public_id: String },
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    bio: String,
    securityQuestion: {type: String},
    securityAnswer: {type: String},
    password: { type: String, required: true },
    songs: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Song' },
    playlist: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Song' },
    links: { url: String },
    songsPublished: { type: Number, default: 0 },
    favourites: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Song' },
    followers : {type: [mongoose.SchemaTypes.ObjectId], ref: 'User'},
    totalFollowers: { type: Number, default: 0 },
    totalVisits: { type: Number, default: 0 },
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

