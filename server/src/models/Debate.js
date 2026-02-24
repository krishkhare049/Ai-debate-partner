const mongoose = require("mongoose");

const debateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    topic: {
      type: String,
      required: true
    },

    userStance: {
      type: String,
      enum: ["support", "oppose"],
      required: true
    },

    aiStance: {
      type: String,
      enum: ["support", "oppose"],
      required: true
    },
    personality: {
  type: String,
  enum: ["aggressive", "logical", "friendly", "political"],
  default: "logical"
},

isPublic: {
  type: Boolean,
  default: false
},

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debate", debateSchema);