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
    password: { type: String, required: true },
    posts: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Post' },
    links: String,
    postPublished: { type: Number, default: 0 },
    postSaved: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Post' },
    postLiked: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Post' },
    totalVisits: { type: Number, default: 0 },
    totalReactions: { type: Number, default: 0 },
    readingList: { type: [mongoose.SchemaTypes.ObjectId], ref: 'Post' }
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

