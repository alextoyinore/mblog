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
const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    song: {
      type: mongoose.SchemaTypes.ObjectId, ref: "Song", required: true
    },
    comment: { type: String },
    totalLikes: { type: Number, default: 0 },
    // region: { type: String },
    // country: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);

