/**
 * @license Apache-2.0
 * @copyright 2025 Alexander Ore
 */

"use strict";

/**
 * node modules
 */
const mongoose = require("mongoose");

/**
 * Mongoose schema for song data
 */
const SongSchema = new mongoose.Schema(
  {
    artwork: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    songFile: { url: String, public_id: String },
    songTitle: { type: String, required: true },
    artistName: { type: String, required: true },
    albumTitle: { type: String },
    releaseYear: { type: Number },
    genre: { type: String },
    producer: { type: String },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    spotify: { type: String },
    appleMusic: { type: String },
    youtubeMusic: { type: String },
    boomplay: { type: String },
    tidal: { type: String },
    amazon: { type: String },
    pandora: { type: String },
    soundcloud: { type: String },
    audiomack: { type: String },
    deezer: { type: String },
    totalPlays: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Song", SongSchema);
