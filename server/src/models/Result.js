const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    debate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Debate",
      required: true
    },

    winner: {
      type: String,
      enum: ["user", "ai", "draw"]
    },

    scores: {
      logic: Number,
      persuasion: Number,
      clarity: Number
    },

    analysis: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);