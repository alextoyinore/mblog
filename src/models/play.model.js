const mongoose = require("mongoose");

const PlaySchema = new mongoose.Schema(
  {
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Song", // Reference to the Song model
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Play", PlaySchema);

